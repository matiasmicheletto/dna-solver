import Fitness from './index.mjs';
import { shuffle_array } from "../tools/index.mjs";
import { mutation } from '../ga/index.mjs';

////////// N-QUEENS PROBLEM /////////////

export default class NQueens  extends Fitness {
    
    constructor(N = 8) {
        super({_N: N});        
    }

    set N(val) {
        this._N = val;
    }

    get name() { // 
        return "N Queens (N="+this._N+")";
    }

    get ga_config() { // Overwrite the random allele generator function        
        return {
            mutation: mutation.RAND, // Rand operator uses mut_gen function
            mut_gen: () => Math.floor(Math.random()*this._N)
        };
    }

    get N() {
        return this._N;
    }

    // Max possible conflicts in a NxN chess board
    _get_max_conflict = n => n*(n + 1) / 2

    objective = columns => { // Counts the number of queens in conflict        
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

    objective_str = x => this.objective(x) + " conflicts"

    eval = g => 100 / ( this.objective(g) + 1 )

    decode_str = g => g.join("-").substr(0,25)+(g.length>25?"...":"") // Crop at 25 characters
    
    rand_encoded = () => { // Random order of numbers from 1 to N
        let numbers = Array.from(Array(this._N).keys());
        shuffle_array(numbers);
        return numbers;
    }
};