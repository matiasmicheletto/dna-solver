/*
Optimization Manager Class Module
---------------------------------
Thid model allows to manage the evolutionary optimization analysis for a given optimization problem.
Multiple fitness functions can be created and for each, a GA based optimizer can be created.
*/

import GA from '../ga/index.mjs';
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

class OptManager {

    constructor(){
        this._fitness_list = []; // List of fitness functions added to the analysis
        this._ga_list = []; // List of optimizers linked to the fitness functions
        this._results = {by_round:null, by_optimizer:null}; // Results to complete
        this._configured = {}; // This object records the configurations modified
    }

    get fitness_list() {
        return this._fitness_list;
    }

    get results() {
        return this._results;
    }

    get plainResults() {
        // Generate a readable string output for the results
        const output = this._ga_list.map( ga => {
            const st = ga.status;
            return `
Name:                           ${st.name}
Id:                             ${st.id}
Current generation:             ${st.generation}
Fitness evaluations (average):  ${this._results.by_optimizer[st.id].avg_fitness_evals}
Round elapsed time (average):   ${this._results.by_optimizer[st.id].avg_elapsed}
Average best fitness:           ${this._results.by_optimizer[st.id].avg_best_fitness}
Best solution in all rounds:    ${this._results.by_optimizer[st.id].abs_best_solution}
Best fitness in all rounds:     ${this._results.by_optimizer[st.id].abs_best_fitness}
Best objective in all rounds:   ${this._results.by_optimizer[st.id].abs_best_objective}
`;
        });
        return output.join("\n---------------------------------\n");
    }

    get_ga_list = fitness_id => this._ga_list.filter(g => g.fitness_id===fitness_id);

    add_fitness = type => {
        // Create new fitness function
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
        this._fitness_list.push(f);        
        return f.id;
    }

    remove_fitness = id => {
        // Delete fitness model from list and all its optimizers
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

    set_fitness_config = (id, param, value) => {
        // Configure a fitness model parameter
        const index = this._fitness_list.findIndex(el => el.id === id);
        if(index !== -1)
            this._fitness_list[index][param] = value;
    }

    set_ga_config = (id, param, value) => {
        // Configure an optimizer model parameter
        const index = this._ga_list.findIndex(el => el.id === id);
        if(index !== -1){
            this._ga_list[index][param] = value;
            //this._configured[id][param] = value; // TODO record the configuration change
        }
    }

    _update_ga_colors = () => {
        // Optimizers use colors to visually differentiate them.
        // An evenly distributed hue colors are assigned to each one.
        const len = this._ga_list.length;
        for(let g = 0; g < len; g++){
            const color = hsl2rgb(g/len, .5, .7); // Equally spaced colors
            this._ga_list[g].color = `rgb(${color[0]},${color[1]},${color[2]})`;
        }
    }

    add_ga = fitness_id => {
        // Add an optimizer for a given fitness function
        const index = this._fitness_list.findIndex(el => el.id === fitness_id);
        if(index !== -1){
            const ga = new GA({...this._fitness_list[index].config});
            this._ga_list.push(ga);            
            this._update_ga_colors(); // The list of colors is assigned
            return ga.id;            
        }
    }

    remove_ga = id => {
        // Delete an optimizer from list
        const index = this._ga_list.findIndex(el => el.id === id);
        if(index !== -1)        
            this._ga_list.splice(index,1);
    }

    optimize = (rounds, iters, progressCallback = null) => {
        const len = this._ga_list.length;
        let by_round = [];
        for(let r = 0; r < rounds; r++){
            let round_results = {}; // Results per optimizer (entries are the ids)
            for(let g = 0; g < len; g++){ // For each optimizer
                this._ga_list[g].reset(); // Restart the optimizer before the round        
                const start = Date.now();
                for(let gen = 0; gen < iters; gen++) // Evolve "iter" generations
                    this._ga_list[g].evolve();
                const elapsed = Date.now() - start; // Time in ms during evolution
                round_results[this._ga_list[g].id] = {
                    ...this._ga_list[g].status,
                    elapsed: elapsed
                }
            }
            // Emit progress callback
            if(progressCallback) progressCallback(Math.round(r/rounds*100));
            by_round.push(round_results); // Push the results for the current round
        }

        // After completing all the rounds, calculate the metrics
        let by_optimizer = {};
        for(let g = 0; g < len; g++){ // For each optimizer
            let best_matrix = [];
            let avg_matrix = [];
            let avg_best_fitness = [];
            let avg_fitness_evals = [];
            let avg_elapsed = [];
            for(let r = 0; r < rounds; r++){
                best_matrix.push(by_round[r][this._ga_list[g].id].best_hist);
                avg_matrix.push(by_round[r][this._ga_list[g].id].avg_hist);
                avg_best_fitness.push(by_round[r][this._ga_list[g].id].best_fitness);
                avg_fitness_evals.push(by_round[r][this._ga_list[g].id].fitness_evals);
                avg_elapsed.push(by_round[r][this._ga_list[g].id].elapsed);
                 // TODO: calculate max absolute values
            }

            by_optimizer[this._ga_list[g].id] = {                
                // Arrays for plotting optimization performance
                best_hist: matrix_columnwise_mean(best_matrix),
                avg_hist: matrix_columnwise_mean(avg_matrix),
                // Averaged values across rounds
                avg_best_fitness: array_mean(avg_best_fitness),
                avg_fitness_evals: array_mean(avg_fitness_evals),
                avg_elapsed: array_mean(avg_elapsed),
                // Better solutions across all rounds (TODO complete this)
                abs_best_fitness: null, // TODO
                abs_best_solution: null, // TODO
                abs_best_objective: null // TODO
            };
        }
        this._results = {by_round:by_round, by_optimizer:by_optimizer};
    }

    reset = () => {
        // Restart all the optimizers and clear analysis results
        for(let g = 0; g < this._ga_list.length; g++)
            this._ga_list[g].reset();
        this._results = {by_round:null, by_optimizer:null};
    }

}

export default OptManager;