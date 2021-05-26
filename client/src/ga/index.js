/*
Genetic Algorithm Class Module
------------------------------
Implements a generic and configurable GA based optimizer.
Configuration object:
    - fitness: Fitness function to maximize. 
        * type: Functiom.
        * input: Optimization variable. May be number, array or object.
        * output: Should return a scalar number (integer or float). 
    - decode: Function for decoding a chromosome's genotype and obtaining its phenotype.
        * type: Functiom.
        * input: Array.
        * output: Obtimization variable. May be number, array or object.
    - encode: Function for encoding a candidate solution (phenotype) and get its corresponding genotype.
        * type: Functiom.
        * input: Optimization variable. May be number, array or object.
        * output: Array.
    - generator: Function to generate a random individual during initialization. 
        * type: Functiom.
        * input: None.
        * output: Optimization variable. May be number, array or object.
    - pop_size: Population size, number of chromosomes.
        * type: Non zero even Number (integer).
    - mut_prob: Mutation probability (probability of an allele to change).
        * type: Number.
    - mut_fr :Mutation fraction (proportion of individuals to be exposed to mutation).    
        * type: Number.
    - cross_prob: Crossover probability (probability that a pair of selected individuals to be crossovered).
        * type: Number.
    - elitism: Number of elite individuals. Elite individuals are force-preserved through generations.
        * type: Number (integer)
    - rank_r: Ranking parameter (In case of ranking based selection). High r increases selective pressure.
        * type: Number.
    - selection: Selection method.
        * type: selection: ROULETTE, RANK or TOURNAMENT.
    - crossover: Crossover operator.
        * type: SINGLE or DOUBLE.
    - mutation: Mutation operator.
        * type: INVERT or SWITCH.
*/

import { probability, sample_int } from "../tools";

// Enumerators
const selection = {
    ROULETTE: "roulette",
    RANK: "rank",
    TOURNAMENT: "tournament"
};

const crossover = {
    SINGLE: "single",
    DOUBLE: "double"
};

const mutation = {
    INVERT: "invert",
    SWITCH: "switch"
};

// Other default constants
const nbit = 16; // Bitlength for genotypes encoding (used only for default config)

const default_config = { // Default parameters for simple scalar function
    fitness: (x) => 10000-(x-181)*(x-181), // (Maxima at 0000000010110101)
    decode: (b) => parseInt(b.join("").slice(-nbit), 2),
    encode: (d) => d.toString(2).padStart(nbit,"0").slice(-nbit).split("").map(e=>parseInt(e)),
    generator: () => Math.floor(Math.random() * Math.pow(2,nbit)), 
    pop_size: 20, 
    mut_prob: 0.1, 
    mut_fr: 0.6,
    cross_prob: 0.9, 
    elitism: 1,
    rank_r: 0.002,
    selection: selection.ROULETTE,
    crossover: crossover.SINGLE,
    mutation: mutation.INVERT
};

class GA { // GA model class
    constructor(config){
        // Merge default and custom configurations
        this._config = { 
            ...default_config,
            ...config
        };

        // Create and initialize the array of individuals
        this._population = new Array(this._config.pop_size);
        this.reset();
        
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
        this._population.sort((a,b) => (a.fitness - b.fitness) );
        // Retart counters
        this._generation = 0; // Generation counter
        this._ff_evs = 0; // Fitness function evaluations counter        
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

    get status() { // Algorithm metrics (may be slow)
        return {
            generation: this._generation,
            fitness_evals: this._ff_evs,
            population: this._population.map( p => ( // Add phenotypes to population 
                {
                    ...p,
                    phenotype: this._config.decode(p.genotype), 
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
                this._selection = this._roulette_selection;
                break;
            case selection.RANK:
                this._selection = this._rank_selection;
                break;
            case selection.TOURNAMENT:
                this._selection = this._tournament_selection;
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
        }
        this._config.crossover = c;
    }

    set mutation(m) {
        // Set the mutation method
        switch(m){
            default: // Default is invert 
            case mutation.INVERT:
                this._mutate = this._invert_mutation;
                break;
            case mutation.SWITCH:
                this._mutate = this._switch_mutation;
                break;
        }
        this._config.mutation = m;
    }
    
    //////////// GA METHODS ////////////

    /// Selection

    _roulette_selection() { 
        // Returns selected chromosomes in pairs for crossover 

        return [[0,1],[2,3],[4,5],[6,7]]; // Static
    }

    _rank_selection() {
        // Returns selected chromosomes in pairs for crossover
        return [[0,1],[2,3],[4,5],[6,7]]; // Static
    }

    _tournament_selection() {
        return [[0,1],[2,3],[4,5],[6,7]]; // Static
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


    /// Mutation

    _invert_mutation(ind) { 
        // Applies bitflip mutation to individual "ind".
        for(let k = 0; k < this._population[ind].genotype.length; k++) // For every allele
            if( probability(this._config.mut_prob) ){ 
                this._population[ind].genotype[k] = this._population[ind].genotype[k] ? 0 : 1;
                this._population[ind].fitness = Infinity;
            }
    }

    _switch_mutation(ind) {
        // Applies bit switch mutation to individual "ind"
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

    
    /// Generation

    evolve(){ // Compute a generation cycle
        // Select parents list for crossover
        const selected = this._selection(); 
        
        // Obtain the children list and push into population
        for(let k in selected)
            if(probability(this._config.cross_prob)){
                //const children = this._crossover(selected[k][0], selected[k][1]);
                //this._population[selected[k][0]] = children[0];
                //this._population[selected[k][1]] = children[1];
                
                this._population.push(...this._crossover(selected[k][0], selected[k][1]));        
            }
        
        // Apply mutation
        const ind = this._config.mut_fr < 1 ? // Get indexes of the selected individual to mutate
            sample_int(this._mut_range, this._population.length) // Array with random set of indexes
            : 
            Array.from(Array(this._population.length).keys()); // Array with indexes as elements
        for(let j in ind)
            this._mutate(ind[j]);

        // Compute population fitness values and sort from best to worst
        // TODO: elitism
        this._population.map( (p, ind) => this._fitness(ind) );
        this._population.sort((a,b) => (b.fitness - a.fitness) );
        this._population.splice(this._config.pop_size); // Remove worst conditioned individuals
        
        this._generation++;
    }
}


export default GA;
export {selection, crossover, mutation};