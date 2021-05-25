import { replaceChar, probability, sample_int } from "../tools";

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
    fitness: (x) => (x-181)*(x-181), // Should return integer or float (Minima at 0000000010110101)
    decode: (b) => parseInt(b.slice(-nbit), 2), // Should return optimization variable format
    encode: (d) => d.toString(2).padStart(nbit,"0").slice(-nbit), // Should return string
    generator: () => Math.floor(Math.random() * Math.pow(2,nbit)), // Generates a random individual. Should return optimization variable format
    pop_size: 20, // Population size
    mut_prob: 0.2, // Mutation probability
    mut_fr: 0.8, // Mutation fraction (proportion of individuals to be exposed to mutation)    
    cross_prob: 0.9, // Crossover probability
    elitism: 1, // Number of elite individuals (0 for no elitism)
    rank_r: 0.002, // Ranking parameter (In case of ranking based selection)
    selection: selection.ROULETTE,
    crossover: crossover.SINGLE,
    mutation: mutation.INVERT
};

class GA { // Performs minimization of fitness function
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

        // Configure operators (using public setters)
        this.selection = this._config.selection;
        this.mutation = this._config.mutation;
        this.crossover = this._config.crossover;

        console.log("GA initialized.");
    }

    reset() { // Restarts de algorithm
        this._init(this._population);
        this._generation = 0; // Generation counter
        this._ff_evs = 0; // Fitness function evaluations counter
    }

    _init(pop) { // Initialize/resets population genotypes                
        for(let k = 0; k < pop.length; k++){
            const rand_genotype = this._config.generator();
            const genotype = this._config.encode(rand_genotype);
            pop[k] = {
                genotype: genotype,
                fitness: Infinity
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
            generation: this._generation, // Current step or generation number
            fitness_evals: this._ff_evs,
            population: this._population.map( p => ( // Add phenotypes to population 
                {
                    ...p,
                    phenotype: this._config.decode(p.genotype), // Converted to string for displaying
                }
            ))
        }
    }

    /// Setters
    set pop_size(p) { 
        // Changing the population size adds or removes individuals regardless of the current state of the algorithm
        let current_size = this._population.length;
        if(p > current_size){ // Add individuals
            let new_pop = new Array(p - current_size);
            this._init(new_pop);
            this._population = this._population.concat(new_pop);
        }else // Remove leftover individuals
            this._population.splice(p);
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
    }
    
    //////////// GA METHODS ////////////

    /// Selection

    _roulette_selection() { 
        // Returns selected chromosomes in pairs for crossover 
        return [[0,1],[2,3],[4,5], [6,7]]; // Static
    }

    _rank_selection() {
        // Returns selected chromosomes in pairs for crossover

        return [[0,1],[2,3],[4,5], [6,7]]; // Static
    }

    _tournament_selection() {
        return [[0,1],[2,3],[4,5], [6,7]]; // Static
    }


    /// Crossover

    _single_point_crossover(k1, k2) { 
        // Performs crossover between parents k1 and k2 and returns their children
        const p = Math.floor(Math.random() * (this._population[k1].genotype.length - 2) + 1); // Crossover point
        const g1 = this._population[k1].genotype.substring(0, p) + this._population[k2].genotype.substring(p);
        const g2 = this._population[k2].genotype.substring(0, p) + this._population[k1].genotype.substring(p);                
        return [{genotype: g1, fitness: Infinity}, {genotype: g2, fitness: Infinity}]; // Offspring is not evaluated yet
    }

    _double_point_crossover(k1, k2) {
        // Performs crossover between parents k1 and k2 and returns their children
        const r1 = Math.floor(Math.random() * (this._population[k1].genotype.length - 2) + 1); // Crossover point 1
        const r2 = Math.floor(Math.random() * (this._population[k1].genotype.length - 2) + 1); // Crossover point 2

        // Sort crossover points
        let p1 = r1; let p2 = r2;
        if( p1 > p2 ){
            p1 = r2;
            p2 = r1;
        }

        // Perform genotype copy
        const g1 = this._population[k1].genotype.substring(0, p1) + this._population[k2].genotype.substring(p1, p2) + this._population[k1].genotype.substring(p2);
        const g2 = this._population[k2].genotype.substring(0, p1) + this._population[k1].genotype.substring(p1, p2) + this._population[k2].genotype.substring(p2);

        return [{genotype: g1, fitness: Infinity}, {genotype: g2, fitness: Infinity}]; // Offspring is not evaluated yet
    }


    /// Mutation

    _invert_mutation(ind) { 
        // Applies mutation to a list of individuals.
        for(let k = 0; k < this._population[ind].genotype.length; k++) // For every allele
            if( probability(this._config.mut_prob) ){ 
                const sw = this._population[ind].genotype[k] === "1" ? "0" : "1";
                this._population[ind].genotype = replaceChar(this._population[ind].genotype, k, sw);
                this._population[ind].fitness = Infinity;
            }
    }

    _switch_mutation(ind) {
        for(let k = 0; k < this._population[ind].genotype.length; k++) // For every allele
            if( probability(this._config.mut_prob) ){ 
                let p = k;
                while(p === k)
                    p = Math.floor(Math.random() * this._population[ind].genotype.length); // The other position
                this._population[ind].genotype = replaceChar(this._population[ind].genotype, k, this._population[ind].genotype[p]);
                this._population[ind].fitness = Infinity;
            }
    }


    /// Generation

    evolve(){ // Compute a generation cycle
        // Select parents list for crossover
        const selected = this._selection(); 
        
        // Obtain the children list and push into population
        for(let k in selected)
            if(probability(this._config.cross_prob))
                this._population.push(...this._crossover(selected[k][0], selected[k][1]));        
        
        // Apply mutation
        const ind = this._config.mut_fr < 1 ? // Get indexes of the selected individual to mutate
            sample_int(this._mut_range, this._config.pop_size) // Array with random set of indexes
            : 
            Array.from(Array(this._config.pop_size).keys()); // Array with indexes as elements
        for(let j in ind)
            this._mutate(ind[j]);

        // Compute population fitness values and sort from best to worst
        // TODO: elitism
        this._population.map( (p, ind) => this._fitness(ind) );
        this._population.sort((a,b) => (a.fitness - b.fitness) );
        this._population.splice(this._config.pop_size); // Remove worst conditioned individuals
        
        this._generation++;
    }
}


export default GA;
export {selection, crossover, mutation};