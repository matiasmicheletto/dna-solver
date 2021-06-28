/*
Experiment Class Module
---------------------------------
This model allows to create and configure the evolutionary optimization analysis for a given optimization problem.
Multiple fitness functions can be created and for each, a GA based optimizer can be created.
*/

import Ga from '../ga/index.mjs';
import Tsp from '../fitness/tsp.mjs';
import NQueens from '../fitness/nqueens.mjs';
import Quadratic from '../fitness/quadratic.mjs';
import { hsl2rgb, array_mean, matrix_columnwise_mean } from '../tools/index.mjs';


// Enumerators
export const fitness_types = {
    TSP: "tsp",
    NQUEENS: "nqueens",
    QUADRATIC: "quadratic"
}

export const fitness_names = {
    TSP: "Travelling Salesperson",
    NQUEENS: "N-Queens",
    QUADRATIC: "Parabola"
}

export default class Experiment {

    constructor(){
        this._fitness_list = []; // List of fitness functions added to the analysis
        this._ga_list = []; // List of optimizers linked to the fitness functions
        this._results = {by_round:[], by_optimizer:{}, ready:false}; // Results to complete
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

    add_fitness(type) {// Create new fitness function
        let f;        
        switch(type) {
            default:
            case fitness_types.TSP:
                f = new Tsp();
                break;
            case fitness_types.NQUEENS:
                f = new NQueens();                
                break;
            case fitness_types.QUADRATIC:
                f = new Quadratic();
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

    add_ga(fitness_id) {
        // Add an optimizer for a given fitness function
        const index = this._fitness_list.findIndex(el => el.id === fitness_id);
        if(index !== -1){
            const ga = new Ga(this._fitness_list[index]);
            ga.freezed = false; // Evolution control
            this._ga_list.push(ga);
            this._update_ga_colors(); // The list of colors is assigned
            return ga.id;            
        }
    }

    remove_ga(id) {
        // Delete an optimizer from list
        const index = this._ga_list.findIndex(el => el.id === id);
        if(index !== -1)        
            this._ga_list.splice(index,1);
    }

    get_ga_list(fitness_id) {
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

    optimize(rounds, iters, progressCallback = null, finishCallback = null) {
        const len = this._ga_list.length;
        let by_round = [];
        for(let r = 0; r < rounds; r++){
            let round_results = {}; // Results per optimizer (entries are the ids)
            for(let g = 0; g < len; g++){ // For each optimizer
                if(!this._ga_list[g].freezed){ // Except those which are in the freezed list
                    const start = Date.now();
                    this._ga_list[g].reset(); // Restart the optimizer before the round        
                    for(let gen = 0; gen < iters; gen++) // Evolve "iter" generations
                        this._ga_list[g].evolve();
                    const elapsed = Date.now() - start; // Time in ms during evolution
                    round_results[this._ga_list[g].id] = {
                        ...this._ga_list[g].status,
                        elapsed: elapsed,
                        color: this._ga_list[g].color
                    }
                }else{
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
            if(progressCallback) progressCallback(Math.round(r/rounds*100));
            by_round.push(round_results); // Push the results for the current round
        }
        if(finishCallback) finishCallback();
        this.summarize_results(by_round);
    }

    summarize_results(by_round) {
        // From round-wise results to optimizer-wise results
        // TODO: refactor

        let by_optimizer = {};
        for(let g = 0; g < this._ga_list.length; g++){ // For each optimizer
            let best_matrix = [];
            let avg_matrix = [];
            let best_fs_matrix = [];
            let avg_fs_matrix = [];
            let avg_best_fitness = [];
            let avg_fitness_evals = [];
            let avg_elapsed = [];
            let abs_best_fitness = 0;
            let abs_best_sol = null;
            let abs_best_obj = null;
            for(let r = 0; r < by_round.length; r++){ // For each round
                const round_res = by_round[r][this._ga_list[g].id]; // Round r, optimizer g.
                // Historic values are saved in matrix shaped structures
                best_matrix.push(round_res.best_hist);
                avg_matrix.push(round_res.avg_hist);
                best_fs_matrix.push(round_res.best_fs_hist);
                avg_fs_matrix.push(round_res.avg_fs_hist);
                // Scalar values are saved in arrays
                avg_best_fitness.push(round_res.best_fitness);
                avg_fitness_evals.push(round_res.fitness_evals);
                avg_elapsed.push(round_res.elapsed);
                // Best values are updated on best found
                if(round_res.best_fitness > abs_best_fitness) {
                    abs_best_fitness = round_res.best_fitness;
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
                best_fs_hist: matrix_columnwise_mean(best_fs_matrix),
                avg_fs_hist: matrix_columnwise_mean(avg_fs_matrix),
                // Averaged values across rounds
                avg_best_fitness: array_mean(avg_best_fitness),
                avg_fitness_evals: array_mean(avg_fitness_evals),
                avg_elapsed: array_mean(avg_elapsed),                
                // Better solutions across all rounds
                abs_best_fitness: abs_best_fitness,
                abs_best_solution: abs_best_sol, 
                abs_best_objective: abs_best_obj 
            };
        }
        this._results = {by_round:by_round, by_optimizer:by_optimizer, ready:true};
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
        for(let g = 0; g < this._ga_list.length; g++)
            this._ga_list[g].reset();
        this._results.ready = false;
    }
};