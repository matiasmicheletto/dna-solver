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

    get fitness() {
        return this._fitness_list;
    }

    get ga() { 
        return this._ga_list;
    }

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

    set_fitness_config(id, param, value) {
        // Configure a fitness model parameter
        const index = this._fitness_list.findIndex(el => el.id === id);
        if(index !== -1)
            this._fitness_list[index].fitness[param] = value;
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
}

export default OptManager;