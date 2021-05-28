/*
All fitness functions should have the following attributes:
    - fitness: Fitness function to maximize. 
        * type: Functiom.
        * input: Optimization variable. May be number, array or object.
        * output: Should return a non negative scalar number (integer or float). 
    - decode: Function for decoding a chromosome's genotype and obtaining its phenotype.
        * type: Functiom.
        * input: Array.
        * output: Obtimization variable. May be number, array or object.
    - encode: Function for encoding a candidate solution (phenotype) and get its corresponding genotype.
        * type: Functiom.
        * input: Optimization variable. May be number, array or object.
        * output: Array.
    - generator: Function to generate a random individual during initialization. 
        * type: Functiom.
        * input: None.
        * output: Optimization variable. May be number, array or object.
*/

import { shuffleArray } from "../tools";

////////// N-QUEENS PROBLEM /////////////

const N = 10; // Board size

const NQueens = {
    fitness: columns => { // Counts the number of queens in conflict        
        const last = columns[N - 1];
        let previous = N - 2;
        let conflict_cnt = 0;
        while (previous >= 0) {
            if (columns[previous] === last) conflict_cnt++;
            if (last - (N - 1) === columns[previous] - previous) conflict_cnt++;
            if (last + (N - 1) === columns[previous] + previous) conflict_cnt++;
            previous--;
        }
        return N - conflict_cnt;
    },    
    // No need to encode or decode, as genotype and phenotype are the same
    decode: b => b, 
    encode: d => d, 
    generator: () => { // Random order of numbers from 1 to N
        let numbers = Array.from(Array(N).keys());
        shuffleArray(numbers)
        return numbers;
    }
};

export default NQueens;