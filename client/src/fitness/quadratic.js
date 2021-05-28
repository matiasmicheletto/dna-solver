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


////////// INVERTED QUADRATIC /////////////

// Fitness function y = a - b*(x-c)^2;
// Length of bitstring for genotypes encoding. Let use a small value
const nbit = 10; 
// First zero is z1 = 0, and the second is at 2^nbit-1 (max range)
const z1 = Math.pow(2, nbit) - 1; 
// Lets force the max value for the fitness to be 10.000, so a = 10.000
const a = 10000; 
// Then we can calculate the value of b that makes the quadratic have a max of "a".
const b = 4*a/z1/z1; 
// The max is in the middle between the zeros, so its z1/2.
const c = z1/2; 

const Quadratic = {
    fitness: x => a-b*(x-c)*(x-c),
    // Decoder function will convert the binary array to decimal
    decode: b => parseInt(b.join("").slice(-nbit), 2),
    // Encoder function converts the decimal value of x to bitstring
    encode: d => d.toString(2).padStart(nbit,"0").slice(-nbit).split("").map(e=>parseInt(e)),
    // Generator generates numbers for x between 0 and 2^nbit
    generator: () => Math.floor(Math.random() * Math.pow(2,nbit))    
};

export default Quadratic;