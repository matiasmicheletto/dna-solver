/*
Genetic Algorithm Class Module
------------------------------
Implements a generic and configurable GA based optimizer.

Configuration object:    
    - doc: Problem description provided by fitness function model.
        * type: Function. The output string is rendered using problem parameters.
        * input: None.
        * output: String.
    - pop_size: Population size, number of chromosomes.
        * type: Non zero even Number (integer).
    - elitism: Number of elite individuals. Elite individuals are force-preserved through generations.
        * type: Number (integer).
    - cross_prob: Crossover probability (probability that a pair of selected individuals to be crossovered).
        * type: Float number between 0 and 1.
    - mut_prob: Mutation probability (probability of an allele to change).
        * type: Float number between 0 and 1. Usually 1/(bitstring length).
    - mut_fr: Mutation fraction (proportion of individuals to be exposed to mutation).    
        * type: Number.
    - mut_gen: Allele generator for mutation.    
        * type: Function.
        * input: None.
        * ouput: Number.
    - rank_r: Ranking parameter (In case of ranking based selection). High r increases selective pressure. 
        * type: Float number between 0 and 2/(pop_size*(pop_size-1)).
    - tourn_k: K parameter for tournament selection method.
        * type: Integer number, usually between 2 and 5.
    - selection: Selection operator.
        * type: ROULETTE, RANK or TOURNAMENT.
    - crossover: Crossover operator.
        * type: SINGLE or DOUBLE.
    - mutation: Mutation operator.
        * type: BITFLIP, SWAP or RAND.
*/
import { probability, random_select, generate_id, random_name } from "../tools";


// Enumerators
const selection = {
    ROULETTE: "roulette",
    RANK: "rank",
    TOURNAMENT: "tournament"
};

const crossover = {
    SINGLE: "single",
    DOUBLE: "double",
    PMX: "pmx"
};

const mutation = {
    BITFLIP: "bitflip", // Only for bitstring encoding
    SWAP: "swap",
    RAND: "rand" // Uses mut_gen as random generator
};

const default_config = { // Default parameters for simple scalar function
    doc: "N/D",
    pop_size: 20, 
    elitism: 2,
    cross_prob: 0.8, 
    mut_prob: 0.2, 
    mut_fr: 0.6,
    mut_gen: () => Math.round(Math.random()),
    rank_r: 0.002,
    tourn_k: 3,
    selection: selection.ROULETTE,
    crossover: crossover.SINGLE,
    mutation: mutation.BITFLIP
};

class GA { // GA model class
    constructor(config){
        // Overwrite default with custom configuration
        this._config = { 
            ...default_config,
            ...config
        };

        // Objective function should be passed through config object
        if(!this._config.fitness){
            console.warn("Fitness function is not defined!");
            return;
        }

        // The optimizer should be always linked to a fitness function
        this._fitness_id = this._config.fitness_id;

        // Create and initialize the array of individuals
        this._population = new Array(this._config.pop_size);
        this.reset(); // Init and sort the array
        
        // Number of individuals to be exposed to mutation
        this._mut_range = Math.floor(this._population.length * this._config.mut_fr);
        
        if(this._config.selection === selection.RANK)
            // Probability parameter for rank based selection operator
            this._rank_q = this._config.rank_r*(this._config.pop_size-1)/2 + 1/this._config.pop_size;

        // Configure operators (IMPORTANT: The following are setters)
        this.selection = this._config.selection;
        this.mutation = this._config.mutation;
        this.crossover = this._config.crossover;

        this._id = generate_id(); // Object identifier
        this._name = random_name(); // Readable identifier (may be repeated)

        console.log("GA initialized.");
    }

    reset() { // Restarts de algorithm
        // Generate random genotypes for each individual and evaluates its condition
        this._init(this._population);
        // Sort population (selection requires ranked individuals)
        this._sort_pop();
        // Restart counters
        this._generation = 0; // Generation counter
        this._ff_evs = 0; // Fitness function evaluations counter        
        this._best_hist = [this._population[0].fitness]; // Historic values of best fitness
        this._avg_hist = [this._population[0].fitness]; // Historic values of population average fitness
    }

    _init(pop) { // Initialize/resets population genotypes
        for(let k = 0; k < pop.length; k++){
            const genotype = this._config.rand_encoded();    
            pop[k] = {
                genotype: genotype
            }
            this._fitness(k);
        }                
    }

    _fitness(ind) { // This fitness function evaluates the ind-th individual condition
        this._population[ind].fitness = this._config.fitness(this._population[ind].genotype);
        this._population[ind].evaluated = true;
        this._ff_evs++;
    }


    //////////// INTERFACE ////////////

    /// Getters

    get name() {
        return this._name;
    }

    get id() {
        return this._id;
    }

    get fitness_id() {
        return this._fitness_id;
    }

    get generation() {
        return this._generation;
    }

    get population() { // Population or individual list
        return this._population;
    }

    get problem_info() { // Problem description
        return this._config.doc();
    }

    get status() { // Algorithm metrics (may be slow)
        return {    
            best: this._config.decode(this._population[0].genotype),
            best_fitness: this._population[0].fitness,
            best_hist: this._best_hist,
            avg_hist: this._avg_hist,
            generation: this._generation,
            fitness_evals: this._ff_evs,
            population: this._population.map( p => ( // Add phenotypes and objective values to population 
                {
                    ...p,
                    phenotype: this._config.decode(p.genotype), 
                    objective: this._config.objective(p.genotype)
                }
            ))
        }
    }

    /// Setters
    set pop_size(p) { 
        // Changing the population size adds or removes individuals regardless of the current state of the algorithm
        if(p > this._config.pop_size){ // Add individuals
            let new_pop = new Array(p - this._config.pop_size);
            this._init(new_pop);
            this._population = this._population.concat(new_pop);
        }else // Remove leftover individuals
            this._population.splice(p);
        
        this._config.pop_size = p;
        // Update the q parameter as it depends on the population size
        this._rank_q = this._config.rank_r*(this._config.pop_size-1)/2 + 1/this._config.pop_size;
    }

    set selection(s) { 
        // Set the selection method
        switch(s){
            default: // Default is roulette
            case selection.ROULETTE:
                this._cr_selection = this._roulette_selection;
                break;
            case selection.RANK:
                this._cr_selection = this._rank_selection;
                break;
            case selection.TOURNAMENT:
                this._cr_selection = this._tournament_selection;
                break;            
        }
        this._config.selection = s;
    }

    set crossover(c) {
        // Set the crossover method
        switch(c){
            default: // Default is single point 
            case crossover.SINGLE:
                this._crossover = this._single_point_crossover;
                break;
            case crossover.DOUBLE:
                this._crossover = this._double_point_crossover;
                break;
            case crossover.PMX:
                this._crossover = this._pmx_crossover;
                break;
        }
        this._config.crossover = c;
    }

    set mutation(m) {
        // Set the mutation method
        switch(m){
            default: // Default is bitflip 
            case mutation.BITFLIP:
                this._mutate = this._bitflip_mutation;
                break;
            case mutation.SWAP:
                this._mutate = this._swap_mutation;
                break;
            case mutation.RAND:
                this._mutate = this._rand_allele_mutation;
                break
        }
        this._config.mutation = m;
    }
    
    //////////// HELPERS ///////////
    _fitness_sum() { 
        // Sum of fitness values
        return this._population.reduce((r, a) => a.fitness + r, 0);
    }

    _sort_pop() {
        // Sort population from best to worst fitness
        this._population.sort((a,b) => (b.fitness - a.fitness) );
    }


    //////////// GA METHODS ////////////

    /// Selection

    _roulette_selection() { 
        // Uses probability of selection proportional to fitness
        let selected = [];
        const sf = this._fitness_sum(); 
        for(let i = 0; i < this._population.length; i++){
            const r = Math.random()*sf; // Random number from 0 to sum
            let s = 0; // Partial adder
            for(let k in this._population){ // Population should be sorted from best to worst
                s += this._population[k].fitness;
                if(s >= r){ // If random value reached
                    selected.push(k); // Add individual   
                    break;
                }
            }
        }       
        return selected;
    }

    _rank_selection() {
        // Uses linear distribution of probabilities based on ranking
        let selected = [];
        for(let i = 0; i < this._population.length; i++){
            const r = Math.random(); 
            let s = 0; // Partial adder
            for(let k = 0; k < this._population.length; k++){ // Population should be sorted from best to worst
                s += this._rank_q - k * this._config.rank_r;
                if(s >= r){ // If random value reached
                    selected.push(k); // Add individual   
                    break;
                }
            }
        }       
        return selected;
    }

    _tournament_selection() {
        // Performs pop_size fitness comparations beetween k selected individuals
        let selected = [];
        for(let i = 0; i < this._population.length; i++){
            let tournament = [];
            for(let k = 0; k < this._config.tourn_k; k++)
                tournament.push(Math.floor(Math.random()*this._population.length));
            tournament.sort((a,b)=>(b - a)); // Lower index has better fitness
            selected.push(tournament[0]);
        }
        return selected;
    }


    /// Crossover

    _single_point_crossover(k1, k2) { 
        // Performs crossover between parents k1 and k2 and returns their children
        const p = Math.floor(Math.random() * (this._population[k1].genotype.length - 2) + 1); // Crossover point
        const g1 = [...this._population[k1].genotype.slice(0, p), ...this._population[k2].genotype.slice(p)];
        const g2 = [...this._population[k2].genotype.slice(0, p), ...this._population[k1].genotype.slice(p)];        
        this._population[k1] = {
            genotype: g1,
            fitness: 0,
            evaluated: false
        }
        this._population[k2] = {
            genotype: g2,
            fitness: 0,
            evaluated: false
        }
    }

    _double_point_crossover(k1, k2) {
        // Performs crossover between parents k1 and k2 and returns their children
        const r1 = Math.floor(Math.random() * (this._population[k1].genotype.length - 2) + 1); // Crossover point 1
        const r2 = Math.floor(Math.random() * (this._population[k1].genotype.length - 2) + 1); // Crossover point 2

        // Sort crossover points such that p1 < p2
        let p1 = r1; let p2 = r2;
        if( p1 > p2 ){
            p1 = r2;
            p2 = r1;
        }

        // Perform genotype copy
        const g1 = [...this._population[k1].genotype.slice(0, p1), ...this._population[k2].genotype.slice(p1, p2), ...this._population[k1].genotype.slice(p2)];
        const g2 = [...this._population[k2].genotype.slice(0, p1), ...this._population[k1].genotype.slice(p1, p2), ...this._population[k2].genotype.slice(p2)];

        this._population[k1] = {
            genotype: g1,
            fitness: 0,
            evaluated: false
        }

        this._population[k2] = {
            genotype: g2,
            fitness: 0,
            evaluated: false
        }
    }

    _pmx_crossover(k1, k2) {
        // Partially mapped crossover
        // https://gist.github.com/celaus/d5a55e723ce233f2b83af36a4cf456b4
        const s = this.population[k1].genotype;
        const t = this.population[k2].genotype;

        let _map1 = {};
        let _map2 = {};

        const x1 = Math.floor(Math.random() * (s.length - 1));
        const x2 = x1 + Math.floor(Math.random() * (s.length - x1));

        let g1 = [...Array.from(s)];
        let g2 = [...Array.from(t)];

        for (let i = x1; i < x2; i++) {
            g1[i] = t[i];
            _map1[t[i]] = s[i];
            g2[i] = s[i];
            _map2[s[i]] = t[i];
        }

        for (let i = 0; i < x1; i++) {
            while (g1[i] in _map1) 
                g1[i] = _map1[g1[i]];
            while (g2[i] in _map2)
                g2[i] = _map2[g2[i]];
        }

        for (let i = x2; i < s.length; i++) {
            while (g1[i] in _map1) 
                g1[i] = _map1[g1[i]];
            while (g2[i] in _map2) 
                g2[i] = _map2[g2[i]];
        }

        this._population[k1] = {
            genotype: g1,
            fitness: 0,
            evaluated: false
        }

        this._population[k2] = {
            genotype: g2,
            fitness: 0,
            evaluated: false
        }
    }


    /// Mutation

    _bitflip_mutation(ind) { 
        // Applies bitflip mutation to individual "ind". This method is stochastic so no changes may be applied
        let changes = false;
        let newg = [...this._population[ind].genotype]; // Copy of the original genotype
        for(let k = 0; k < newg.length; k++) // For every allele
            if( probability(this._config.mut_prob) ){ 
                newg[k] = newg[k] ? 0 : 1; // Bitflip
                changes = true;
            }
        if(changes){ // Mark individual as not evaluated
            this._population[ind] = {
                genotype: newg,
                fitness: 0,
                evaluated: false
            }
        }
    }

    _swap_mutation(ind) {
        // Applies allele position swap to individual "ind". This method is stochastic so no changes may be applied
        let changes = false;
        let newg = [...this._population[ind].genotype]; // Copy of the original genotype
        for(let k = 0; k < newg.length; k++) // For every allele
            if( probability(this._config.mut_prob) ){ 
                let p = k;
                while(p === k)
                    p = Math.floor(Math.random() * newg.length); // The other position
                // Swap positions                
                [newg[k], newg[p]] = [newg[p], newg[k]];
                changes = true;
            }
        if(changes){ // Mark individual as not evaluated
            this._population[ind] = {
                genotype: newg,
                fitness: 0,
                evaluated: false
            }
        }
    }

    _rand_allele_mutation(ind) {
        // Selects a random value for a random selected allele. This method is stochastic so no changes may be applied
        let changes = false;
        let newg = [...this._population[ind].genotype]; // Copy of the original genotype
        for(let k = 0; k < newg.length; k++) // For every allele
            if( probability(this._config.mut_prob) ){ 
                newg[k] = this._config.mut_gen();                
                changes = true;
            }

        if(changes){ // Mark individual as not evaluated
            this._population[ind] = {
                genotype: newg,
                fitness: 0,
                evaluated: false
            }
        }
    }

    _mut_selection() {        
        // Returns selected chromosomes for mutation (in case of mutation proportion < 1)
        return this._config.mut_fr < 1 ? // Get indexes of the selected individual to mutate
            random_select(this._mut_range, this._population.length) // Array with random set of indexes
            : 
            Array.from(Array(this._population.length).keys()); // Return all elements
    }

    
    /// Iteration

    evolve(){ // Compute a generation cycle. Population list is sorted by fitness value
        
        // Copy elite individuals if elitism is configured
        const elite = this._config.elitism > 0 ? [...this._population.slice(0, this._config.elitism)] : null;        
        
        // Select parents list for crossover
        const cr_selected = this._cr_selection(); 

        // Apply crossover to selected individuals
        for(let k = 0; k < cr_selected.length-1; k += 2)
            if(probability(this._config.cross_prob))
                this._crossover(cr_selected[k], cr_selected[k+1]);                
        
        // Apply mutation
        const mut_selected = this._mut_selection();
        for(let j in mut_selected)
            this._mutate(mut_selected[j]);

        // Compute population fitness values for not evaluated individuals
        this._population.forEach( (p, ind) => {
            if(!p.evaluated) 
                this._fitness(ind);
        });

        // Restore elite individuals to population (already evaluated)
        if(this._config.elitism > 0)
            this._population.push(...elite);            

        // Sort population from best to worst fitness
        this._sort_pop();

        // Remove individuals that not survive 
        this._population.splice(this._config.pop_size); 
        
        // Record the new best and average values
        this._best_hist.push(this._population[0].fitness);
        this._avg_hist.push( this._fitness_sum / this._config.pop_size );

        this._generation++;
    }
}


export default GA;
export {selection, crossover, mutation};