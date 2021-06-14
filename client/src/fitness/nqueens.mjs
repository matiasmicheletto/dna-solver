import Fitness from './index.mjs';
import { shuffle_array } from "../tools/index.mjs";
import { mutation, crossover } from '../ga/index.mjs';

////////// N-QUEENS PROBLEM /////////////

class NQueens  extends Fitness {
    
    constructor(N = 8) {
        super({_N: N});        
    }

    set N(val) {
        this._N = val;
    }

    // Max possible conflicts in a NxN chess board
    _get_max_conflict = n => n*(n + 1) / 2

    _doc = () => `<div>
            <p>The ${this._N} queens puzzle is the problem of placing ${this._N} chess queens on an ${this._N}x${this._N} 
            chessboard so that no two queens threaten each other; thus, a solution requires that no two queens share 
            the same row, column, or diagonal.</p>
            <p>Candidate solutions are encoded using arrays of ${this._N} elements where each element corresponds to 
            each column and its value indicates the row occupied by the queen of that column.</p>
        </div>`

    _objective = columns => { // Counts the number of queens in conflict        
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

    _objective_nice = columns => {
        return this._objective(columns) + " conflicts";
    }

    _fitness = x => 100 / ( this._objective(x) + 1 );

    _decode_nice = b => b.join("-")

    _rand_encoded = () => { // Random order of numbers from 1 to N
        let numbers = Array.from(Array(this._N).keys());
        shuffle_array(numbers);
        return numbers;
    }

    get name() {
        return "N Queens";
    }

    get config() { // Overwrite the random allele generator function
        // Adding a GA module configuration attributes will overwrite the defaults one
        let c = super.config;
        c.mut_gen = () => Math.floor(Math.random()*this._N);
        c.mutation = mutation.RAND // Rand operator uses mut_gen function
        return c;
    }

}

export default NQueens;