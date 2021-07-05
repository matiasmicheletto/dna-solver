/*
Experiment Class Module
---------------------------------
This model allows to create and configure the evolutionary optimization analysis for a given optimization problem.
Multiple fitness functions can be created and for each, a GA based optimizer can be created.
*/

import Ga from '../ga/index.mjs';
import { hsl2rgb, array_mean, matrix_columnwise_mean } from '../tools/index.mjs';
// In case of having a large number of fitness models, then
// the "add_fitness" method should be refactored in order to 
// receive the fitness constructor as argument instead of
// the enumerators.
import Quadratic from '../fitness/quadratic.mjs';
import SubsetSum from '../fitness/subsetsum.mjs';
import NQueens from '../fitness/nqueens.mjs';
import Knapsack from '../fitness/knapsack.mjs';
import Tsp from '../fitness/tsp.mjs';



// Enumerators
export const fitness_types = {
    QUADRATIC: "quadratic",
    SUBSETSUM: "subset",
    NQUEENS: "nqueens",
    KNAPSACK: "knapsack",
    TSP: "tsp"
}

export const fitness_names = {
    QUADRATIC: "Quadratic",
    SUBSETSUM: "Subset sum",
    NQUEENS: "N-Queens",
    KNAPSACK: "Knapsack",
    TSP: "Travelling Salesperson"
}

export default class Experiment {

    constructor(){
        this._fitness_list = []; // List of fitness functions added to the analysis
        this._ga_list = []; // List of optimizers linked to the fitness functions
         // Results to complete after optimization run:
        this._results = {by_round:[], by_optimizer:{}, ready:false, exitmsg:""};
    }

    static get fitness_types() {
        return fitness_types;
    }

    get fitness_list() {
        return this._fitness_list;
    }

    get ga_list() {
        return this._ga_list;
    }

    get results() {
        return this._results;
    }

    add_fitness(type, params = []) {// Create new fitness function
        // If the number of models is large, then just
        // pass the constructor instead of the type
        let f;        
        switch(type) {
            default:
            case fitness_types.QUADRATIC:
                f = new Quadratic(...params);
                break;
            case fitness_types.SUBSETSUM:
                f = new SubsetSum(...params);
                break;
            case fitness_types.NQUEENS:
                f = new NQueens(...params);
                break;
            case fitness_types.KNAPSACK:
                f = new Knapsack(...params);
                break;
            case fitness_types.TSP:
                f = new Tsp(...params);
                break;
        }        
        f.type = type; // Add the type format
        this._fitness_list.push(f);        
        return f.id;
    }

    remove_fitness(id) { // Delete fitness model from list and all its optimizers
        const index = this._fitness_list.findIndex(el => el.id === id);
        if(index !== -1){
            this._fitness_list.splice(index,1);
            // Search and remove attached optimizers
            let ga_idxs = []
            this._ga_list.forEach( g => {
                if(g.fitness_id === id)
                    ga_idxs.push(g.id);
            });
            ga_idxs.forEach( id => this.remove_ga(id) );
        }
    }

    set_fitness_config(id, config) {
        // Configure a fitness model set of parameters
        // This takes into account that some config parameters can be setter functions
        // (which means that a background procedure is executed on parameter update)
        const index = this._fitness_list.findIndex(el => el.id === id);
        if(index !== -1){
            for(let param in config)
                this._fitness_list[index][param] = config[param];
            // When changing a fitness parameter, the optimizers should be initialized again
            // with the new configuration
            this.reset();
        }
    }

    get_fitness(ga_id) {
        // Get the fitness model of an optimizer
        const index = this._ga_list.findIndex(el => el.id === ga_id);
        if(index !== -1)
            return this._ga_list[index].fitness;
    }

    add_ga(fitness_id, config = {}) {
        // Add an optimizer for a given fitness function
        const index = this._fitness_list.findIndex(el => el.id === fitness_id);
        if(index !== -1){
            const ga = new Ga(this._fitness_list[index], config);
            ga.freezed = false; // Evolution and result compiling control
            this._ga_list.push(ga);
            this._update_ga_colors(); // The list of colors is assigned
            return ga.id;            
        }
    }

    remove_ga(id) {
        // Delete an optimizer from list
        const index = this._ga_list.findIndex(el => el.id === id);
        if(index !== -1){
            this._ga_list.splice(index,1);
            this._update_ga_colors(); // The list of colors should be updated
        }
    }

    duplicate_ga(id) {
        // Copy an optimizer configuration and create a new one
        const index = this._ga_list.findIndex(el => el.id === id);
        if(index !== -1){
            const ga = new Ga(this._ga_list[index].fitness, this._ga_list[index].config);
            ga.freezed = false; // Evolution and result compiling control
            this._ga_list.push(ga);
            this._update_ga_colors();
            return ga.id;
        }
    }

    set_ga_config(id, config) {
        // Configure an optimizer model parameter
        const index = this._ga_list.findIndex(el => el.id === id);
        if(index !== -1)
            for(let param in config)
                this._ga_list[index][param] = config[param];
    }

    _update_ga_colors() {
        // Optimizers use colors to visually differentiate them.
        // An evenly distributed HUE colors are assigned to each one.
        const len = this._ga_list.length;
        for(let g = 0; g < len; g++){
            const color = hsl2rgb(g/len, .5, .7); // Equally spaced colors
            this._ga_list[g].color = `rgb(${color[0]},${color[1]},${color[2]})`;
        }
    }

    get_ga_list(fitness_id) {
        // List of optimizers from a fitness model
        return this._ga_list.filter(g => g.fitness_id===fitness_id);
    }

    toggle_ga_freeze(id) {
        // Toggle freeze state of ga optimizer
        const index = this._ga_list.findIndex(el => el.id === id);
        if(index !== -1)
            this._ga_list[index].freezed = !this._ga_list[index].freezed;
    }

    unfreeze_all_ga() {
        // Reset freezed state for all optimizers
        for(let g = 0; g < this._ga_list.length; g++)
            this._ga_list[g].freezed = false;
    }

    run(config) {
        const cfg = { // Optimization configuration
            rounds: 10,
            iters: 100,
            timeout: 180000,
            progressCallback: null,
            finishCallback: null,
            ...config // Override default values
        };
        let by_round = []; // Array with results by round
        this._results.exitmsg = "Rounds completed"; // Normal exit status for now
        const round_start = Date.now(); // Round timing
        for(let r = 0; r < cfg.rounds; r++){ // Begin!
            if(Date.now() - round_start > cfg.timeout){ // Check round timeout condition
                this._results.exitmsg = `Timed out (${cfg.rounds-r} rounds left)`;
                break;
            }
            let round_results = {}; // Results per optimizer (attrs are the ga ids)
            for(let g = 0; g < this._ga_list.length; g++){ // For each optimizer
                if(!this._ga_list[g].freezed){ // Except those which are in the freezed list
                    const start = Date.now(); // Complete round timing
                    this._ga_list[g].reset(); // Restart the optimizer before the round        
                    for(let gen = 0; gen < cfg.iters; gen++) // Evolve "iter" generations
                        this._ga_list[g].evolve();
                    const elapsed = Date.now() - start; // Time in ms during evolution
                    round_results[this._ga_list[g].id] = {
                        ...this._ga_list[g].status,
                        elapsed: elapsed,
                        color: this._ga_list[g].color
                    }
                }else{ // In case of freezed otpimizers, copy previous results
                    if(this._results.by_round[r]) // If there were existing results for this round number
                        round_results[this._ga_list[g].id] = this._results.by_round[r][this._ga_list[g].id];
                    else // Otherwise, use current status
                        round_results[this._ga_list[g].id] = {
                            ...this._ga_list[g].status,
                            elapsed: 0,
                            color: this._ga_list[g].color
                        }
                }
            }
            // Emit progress callback
            if(cfg.progressCallback) cfg.progressCallback(Math.round(r/cfg.rounds*100));
            by_round.push(round_results); // Push the results for the current round
        }
        this._results.by_round = by_round;
        if(cfg.finishCallback) cfg.finishCallback();
        this.summarize_results();
    }

    summarize_results() {
        // From round-wise results to optimizer-wise results
        let by_optimizer = {};

        // Helper to get round results
        const get_round_res = (round, ga) => this._results.by_round[round][this._ga_list[ga].id];

        for(let g = 0; g < this._ga_list.length; g++){ // For each optimizer
            // Historic values are pushed to matrixes
            let best_matrix = [];
            let avg_matrix = [];            
            let s2_matrix = [];
            // Average values acrross rounds
            let avg_best_fitness = [];
            let avg_fitness_evals = [];
            let avg_elapsed = [];
            // Absolute maximums acrross rounds
            let abs_best_fitness = 0;
            let abs_best_s2 = 0;
            let abs_best_sol = get_round_res(0, g).best;
            let abs_best_obj = get_round_res(0, g).best_objective;
            for(let r = 0; r < this._results.by_round.length; r++){ // For each round
                const round_res = get_round_res(r, g); 
                // Historic values are saved in matrix shaped structures
                best_matrix.push(round_res.best_hist);
                avg_matrix.push(round_res.avg_hist);                
                s2_matrix.push(round_res.s2_hist);
                // Scalar values are saved in arrays
                avg_best_fitness.push(round_res.best_fitness);
                avg_fitness_evals.push(round_res.fitness_evals);
                avg_elapsed.push(round_res.elapsed);
                // Best values are updated on best found
                if(round_res.best_fitness > abs_best_fitness) {
                    abs_best_fitness = round_res.best_fitness;
                    abs_best_s2 = round_res.pop_fitness_s2;
                    abs_best_sol = round_res.best;
                    abs_best_obj = round_res.best_objective;
                }
            }

            // Results by optimizer are averaged
            by_optimizer[this._ga_list[g].id] = {
                name: this._ga_list[g].name,
                color: this._ga_list[g].color,
                // Arrays for plotting optimization performance
                best_hist: matrix_columnwise_mean(best_matrix),
                avg_hist: matrix_columnwise_mean(avg_matrix),
                s2_hist: matrix_columnwise_mean(s2_matrix),
                
                // Averaged values across rounds
                avg_best_fitness: array_mean(avg_best_fitness),
                avg_fitness_evals: array_mean(avg_fitness_evals),
                avg_elapsed: array_mean(avg_elapsed),                
                // Better solutions across all rounds
                abs_best_fitness: abs_best_fitness,
                abs_best_s2: abs_best_s2,
                abs_best_solution: abs_best_sol, 
                abs_best_objective: abs_best_obj 
            };
        }
        this._results.by_optimizer = by_optimizer;
        this._results.ready = true;
    }

    getPlainResults() {
        // Generate a readable string output for the results
        const output = Object.keys(this._results.by_optimizer).map( id => {            
            const ga_res = this._results.by_optimizer[id];
            return `\rName:                           \x1b[31m${ga_res.name}\x1b[0m
                    \rId:                             ${id}
                    \rFitness evaluations (average):  ${ga_res.avg_fitness_evals}
                    \rRound elapsed time (average):   ${ga_res.avg_elapsed} ms. 
                    \rBest fitness (average):         ${ga_res.avg_best_fitness}
                    \rBest fitness (all rounds):      ${ga_res.abs_best_fitness}
                    \rBest solution (all rounds):     ${ga_res.abs_best_solution}
                    \rBest objective (all rounds):    ${ga_res.abs_best_objective}\n`;
        });
        return output.join("\n------------------------------------------------------\n");
    }

    printGAConfigs() { // Just a debug helper function
        console.log("GA Configurations:");
        this._ga_list.forEach(g => {
            console.log(g.status);
            console.log(g.config);
            console.log("----------");
        });
    }

    reset() {
        // Restart all the optimizers and clear analysis results
        for(let g = 0; g < this._ga_list.length; g++){
            this._ga_list[g].freezed = false; // Unfreeze all
            this._ga_list[g].reset();
        }
        this._results.ready = false;
    }
};