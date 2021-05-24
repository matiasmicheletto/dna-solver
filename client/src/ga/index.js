import { replaceChar, probability, sample_int } from "../tools";

const nbit = 16; // Bitlength for genotypes encoding (used only for default config)

const default_config = { // Default parameters for simple scalar function
    fitness: (x) => (x-181)*(x-181)+256, // Should return integer or float (Minima at 0000000010110101)
    decode: (b) => parseInt(b.slice(-nbit), 2), // Should return optimization variable format
    encode: (d) => d.toString(2).padStart(nbit,"0").slice(-nbit), // Should return string
    generator: () => Math.floor(Math.random() * Math.pow(2,nbit)), // Generates a random individual. Should return optimization variable format
    pop_size: 20, // Population size
    mut_prob: 1/nbit, // Mutation probability
    mut_fr: 0.7, // Mutation fraction (proportion of individuals to be exposed to mutation)    
    cross_prob: 0.3 // Crossover probability
}

class GA { // Performs minimization of fitness function
    constructor(config){
        // Merge default and custom configurations
        this._config = { 
            ...default_config,
            ...config
        }
        // Create and initialize the array of individuals
        this._population = new Array(this._config.pop_size);        
        this._init(this._population); 
        // Number of individuals to be exposed to mutation
        this._mut_range = Math.floor(this._population.length * this._config.mut_fr); 
        
        console.log("GA initialized.");
    }

    _init(pop) { // Initialize/resets population genotypes                
        for(let k = 0; k < pop.length; k++){
            const rand_genotype = this._config.generator();
            const genotype = this._config.encode(rand_genotype);
            pop[k] = {
                genotype: genotype,
                fitness: Infinity // Not evaluated yet
            }
        }
        this._generation = 0;        
    }

    _fitness(ind) { // This fitness function evaluates the k-th individual condition
        this._population[ind].fitness = this._config.fitness(this._config.decode(this._population[ind].genotype));
    }


    /// GETTERS

    get generation() { // Current step number or generation
        return this._generation;
    }

    get population() { // Population or individual list
        return this._population;
    }

    get status() { // Algorithm metrics (may be slow)
        return {
            generation: this._generation, // Current step or generation number
            population: this._population.map( p => ( // Add phenotypes to population 
                {
                    genotype: p.genotype,
                    phenotype: this._config.decode(p.genotype), // Converted to string for displaying
                    fitness: p.fitness
                }
            ))
        }
    }

    // SETTERS
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
    
    /// GA Methods

    _selection() { 
        // Returns selected chromosomes for crossover
        return [[1,2],[3,4],[5,6]];
    }

    _crossover(k1, k2) { 
        // Performs crossover between parents k1 and k2 and returns their children
        const p = Math.random() * this._population[k1].genotype.length; // Crossover point
        const g1 = this._population[k1].genotype.substring(0, p) + this._population[k2].genotype.substring(p + 1);
        const g2 = this._population[k2].genotype.substring(0, p) + this._population[k1].genotype.substring(p + 1);        
        return [{genotype: g1, fitness: Infinity}, {genotype: g2, fitness: Infinity}]; // Children are not evaluated yet
    }

    _mutate(ind) { 
        // Applies mutation to a list of individuals.
        for(let j in ind) // For every chromosome
            for(let k = 0; k < this._population[ind[j]].genotype.length; k++) // For every allele
                if( probability(this._config.mut_prob) ){ 
                    const sw = this._population[ind[j]].genotype[k] === "1" ? "0" : "1";
                    this._population[ind[j]].genotype = replaceChar(this._population[ind[j]].genotype, k, sw);
                    this._population[ind[j]].fitness = Infinity;
                }
    }

    evolve(){ // Compute a generation cycle

        /*
        // Select parents for crossover
        const selected = this._selection(); 
        
        // Obtain the children list and replace current population
        let children = []; 
        for(let k in selected)
            children.push(...this._crossover(selected[k][0], selected[k][1]));
        this._population = children;
        */
        
        // Apply mutation 
        const ind = this._config.mut_fr < 1 ? 
            sample_int(this._mut_range, this._config.pop_size) // Array with random set of indexes
            : 
            Array.from(Array(this._config.pop_size).keys()); // Array with indexes as elements
        this._mutate(ind);

        // Compute population fitness values and sort from best to worst
        this._population.map( (p, ind) => this._fitness(ind) );
        this._population.sort((a,b) => (a.fitness - b.fitness) );
        
        this._generation++;
    }
}

export default GA;