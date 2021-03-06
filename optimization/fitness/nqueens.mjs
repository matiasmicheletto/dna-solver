import Fitness from './index.mjs';
import { shuffle_array } from "../tools/index.mjs";
import { mutation } from '../ga/index.mjs';

////////// N-QUEENS PROBLEM /////////////

export default class NQueens extends Fitness {
    
    constructor(N = 8) {
        super({_N: N, _name:N+"-Queens Puzzle"});
    }

    set N(val) {
        if(typeof(val)==="number" && val >= 3){
            this._N = val;
            this._name = val+"-Queens Puzzle";
        }
    }

    get ga_config() { // Overwrite the random gen generator function        
        const N = this._N; // For using this._N inside the mut_gen function
        return {
            mutation: mutation.RAND, // Rand operator uses mut_gen function
            mut_prob: 1/N // Mutation probability
        };
    }

    get N() {
        return this._N;
    }

    get config() {
        return {
            N: this._N
        };
    }

    _get_max_conflict(n) { 
        // Max possible conflicts in a NxN chess board
        // This value can be used as fitness multiplier
        return n*(n + 1) / 2 
    }

    objective(columns) { // Counts the number of queens in conflict        
        let cntr = 0; // Conflict counter
        for(let col1=0; col1 < this._N-1; col1++){
            for(let col2=col1+1; col2 < this._N; col2++){                
                if(columns[col1]===columns[col2]) { cntr++; continue; } // Same row
                if(col1 + columns[col1] === col2 + columns[col2]) { cntr++; continue; } // Same negative diagonal
                if(col2 - col1 === columns[col2] - columns[col1]) { cntr++; continue; } // Same positive diagonal
            }
        }
        return cntr;
    }

    objective_str(x) {
        return this.objective(x) + " conflicts";
    }

    eval(g) { 
        /* This fitness model uses the following table:
        conflicts - fitness
            0        100
            1         50
            2         33
            3         25
            ...
        */
        return 100 / ( this.objective(g) + 1 );
    }

    mut_gen(idx) {
        // Random gen generator function
        return Math.floor(Math.random()*this._N);
    }

    rand_encoded() { // Random order of numbers from 1 to N
        let numbers = Array.from(Array(this._N).keys());
        shuffle_array(numbers);
        return numbers;
    }
};