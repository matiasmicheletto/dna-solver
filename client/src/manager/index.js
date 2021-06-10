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

    add_ga = fitness_id => {
        // Add an optimizer for a given fitness function
        const index = this._fitness_list.findIndex(el => el.id === fitness_id);
        if(index !== -1){
            const ga = new GA({...this._fitness_list[index].config});
            this._ga_list.push(ga);
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
        const len = this._ga_list.length;
        let results = [];
        return new Promise((fulfill, reject) => {
            for(let r = 0; r < rounds; r++){
                let partial = {}; // Results per optimizer
                for(let g = 0; g < len; g++){
                    this._ga_list[g].reset(); // Restart the optimizer before the round        
                    for(let gen = 0; gen < iters; gen++)
                        this._ga_list[g].evolve();
                    partial[this._ga_list[g].id] = this._ga_list[g].status;
                }
                if(progressCallback) progressCallback(Math.round(r/rounds*100));
                results.push(partial); // Results per round
            }
            fulfill(results);
        });
    }

    reset = () => {
        // Restart all the optimizers
        for(let g = 0; g < this._ga_list.length; g++)
            this._ga_list[g].reset();
    }
}

export default OptManager;