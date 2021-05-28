/*
Genetic Algorithm Class Module
------------------------------
Implements a generic and configurable GA based optimizer.
Configuration object:
    - description: Problem description.
        * type: Function.
        * input: None.
        * output: Component. 
    - fitness: Fitness function to maximize. 
        * type: Function.
        * input: Optimization variable. May be number, array or object.
        * output: Should return a non negative scalar number (integer or float). 
    - decode: Function for decoding a chromosome's genotype and obtaining its phenotype.
        * type: Function.
        * input: Array.
        * output: Obtimization variable. May be number, array or object.
    - encode: Function for encoding a candidate solution (phenotype) and get its corresponding genotype.
        * type: Function.
        * input: Optimization variable. May be number, array or object.
        * output: Array.
    - beautify: Function for decoding a chromosome's genotype using a human-readable format.
        * type: Function.
        * input: Optimization variable. May be number, array or object.
        * output: String.
    - generator: Function to generate a random individual during initialization. 
        * type: Function.
        * input: None.
        * output: Optimization variable. May be number, array or object.
    - pop_size: Population size, number of chromosomes.
        * type: Non zero even Number (integer).
    - mut_prob: Mutation probability (probability of an allele to change).
        * type: Float number between 0 and 1. Usually 1/(bitstring length)
    - mut_fr: Mutation fraction (proportion of individuals to be exposed to mutation).    
        * type: Number.
    - mut_gen: Allele generator for mutation.    
        * type: Function.
        * input: None.
        * ouput: Number.
    - cross_prob: Crossover probability (probability that a pair of selected individuals to be crossovered).
        * type: Float number between 0 and 1.
    - elitism: Number of elite individuals. Elite individuals are force-preserved through generations.
        * type: Number (integer)
    - rank_r: Ranking parameter (In case of ranking based selection). High r increases selective pressure. 
        * type: Float number between 0 and 2/(pop_size*(pop_size-1)).
    - tourn_k: K parameter for tournament selection method
        * type: Integer number, usually between 2 and 5.
    - selection: Selection operator.
        * type: ROULETTE, RANK or TOURNAMENT.
    - crossover: Crossover operator.
        * type: SINGLE or DOUBLE.
    - mutation: Mutation operator.
        * type: BITFLIP, SWITCH or RAND.
*/

import { probability, sampleInt } from "../tools";
import Fitness from "../fitness/quadratic"; // Default fitness is an inverted parabola

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
    SWITCH: "switch",
    RAND: "rand" // Uses mut_gen as random generator
};


const default_config = { // Default parameters for simple scalar function
    pop_size: 20, 
    mut_prob: 0.2, 
    mut_fr: 0.6,
    mut_gen: () => Math.round(Math.random()),
    cross_prob: 0.9, 
    elitism: 1,
    rank_r: 0.002,
    tourn_k: 3,
    selection: selection.ROULETTE,
    crossover: crossover.SINGLE,
    mutation: mutation.BITFLIP,
    ...Fitness, // This extracts the fitness function attributes (may bring some overwriting parameters too)
};

class GA { // GA model class
    constructor(config){
        // Overwrite default with custom configuration
        this._config = { 
            ...default_config,
            ...config
        };

        // Create and initialize the array of individuals
        this._population = new Array(this._config.pop_size);
        this.reset(); // Init and sort the array
        
        // Number of individuals to be exposed to mutation
        this._mut_range = Math.floor(this._population.length * this._config.mut_fr);
        // Probability parameter for rank based selection operator
        this._rank_q = this._config.rank_r*(this._config.pop_size-1)/2 + 1/this._config.pop_size;

        // Configure operators (using public setters)
        this.selection = this._config.selection;
        this.mutation = this._config.mutation;
        this.crossover = this._config.crossover;

        console.log("GA initialized.");
    }

    reset() { // Restarts de algorithm
        this._init(this._population);
        // Sort population (selection requires ranked individuals)
        this._sort_pop();
        // Retart counters
        this._generation = 0; // Generation counter
        this._ff_evs = 0; // Fitness function evaluations counter        
        this._best_hist = [this._population[0].fitness]; // Historic values of best fitness
        this._avg_hist = [this._population[0].fitness]; // Historic values of population average fitness
    }

    _init(pop) { // Initialize/resets population genotypes
        for(let k = 0; k < pop.length; k++){
            const rand_genotype = this._config.generator();
            const genotype = this._config.encode(rand_genotype);
            pop[k] = {
                genotype: genotype
            }
            this._fitness(k);
        }                
    }

    _fitness(ind) { // This fitness function evaluates the k-th individual condition
        this._population[ind].fitness = this._config.fitness(this._config.decode(this._population[ind].genotype));
        this._ff_evs++;
    }


    //////////// INTERFACE ////////////

    /// Getters

    get generation() { // Current step number or generation
        return this._generation;
    }

    get population() { // Population or individual list
        return this._population;
    }

    get problem_description() {
        return this._config.description();
    }

    get status() { // Algorithm metrics (may be slow)
        return {            
            generation: this._generation,
            fitness_evals: this._ff_evs,
            population: this._population.map( p => ( // Add phenotypes to population 
                {
                    ...p,
                    phenotype: this._config.beautify(p.genotype), 
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
            case mutation.SWITCH:
                this._mutate = this._switch_mutation;
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
        return [{genotype: g1, fitness: Infinity}, {genotype: g2, fitness: Infinity}]; // Offspring is not evaluated yet
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

        return [{genotype: g1, fitness: Infinity}, {genotype: g2, fitness: Infinity}]; // Offspring is not evaluated yet
    }

    _pmx_crossover(k1, k2) {
        // TODO
        return [];
    }


    /// Mutation

    _bitflip_mutation(ind) { 
        // Applies bitflip mutation to individual "ind".
        for(let k = 0; k < this._population[ind].genotype.length; k++) // For every allele
            if( probability(this._config.mut_prob) ){ 
                this._population[ind].genotype[k] = this._population[ind].genotype[k] ? 0 : 1; // Bitflip
                this._population[ind].fitness = Infinity;
            }
    }

    _switch_mutation(ind) {
        // Applies allele switch mutation to individual "ind"
        for(let k = 0; k < this._population[ind].genotype.length; k++) // For every allele
            if( probability(this._config.mut_prob) ){ 
                let p = k;
                while(p === k)
                    p = Math.floor(Math.random() * this._population[ind].genotype.length); // The other position
                
                // Switch positions
                const temp = this._population[ind].genotype[k];
                this._population[ind].genotype[k] = this._population[ind].genotype[p];
                this._population[ind].genotype[p] = temp;
                
                this._population[ind].fitness = Infinity;
            }
    }

    _rand_allele_mutation(ind) {
        // Selects a random value for a random selected allele
        for(let k = 0; k < this._population[ind].genotype.length; k++) // For every allele
            if( probability(this._config.mut_prob) ){ 
                this._population[ind].genotype[k] = this._config.mut_gen();                
                this._population[ind].fitness = Infinity;
            }
    }

    _mut_selection() {
        // Returns selected chromosomes for mutation (in case of mutation proportion < 1)
        return this._config.mut_fr < 1 ? // Get indexes of the selected individual to mutate
            sampleInt(this._mut_range, this._population.length) // Array with random set of indexes
            : 
            Array.from(Array(this._population.length).keys()); // Return all elements
    }

    
    /// Iteration

    evolve(){ // Compute a generation cycle
        // Select parents list for crossover
        const cr_selected = this._cr_selection(); 
        
        // Obtain the children list and push into population
        for(let k = 0; k < cr_selected.length-1; k += 2)
            if(probability(this._config.cross_prob)){
                //const children = this._crossover(cr_selected[k], cr_selected[k+1]);
                //this._population[cr_selected[k]] = children[0];
                //this._population[cr_selected[k+1]] = children[1];
                this._population.push(...this._crossover(cr_selected[k], cr_selected[k+1])); 
            }
        
        // Apply mutation
        const mut_selected = this._mut_selection();
        for(let j in mut_selected)
            this._mutate(mut_selected[j]);

        // Compute population fitness values and sort from best to worst
        this._population.map( (p, ind) => this._fitness(ind) );
        this._sort_pop();
        this._population.splice(this._config.pop_size); 
        
        // Record the new best and average values
        this._best_hist.push(this._population[0].fitness);
        this._avg_hist.push( this._fitness_sum / this._config.pop_size );

        this._generation++;
    }
}


export default GA;
export {selection, crossover, mutation};