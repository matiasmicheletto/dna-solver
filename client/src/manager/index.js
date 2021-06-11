/*
Optimization Manager Class Module
---------------------------------
Thid model allows to manage the evolutionary optimization analysis for a given optimization problem.
Multiple fitness functions can be created and for each, a GA based optimizer can be created.
*/

import GA from '../ga';
import Tsp from '../fitness/tsp';
import NQueens from '../fitness/nqueens';
import Quadratic from '../fitness/quadratic';
import { hsl2rgb } from '../tools';


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
        this._fitness_list = [];
        this._ga_list = [];
    }

    get fitness_list() {
        return this._fitness_list;
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

    _update_ga_colors = () => {
        // Optimizers use colors to visually differentiate them.
        // An evenly distributed hue colors are assigned to each one.
        const len = this._ga_list.length;
        for(let g = 0; g < len; g++){
            const color = hsl2rgb(g/len, .5, .7);
            this._ga_list[g].color = `rgb(${color[0]},${color[1]},${color[2]})`;
        }
    }

    add_ga = fitness_id => {
        // Add an optimizer for a given fitness function
        const index = this._fitness_list.findIndex(el => el.id === fitness_id);
        if(index !== -1){
            const ga = new GA({...this._fitness_list[index].config});
            this._ga_list.push(ga);            
            this._update_ga_colors();
            return ga.id;            
        }
    }

    remove_ga = id => {
        // Delete an optimizer from list
        const index = this._ga_list.findIndex(el => el.id === id);
        if(index !== -1)        
            this._ga_list.splice(index,1);
    }

    set_ga_config = (id, param, value) => {
        // Configure an optimizer parameter
        const index = this._ga_list.findIndex(el => el.id === id);
        if(index !==-1)
            this._ga_list[index][param] = value;
    }

    optimize = async (rounds, iters, progressCallback = null) => {
        // Run a finite number of iterations and return results                
        return new Promise((fulfill, reject) => {
            const len = this._ga_list.length;
            let by_round = [];
            let by_optimizer = {};
            for(let r = 0; r < rounds; r++){
                let round_results = {}; // Results per optimizer
                for(let g = 0; g < len; g++){
                    this._ga_list[g].reset(); // Restart the optimizer before the round        
                    for(let gen = 0; gen < iters; gen++)
                        this._ga_list[g].evolve();
                    round_results[this._ga_list[g].id] = this._ga_list[g].status;
                }
                if(progressCallback) progressCallback(Math.round(r/rounds*100));
                by_round.push(round_results); // Results per round
            }

            fulfill({by_round:by_round, by_optimizer:by_optimizer});
        });
    }

    reset = () => {
        // Restart all the optimizers
        for(let g = 0; g < this._ga_list.length; g++)
            this._ga_list[g].reset();
    }
}

export default OptManager;