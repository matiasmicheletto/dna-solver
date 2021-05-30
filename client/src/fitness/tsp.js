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

import { shuffle_array, has_duplicates } from "../tools";

//////////// TRAVELLING SALESPERSON PROBLEM /////////////////

// Distance equations
const euclidean_dist = (p1, p2) => Math.sqrt((p1[0]-p2[0])*(p1[0]-p2[0])+(p1[1]-p2[1])*(p1[1]-p2[1]));
const sq_dist = (p1, p2) => p1[0] - p2[0] + p1[1] - p2[1];
const haversine = (p1, p2) => { // Haversine formula. Points should be in format [lat,long]
    // Convert coordinates to radians
    const r1 = [p1[0]/180*Math.PI, p1[1]/180*Math.PI];
    const r2 = [p2[0]/180*Math.PI, p2[1]/180*Math.PI];
    const a = Math.pow(Math.sin((r2[0]-r1[0]) / 2),2) + Math.cos(r1[0]) * Math.cos(r2[0]) * Math.pow(Math.sin((r2[1] - r1[1]) / 2),2);
    return 12742 * Math.asin(Math.sqrt(a)); // Distance is in km
};
// For testing, haversine([45, 67.5], [43, 65])) should return 299.6 (km)

// Build the edges weights matrix
const get_weights = (p,dist) => {
    const N = p.length;
    let w = [];
    for(let j = 0; j < N-1; j++){
        if(!w[j]) w[j] = [];
        w[j][j] = 0;
        for(let k = j+1; k < N; k++){
            const d = dist(p[j], p[k]);
            w[j][k] = d;
            if(!w[k]) w[k] = [];
            w[k][j] = d;
        }
    }
    return w;
};

// Coordinates of destinations (lat, lng)
const places = [ 
    [40, 55],
    [42, 58],
    [48, 66],
    [36, 54],
    [50, 58],
    [49, 64],
    [48, 59],
    [29, 62]
];

const weights = get_weights(places, euclidean_dist);

const Tsp = {
    description: () => (
        <div>
            <p>The <a href="https://en.wikipedia.org/wiki/Travelling_salesman_problem">Travelling Salesperson Problem (TSP)</a> asks the following question: "Given a list of cities and the distances 
                between each pair of cities, what is the shortest possible route that visits each city exactly once and returns 
                to the origin city?" It is an NP-hard problem in combinatorial optimization, important in theoretical computer 
                science and operations research.</p>
        </div>
    ),
    fitness: x => {
        if(has_duplicates(x)) 
            return Infinity;
        let d = 0; // Total distance traveled
        for(let k = 0; k < x.length-1; k++)        
            d += weights[ x[k] ][ x[k+1] ];
        d += weights[ x[x.length-1] ][ x[0] ]; // Returning to start point
        return 100/d; // If d=0, Infinity is returned
    },
    decode: b => b,
    encode: d => d,
    beautify: b => b.join("-"), // Separate elements with a dash
    generator: () => { // Random order of numbers from 1 to N
        let numbers = Array.from(Array(places.length).keys());
        shuffle_array(numbers);
        return numbers;
    }
};

export default Tsp;
