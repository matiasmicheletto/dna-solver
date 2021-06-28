/*
Genetic Algorithm Class Module
------------------------------
Implements a generic and configurable GA based optimizer.

Configuration object:
    - fitness: Fitness instance
        * type: Fitness
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
    - best_fsw_factor: Window size for getting the best final slope value proportional to generation number.
        * type: Float number.
    - avg_fsw_factor: Window size for getting the average final slope value proportional to generation number.
        * type: Float number.
    - selection: Selection operator.
        * type: ROULETTE, RANK or TOURNAMENT.
    - crossover: Crossover operator.
        * type: SINGLE or DOUBLE.
    - mutation: Mutation operator.
        * type: BITFLIP, SWAP or RAND.
*/
import { 
    probability, 
    random_select, 
    generate_id, 
    random_name, 
    final_slope 
} from "../tools/index.mjs";


// Operators enumerators
export const selection = {
    ROULETTE: "roulette",
    RANK: "rank",
    TOURNAMENT: "tournament"
};

export const crossover = {
    SINGLE: "single",
    DOUBLE: "double",
    PMX: "pmx"
};

export const mutation = {
    BITFLIP: "bitflip", // Only for bitstring encoding
    SWAP: "swap", // Swap positions
    RAND: "rand" // Uses mut_gen function as random generator
};


// Default parameters (tunned for general purpose)
const default_config = { 
    pop_size: 20, 
    elitism: 2,
    cross_prob: 0.5, 
    mut_prob: 0.1, 
    mut_fr: 0.6,
    mut_gen: () => Math.round(Math.random()), // Used for mutation.RAND
    rank_r: 0.002,
    tourn_k: 3,
    best_fsw_factor: 0.2,
    avg_fsw_factor: 0.5,
    selection: selection.ROULETTE,
    crossover: crossover.SINGLE,
    mutation: mutation.BITFLIP
};

export default class Ga { // GA model class
    constructor(fitness, config = {}){
        this._fitness = fitness;
        
        // Overwrite default configuration parameters with those that
        // are default for the fitness function, and then override
        // everything with the custom parameters.
        this._config = { 
            ...default_config,
            ...this._fitness.ga_config,
            ...config
        };

        // Create and initialize the array of individuals
        this._population = new Array(this._config.pop_size);
        this.reset(); // Init and sort the array

        // Number of individuals to be exposed to mutation
        this._mut_range = Math.floor(this._population.length * this._config.mut_fr);

        // Probability parameter for rank based selection operator
        this._rank_q = this._config.rank_r*(this._config.pop_size-1)/2 + 1/this._config.pop_size;

        // Configure operators (IMPORTANT: The following are setters)
        this.selection = this._config.selection;
        this.mutation = this._config.mutation;
        this.crossover = this._config.crossover;

        this._id = generate_id(); // Object unique identifier
        this._name = random_name(); // Readable identifier (may be repeated)

        console.log(`New optimizer "${this._name}" initialized (ID: ${this._id}).`);
    }

    reset() { // Restarts de algorithm
        // Generate random genotypes for each individual and evaluate its condition
        for(let k = 0; k < this._population.length; k++){
            this._population[k] = { genotype: this._fitness.rand_encoded() };
            this._eval(k);
        }
        // Sort population (selection requires ranked individuals)
        this._sort_pop();
        // Restart counters
        this._generation = 0; // Generation counter
        this._ff_evs = 0; // Fitness function evaluations counter
        this._best_hist = []; // Historic values of best fitness
        this._avg_hist = []; // Historic values of population average fitness
        this._best_fs_hist = [];
        this._avg_fs_hist = [];
    }

    _eval(ind) { // This fitness function evaluates the ind-th individual condition
        this._population[ind].fitness = this._fitness.eval(this._population[ind].genotype);
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
        return this._fitness.id;
    }

    get generation() {
        return this._generation;
    }

    get population() { // Population or individual list
        return this._population.map( p => ( // Add objective values
            {
                ...p,
                objective: this._fitness.objective(p.genotype)
            }
        ));
    }

    get config() { // Get current configuration
        return this._config;
    }

    get fitness() { // Fitness object (used mostlty to determine class)
        return this._fitness;
    }

    get status() { // Algorithm metrics (may be slow)
        return {
            name: this._name,
            id: this._id,
            // Absolute values
            best: this._population[0].genotype,
            best_fitness: this._population[0].fitness,
            best_objective: this._fitness.objective_str(this._population[0].genotype),
            best_final_slope: this._best_final_slope,
            avg_final_slope: this._avg_final_slope,
            generation: this._generation,
            fitness_evals: this._ff_evs,
            // Historic values
            best_hist: this._best_hist,
            avg_hist: this._avg_hist,
            best_fs_hist: this._best_fs_hist,
            avg_fs_hist: this._avg_fs_hist,
            // Current state of population
            population: this.population // Use the getter method
        }
    }

    /// Setters
    set name(n) {
        console.log('"'+this._name+'" is now called "'+n+'"');
        this._name = n;
    }

    set pop_size(p) { 
        // Changing the population size adds or removes individuals regardless of the current state of the algorithm
        if(p < 2){ 
            console.log("GA POP_SIZE parameter should not be smaller than 2");
            return;
        }
        
        if(p > this._config.pop_size){ // Add individuals
            let new_pop = new Array(p - this._config.pop_size);
            this._population = this._population.concat(new_pop);
            // Evaluate added individuals
            for(let k = this._config.pop_size; k < this._population.length; k++){
                this._population[k] = { genotype: this._fitness.rand_encoded() };
                this._eval(k);
            }
            this._sort_pop(); // Sort again
        }else // Remove leftover individuals from bottom to top (worst to best)
            this._population.splice(p);

        this._config.pop_size = p;
        // Update the q parameter as it depends on the population size
        this._rank_q = this._config.rank_r*(this._config.pop_size-1)/2 + 1/this._config.pop_size;
        // The same for the mutation range
        this._mut_range = Math.floor(this._population.length * this._config.mut_fr);
    }

    set elitism(e) {
        this._config.elitism = e;
    }

    set cross_prob(v) {
        this._config.cross_prob = v;
    }

    set mut_prob(v) {        
        this._config.mut_prob = v;        
    }

    set mut_fr(v) {
        this._config.mut_fr = v;
    }

    set rank_r(v) {
        this._config.rank_r = v;
        this._rank_q = this._config.rank_r*(this._config.pop_size-1)/2 + 1/this._config.pop_size;
    }

    set tourn_k(v) {
        this._config.tourn_k = v;
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

    _update_stats() {
        // Record the new best and average values
        this._best_hist.push(this._population[0].fitness);
        this._avg_hist.push( this._fitness_sum() / this._config.pop_size );
        
        // Obtain the convergence metrics
        const best_fsw = Math.ceil(this._config.best_fsw_factor*this._generation);
        const avg_fsw = Math.ceil(this._config.avg_fsw_factor*this._generation);
        this._best_final_slope = final_slope(this._best_hist, best_fsw);
        this._avg_final_slope = final_slope(this._avg_hist, avg_fsw);

        // Record the convergence metrics
        this._best_fs_hist.push(this._best_final_slope); 
        this._avg_fs_hist.push(this._avg_final_slope);
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
                this._eval(ind);
        });

        // Restore elite individuals to population (already evaluated)
        if(this._config.elitism > 0)
            this._population.push(...elite);

        // Sort population from best to worst fitness
        this._sort_pop();

        // Remove individuals that do not survive 
        this._population.splice(this._config.pop_size); 

        // Save evolution metrics
        this._update_stats();

        this._generation++;
    }
}