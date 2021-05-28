/*
All fitness functions should have the following attributes:
    - description: Problem description.
        * type: Function.
        * input: None.
        * output: Component. 
    - fitness: Fitness function to maximize. 
        * type: Function.
        * input: Optimization variable. May be number, array or object.
        * output: Should return a non negative scalar number (integer or float). 
    - decode: Function for decoding a chromosome's genotype and obtaining its phenotype.
        * type: Function.
        * input: Array.
        * output: Obtimization variable. May be number, array or object.
    - encode: Function for encoding a candidate solution (phenotype) and get its corresponding genotype.
        * type: Function.
        * input: Optimization variable. May be number, array or object.
        * output: Array.
    - beautify: Function for decoding a chromosome's genotype using a human-readable format.
        * type: Function.
        * input: Optimization variable. May be number, array or object.
        * output: String.
    - generator: Function to generate a random individual during initialization. 
        * type: Function.
        * input: None.
        * output: Optimization variable. May be number, array or object.

Other GA configuration parameters can be added to overwrite the default ones.
*/

import { shuffleArray } from "../tools";

////////// N-QUEENS PROBLEM /////////////

const N = 8; // Board size

const NQueens = {
    description: () => (
        <div>
            <p>The {N} queens puzzle is the problem of placing {N} chess queens on an {N}x{N} chessboard so that no two queens threaten each other; thus, a solution requires that no two queens share the same row, column, or diagonal.</p>
            <p>Candidate solutions are encoded using arrays of {N} elements where each element corresponds to each column and its value indicates the row occupied by the queen of that column.</p>
        </div>
    ),
    fitness: columns => { // Counts the number of queens in conflict        
        let cntr = 0; // Conflict counter
        for(let col1=0; col1<N-1; col1++){
            for(let col2=col1+1; col2<N; col2++){                
                if(columns[col1]===columns[col2]) { cntr++; continue; } // Same row
                if(col1 + columns[col1] === col2 + columns[col2]) { cntr++; continue; } // Same negative diagonal
                if(col2 - col1 === columns[col2] - columns[col1]) { cntr++; continue; } // Same positive diagonal
            }
        }
        return 100-cntr;
    },
    // No need to encode or decode, as genotype and phenotype are the same
    decode: b => b, 
    encode: d => d, 
    beautify: b => b.join("-"), // Separate elements with a dash
    generator: () => { // Random order of numbers from 1 to N
        let numbers = Array.from(Array(N).keys());
        shuffleArray(numbers);
        return numbers;
    },
    mut_gen: () => Math.floor(Math.random()*N) // Overwrite the random allele generator function
};

export default NQueens;