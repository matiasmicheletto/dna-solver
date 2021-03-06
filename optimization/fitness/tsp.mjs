import Fitness from './index.mjs';
import { 
    shuffle_array, 
    has_duplicates, 
    coord_to_weight_matrix,
    normalize_coords
 } from "../tools/index.mjs";
import { mutation, crossover } from '../ga/index.mjs';

//////////// TRAVELLING SALESPERSON PROBLEM /////////////////

export const distance = { // Distance functions enumerator
    EXPLICIT: "explicit", // Weight matrix is already provided
    EUCLIDEAN: "euclidean", // Used in most cases
    PSEUDOEUCLIDEAN: "pseudoeuclidean", // Uded in att type (tsplib)
    MANHATTAN: "manhattan", // For cities
    HAVERSINE: "haversine" // For geospatial data
}

const default_places = [ 
        [40, 55],
        [42, 58],
        [48, 66],
        [36, 54],
        [50, 58],
        [49, 64],
        [48, 59],
        [29, 62]
];

export default class Tsp extends Fitness {
    constructor(places = default_places, dist = distance.EUCLIDEAN, weight_matrix = null) {
        super({_places: places}); 

        this._name = "Travelling Salesperson";

        // If distance function is provided, set the distance function and calculate the weight matrix
        if(dist !== distance.EXPLICIT)
            this.distance = dist;
        else // If weight matrix is provided, no need to use distance function
            this._weights = weight_matrix;

        // Normalize coordinates
        this._norm_places = normalize_coords(this._places);
    }

    /// SETTERS

    set name(n) {
        this._name = n;
    }

    set distance(d) {
        switch(d){
            default: // Default distance function is euclidean
            case distance.EXPLICIT:
                this._dist_function = function(){};
                this._unit = "";
                break;
            case distance.EUCLIDEAN:
                this._dist_function = this._euclidean_dist;
                this._unit = "";
                break;
            case distance.PSEUDOEUCLIDEAN:
                this._dist_function = this._pseudoeuclidean_dist;
                this._unit = "";
                break;
            case distance.MANHATTAN:
                this._dist_function = this._manhattan_dist;
                this._unit = "blocks";
                break;
            case distance.HAVERSINE: 
                this._dist_function = this._haversine;
                this._unit = "km";
                break;
        }

        this._distance = d;
        // Weight matrix values should be updated using the new distance equation
        if(d !== distance.EXPLICIT)
            this._weights = coord_to_weight_matrix(this._places, this._dist_function);
    }
 
    set places(p) {
        if(Array.isArray(p))
            if(p.length > 2){ // Should contain at least 3 destinations
                this._places = p;
                // Weight matrix values should be updated using the new distance equation
                this._weights = coord_to_weight_matrix(this._places, this._dist_function);
                // Update normalized coordinates
                this._norm_places = normalize_coords(this._places);
            }
    }

    set weight_matrix(w) {
        if(Array.isArray(w))
            if(w.length > 2) // At least 3 elements
                this._weights = w;
        
    }

    /// GETTERS

    get name() {
        return this._name;
    }

    get distance() {
        return this._distance;
    }

    get places() {
        return this._places;
    }

    get norm_places() {
        return this._norm_places;
    }

    get weight_matrix() {
        return this._weights;
    }

    get config() {
        return {
            places: this._places,
            distance: this._distance,
            weight_matrix: this._weights
        };
    }

    get ga_config() { // Overwrite the gen generator and crossover operator config
        // Adding a GA module configuration attributes will overwrite the defaults one
        return {
            mutation: mutation.SWAP,
            crossover: crossover.PMX,
            mut_prob: 1/this._places.length
        }
    }

    objective(x) {
        let d = 0; // Total distance traveled
        for(let k = 0; k < x.length-1; k++)
            d += this._weights[ x[k] ][ x[k+1] ];
        d += this._weights[ x[x.length-1] ][ x[0] ]; // Returning to start point
        return d;
    }

    objective_str(x){ 
        return this.objective(x).toFixed(2) + " " + this._unit;
    }

    eval(g){ 
        return has_duplicates(g) ? 0 : 10000/this.objective(g);
    }
    
    rand_encoded() {
        let numbers = Array.from(Array(this._places.length).keys());
        shuffle_array(numbers);
        return numbers;
    }

    
    ////// DISTANCE FUNCTIONS //////

    _euclidean_dist(p1, p2) {
        return Math.sqrt((p1[0]-p2[0])*(p1[0]-p2[0])+(p1[1]-p2[1])*(p1[1]-p2[1]));
    }

    _pseudoeuclidean_dist(p1, p2) {
        // For att problem (see tsplib documentation)
        const rij = Math.sqrt( ((p1[0] - p2[0]) * (p1[0] - p2[0]) + (p1[1] - p2[1]) * (p1[1] - p2[1])) / 10.0 );
        const tij = Math.round(rij);
        return (tij < rij) ? tij + 1 : tij;
    }

    _manhattan_dist(p1, p2) {
        return Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1]);
    }

    _haversine(p1, p2) { // Haversine formula. Points should be in format [lat,long]
        // haversine([45, 67.5], [43, 65])) should return 299.6 (km)
        const r1 = [p1[0]/180*Math.PI, p1[1]/180*Math.PI];
        const r2 = [p2[0]/180*Math.PI, p2[1]/180*Math.PI];
        const a = Math.pow(Math.sin((r2[0]-r1[0]) / 2),2) + Math.cos(r1[0]) * Math.cos(r2[0]) * Math.pow(Math.sin((r2[1] - r1[1]) / 2),2);
        return 12742 * Math.asin(Math.sqrt(a)); // Distance is in km
    }
};