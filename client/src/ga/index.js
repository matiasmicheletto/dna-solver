import {probability} from "../tools";

class GA {
    constructor(fitness, pop_size = 20){
        this._population = new Array(pop_size);
        this._fitness = (k) => fitness(this._population[k]);
        this._population = this.init(this._population);
        console.log("GA initialized");
    }

    init(pop) { // Initialize/resets population
        for(let k in pop)
            pop[k] = "0000"; // TODO: initializer
        this._generation = 0;
        return pop; // Check if argument is mutable
    }

    /// GETTERS
    get status() { // Instance descriptor
        return {
            generation: this._generation,
            population: this._population
        }
    }

    get generation() { // Current step number or generation
        return this._generation;
    }

    get population() { // Population values
        return this._population;
    }


    // SETTERS
    set fitness(f) { // Fitness function is always applied to a single individual
        this._fitness = (k) => f(this._population[k]);
    }

    set pop_size(p) { 
        // Changing the population size adds or removes individuals regardless of the current state of the algorithm
        let current_size = this._population.length;
        if(p > current_size){ // Add individuals
            let new_pop = new Array(p - current_size);
            new_pop = this.init(new_pop);
            this._population = this._population.concat(new_pop);
        }else // Remove leftover individuals
            this._population.splice(p);
    }
    
    /// GA Methods
    _selection(f) { 
        // Returns selected chromosomes from population based on fitness values
        return [];
    }

    _crossover(k1, k2) { 
        // Performs crossover between parents p1 and p2 and returns their children
        let c = [this._population[k1], this._population[k2]]
        return c;
    }

    _mutate(c) {
        // Applies mutation to individual number k
    }

    evolve(){ // Compute next generation
        // Eval population
        let f = [];
        for(let k in this._population)
            f.push(this._fitness(k));

        // Array of selected parents for crossover
        let selected = this._selection(f); 
        
        // Array of children 
        let children = []; 
        for(let k in selected){
            children.push(...this._crossover(selected[k]));
        }
        
        // TODO: add children to population
        
        // Apply mutation
        for(let k in this._population){
            if( probability(0.1) )
                this._mutate(k)
        }

        this._generation++;
    }
}

export default GA;