/*
Optimization Manager Class Module
---------------------------------
Thid model allows to manage the evolutionary optimization analysis for a given optimization problem.
Multiple fitness functions can be created and for each, a GA based optimizer can be created.
*/

import Tsp from '../fitness/tsp';
import NQueens from '../fitness/nqueens';
import Quadratic from '../fitness/quadratic';
import GA from '../ga';

// Enumerators
const fitness = {
    TSP: "tsp",
    NQUEENS: "nqueens",
    QUADRATIC: "quadratic"
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
            case fitness.TSP:
                f = new Tsp();
                break;
            case fitness.NQUEENS:
                f = new NQueens();                
                break;
            case fitness.QUADRATIC:
                f = new Quadratic();
                break;
        }        
        this._fitness_list.push(f);        
        return f.id;
    }

    remove_fitness = id => {
        // Delete fitness model from list and all its optimizers
        const index = this._fitness_list.findIndex(el => el.id === id);
        if(index !== -1)
            this._fitness_list.splice(index,1);
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
export {fitness};