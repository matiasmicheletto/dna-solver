/*
Genetic Algorithm Class Module
------------------------------
Implements a generic and configurable GA based optimizer.

Configuration object:
    - pop_size: Population size, number of chromosomes.
        * type: Non zero even Number (integer).
    - elitism: Number of elite individuals. Elite individuals are force-preserved through generations.
        * type: Number (integer).
    - cross_prob: Crossover probability (probability that a pair of selected individuals to be crossovered).
        * type: Float number between 0 and 1.
    - mut_prob: Mutation probability (probability of an gen to change).
        * type: Float number between 0 and 1. Usually 1/(bitstring length).
    - mut_gen: gen generator for mutation.
        * type: Function.
        * input: None.
        * ouput: Number.
    - rank_r: Ranking parameter (In case of ranking based selection). High r increases selective pressure. 
        * type: Float number between 0 and 2/(pop_size*(pop_size-1)).
    - tourn_k: K parameter for tournament selection method.
        * type: Integer number, usually between 2 and 5.
    - best_fsw_factor: Window size for getting the best final slope value proportional to generation number.
        * type: Float number.
    - selection: Selection operator.
        * type: ROULETTE, RANK or TOURNAMENT.
    - crossover: Crossover operator.
        * type: SINGLE, DOUBLE, CX or PMX.
    - mutation: Mutation operator.
        * type: BITFLIP, SWAP or RAND.
    - param_control_enabled: Enable or disable automatic parameter control
        * type: Boolean.
    - controlled_param:  Parameter to control automatically.
        * type: String.
    - param_control_factor: Factor number used in the parameter control
        * type: Float number.
    - controller_vble: Variable used to control the parameter
        * type: String.
*/

import { 
    probability, 
    generate_id, 
    random_name, 
    final_slope
} from "../tools/index.mjs";


///// Enumerators /////
// Genetic operators
export const selection = {
    ROULETTE: "roulette",
    RANK: "rank",
    TOURNAMENT: "tournament"
};

export const crossover = {
    SINGLE: "single",
    DOUBLE: "double",
    CYCLE: "cycle",
    PMX: "pmx"
};

export const mutation = {
    BITFLIP: "bitflip", // Only for bitstring encoding
    SWAP: "swap", // Swap positions
    RAND: "rand" // Uses mut_gen function as random generator
};

// Adaptive parameters

export const adapt_params = { 
    cross_prob: "Crossover prob.",
    mut_prob: "Mutation prob.",
    rank_r: "Ranking dist. (R)",
    tourn_k: "Tournament size (K)"
};

export const adapt_vars = { 
    _generation: "Generation", // Static control
    _best_final_slope: "Evolution slope", // Adaptive control
    _fitness_s2: "Population variance", // Adaptive control
    _fitness_avg: "Population avg. fitness" // Adaptive control
};

// Default parameters (tunned for general purpose)
const default_config = { 
    pop_size: 20, 
    elitism: 2,
    cross_prob: 0.5, 
    mut_prob: 0.1, 
    mut_gen: () => Math.round(Math.random()), // Used for mutation.RAND
    rank_r: 0.002,
    tourn_k: 3,
    best_fsw_factor: 0.2,
    selection: selection.ROULETTE,
    crossover: crossover.SINGLE,
    mutation: mutation.BITFLIP,
    param_control_enabled: false,
    controlled_param: "cross_prob",
    param_control_factor: 0.01,
    controller_vble: "_generation"
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

        // Probability parameter for rank based selection operator
        this._rank_q = this._config.rank_r*(this._config.pop_size-1)/2 + 1/this._config.pop_size;

        // Configure operators (IMPORTANT: The following are setters)
        this.selection = this._config.selection;
        this.mutation = this._config.mutation;
        this.crossover = this._config.crossover;

        this._id = generate_id(); // Object unique identifier
        // Readable identifier (may be repeated)
        this._name = this._config.name ? this._config.name : random_name();

        console.log(`New optimizer "${this._name}" initialized (ID: ${this._id}).`);
    }

    reset() { // Restarts de algorithm
        this._eval_counter = 0; // Fitness function evaluations counter
        // Generate random genotypes for each individual and evaluate its condition
        for(let k = 0; k < this._population.length; k++){
            this._population[k] = { genotype: this._fitness.rand_encoded() };
            this._eval(k);
        }
        // Use a variable for storing the genotype length and ease its access
        this._gen_len = this._population[0].genotype.length;

        // Sort population (selection requires ranked individuals)
        this._sort_pop();
        
        // Restart history arrays
        this._best_hist = []; // Historic values of best fitness
        this._avg_hist = []; // Historic values of population average fitness
        this._s2_hist = []; // Historic values of population variance fitness
        
        // Restart counters
        this._generation = 0; // Generation counter        

        this._update_stats();
    }

    _eval(ind) { // This fitness function evaluates the ind-th individual condition
        this._population[ind].fitness = this._fitness.eval(this._population[ind].genotype);        
        this._eval_counter++;
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
                objective: this._fitness.objective_str(p.genotype)
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
            pop_fitness_s2: this._fitness_s2,
            pop_fitness_avg: this._fitness_avg,
            generation: this._generation,
            fitness_evals: this._eval_counter,
            // Historic values
            best_hist: this._best_hist,
            avg_hist: this._avg_hist,
            s2_hist: this._s2_hist,         
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
    }

    set elitism(e) {
        if(e >= 0 && e <= this._config.pop_size)
            this._config.elitism = e;
    }

    set cross_prob(v) {
        if(v > 0 && v <= 1)
            this._config.cross_prob = v;
    }

    set mut_prob(v) {      
        if(v >= 0 && v <= 1)  
            this._config.mut_prob = v;        
    }

    set rank_r(v) {
        if(v >= 0 && v < 2/(this._config.pop_size*(this._config.pop_size-1))){
            this._config.rank_r = v;
            this._rank_q = this._config.rank_r*(this._config.pop_size-1)/2 + 1/this._config.pop_size;
        }
    }

    set tourn_k(v) {
        if(v >= 2 && v < this._config.pop_size)
            this._config.tourn_k = v;
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
            case crossover.CYCLE:
                this._crossover = this._cx_crossover;
                // Force mutation to swap
                if(this._config.mutation != mutation.SWAP)
                    this.mutation = mutation.SWAP;
                break;
            case crossover.PMX:
                this._crossover = this._pmx_crossover;
                // Force mutation to swap
                if(this._config.mutation != mutation.SWAP)
                    this.mutation = mutation.SWAP;
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
                this._mutate = this._rand_gen_mutation;
                break
        }
        this._config.mutation = m;
    }

    set param_control_enabled(v) {
        // Enable/disable automatic parameter control
        this._config.param_control_enabled = v;        
    }

    set controlled_param(v) {
        // Set the parameter to control (specified in adapt_params)
        if(v in adapt_params)
            this._config.controlled_param = v;
    }

    set param_control_factor(v) {
        // Set the proportional factor for increment/decrement parameter
        if(typeof(v) === "number")
            this._config.param_control_factor = v;
    }

    set controller_vble(v) {
        // Set the dependent variable for parameter control
        if(v in adapt_vars)
            this._config.controller_vble = v;
    }

    //////////// GA METHODS ////////////

    /// Selection

    _roulette_selection() { 
        // Uses probability of selection proportional to fitness
        let selected = [];
        for(let i = 0; i < this._population.length; i++){
            const r = Math.random()*this._fitness_sum; // Random number from 0 to fitness sum
            let s = 0; // Partial adder
            for(let k in this._population){ // Population is already sorted from best to worst
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
            for(let k = 0; k < this._population.length; k++){ // Population is already sorted from best to worst
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
        // Performs pop_size fitness comparations beetween k random selected individuals
        let selected = [];
        for(let i = 0; i < this._population.length; i++){
            let winner = this._population.length-1;
            for(let k = 0; k < this._config.tourn_k; k++){ // Run tournament
                const candidate = Math.floor(Math.random()*this._population.length); // Random candidate
                if(candidate < winner) winner = candidate; // Lower index wins
            }
            selected.push(winner);
        }
        return selected;
    }


    /// Crossover

    _single_point_crossover(k1, k2) { 
        // Performs single point recombination between parents k1 and k2
        const s = Array.from(this.population[k1].genotype);
        const t = Array.from(this.population[k2].genotype);

        // Random crossover point
        const p = Math.floor(Math.random() * (s.length - 2) + 1); 

        // Perform genotype crossover and update population
        this._population[k1] = {genotype: [...s.slice(0, p), ...t.slice(p)]};
        this._population[k2] = {genotype: [...t.slice(0, p), ...s.slice(p)]};
    }

    _double_point_crossover(k1, k2) {
        // Performs crossover between parents k1 and k2 and returns their children
        const s = Array.from(this.population[k1].genotype);
        const t = Array.from(this.population[k2].genotype);
        
        // Select two crossover points
        let p1 = Math.floor(Math.random() * (s.length - 2) + 1); 
        let p2 = Math.floor(Math.random() * (s.length - 1 - p1)) + p1 + 1; 
        
        // Perform genotype crossover and update population
        this._population[k1] = {genotype: [...s.slice(0, p1), ...t.slice(p1, p2), ...s.slice(p2)]};
        this._population[k2] = {genotype: [...t.slice(0, p1), ...s.slice(p1, p2), ...t.slice(p2)]};
    }

    _cx_crossover(k1, k2) {
        
    }

    _pmx_crossover(k1, k2) {
        // Partially mapped crossover (PMX)
        // https://gist.github.com/celaus/d5a55e723ce233f2b83af36a4cf456b4
        
        const x1 = Math.floor(Math.random() * (this._gen_len - 1));
        const x2 = x1 + Math.floor(Math.random() * (this._gen_len - x1));

        let g1 = Array.from(this.population[k1].genotype); 
        let g2 = Array.from(this.population[k2].genotype);

        let map1 = {}; let map2 = {};

        for (let i = x1; i < x2; i++) {
            g1[i] = this.population[k2].genotype[i];
            map1[this.population[k2].genotype[i]] = this.population[k1].genotype[i];
            g2[i] = this.population[k1].genotype[i];
            map2[this.population[k1].genotype[i]] = this.population[k2].genotype[i];
        }

        for (let i = 0; i < x1; i++) {
            while (g1[i] in map1) 
                g1[i] = map1[g1[i]];
            while (g2[i] in map2)
                g2[i] = map2[g2[i]];
        }

        for (let i = x2; i < this._gen_len; i++) {
            while (g1[i] in map1) 
                g1[i] = map1[g1[i]];
            while (g2[i] in map2) 
                g2[i] = map2[g2[i]];
        }

        // Update population
        this._population[k1] = {genotype: g1};
        this._population[k2] = {genotype: g2};
    }


    /// Mutation

    _bitflip_mutation(ind) { 
        // Applies bitflip mutation to individual "ind". 
        for(let k = 0; k < this._gen_len; k++) // For every gen
            if( probability(this._config.mut_prob) )
                this._population[ind].genotype[k] = this._population[ind].genotype[k]===1? 0 : 1; // Bitflip                
    }

    _swap_mutation(ind) {
        // Applies gen position swap to individual "ind".
        for(let k = 0; k < this._gen_len; k++) // For every gen
            if( probability(this._config.mut_prob) ){ 
                let p = k;
                // Select another random position
                while(p === k) p = Math.floor(Math.random() * this._gen_len); 
                // Inline values swap ([a,b] = [b,a])
                [
                    this._population[ind].genotype[k], 
                    this._population[ind].genotype[p]
                ] = [
                    this._population[ind].genotype[p], 
                    this._population[ind].genotype[k]
                ];                
            }
    }

    _rand_gen_mutation(ind) {
        // Selects a random value for a random selected gen.
        for(let k = 0; k < this._gen_len; k++) // For every gen
            if( probability(this._config.mut_prob) )
                this._population[ind].genotype[k] = this._config.mut_gen(); // Change for a random value
    }

    //////////// HELPERS ///////////

    _sort_pop() {
        // Sort population from best to worst fitness
        this._population.sort((a,b) => (b.fitness - a.fitness) );
    }

    _update_stats() {
        // Population metrics
        this._fitness_sum = this._population.reduce((r, a) => a.fitness + r, 0); // For roulette, this is necessary on every iteration
        this._fitness_avg = this._fitness_sum / this._population.length;
        this._fitness_s2 = this._population.reduce((r, a) => (a.fitness - this._fitness_avg)*(a.fitness - this._fitness_avg) + r, 0) / this._population.length;

        // Convergence metric (best historic slope)
        const window = Math.ceil(this._config.best_fsw_factor*this._generation);        
        this._best_final_slope = final_slope(this._best_hist, window);
        
        // Record the metrics in arrays
        this._best_hist.push(this._population[0].fitness);
        this._avg_hist.push(this._fitness_avg);
        this._s2_hist.push(this._fitness_s2); 
    }

    _update_params(){
        // Automatic parameters control
        if(this._config.controller_vble !== "_generation")
            this._config[this._config.controlled_param] += this._config.param_control_factor * this[this._config.controller_vble];
        else
            this._config[this._config.controlled_param] += this._config.param_control_factor;
    }


    /// Iteration

    evolve(){ // Compute a generation cycle. Population list is already sorted by fitness value
        // Copy elite individuals if elitism is configured
        const elite = this._config.elitism > 0 ? [...this._population.slice(0, this._config.elitism)] : null;

        // Select parents list for crossover
        const selected = this._selection(); 

        // Apply crossover to selected individuals        
        for(let k = 0; k < selected.length-1; k += 2)
            if(probability(this._config.cross_prob)){
                // Perform crossover        
                this._crossover(selected[k], selected[k+1]);
                // Mutate and evaluate offspring
                [selected[k], selected[k+1]].map(el=>{
                    this._mutate(el);
                    this._eval(el);
                });
            }
        
        // Restore elite individuals to population        
        if(this._config.elitism > 0)
            this._population.push(...elite);

        // Sort population from best to worst fitness
        this._sort_pop();

        // Remove individuals that do not survive 
        this._population.splice(this._config.pop_size); 

        // Save evolution metrics
        this._update_stats();

        this._generation++;

        if(this._config.param_control_enabled)
            this._update_params();
    }
}