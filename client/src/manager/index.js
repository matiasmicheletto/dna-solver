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

    add_fitness = type => {
        let f;        
        switch(type) {
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
        const insertion_idx = this._fitness_list.push({
            fitness: f,
            type: type
        });        
        return insertion_idx;
    }

    set_fitness_config(index, param, value) {
        this._fitness_list[index].fitness[param] = value;
    }

    add_ga_to_fitness = index => {        
        const insertion_idx = this._ga_list.push({
            ga: new GA({...this._fitness_list[index].fitness.config}),
            fitness: index
        });
        return insertion_idx;
    }

    remove_ga = ind => {        
        this._ga_list.splice(ind,1);
    }
}

export default OptManager;
export {fitness};