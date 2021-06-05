
import Fitness from './index';
import { shuffle_array, has_duplicates, coord_to_weight_matrix } from "../tools";

//////////// TRAVELLING SALESPERSON PROBLEM /////////////////

const distance = { // Distance functions
    EUCLIDEAN: "euclidean",
    MANHATTAN: "manhattan",
    HAVERSINE: "haversine"
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

class Tsp extends Fitness {
    constructor(places = default_places, dist = distance.EUCLIDEAN) {
        super({_places: places}); 

        // Set the distance function
        this.distance = dist;
    }

    /// SETTERS

    set distance(d) {
        switch(d){
            default: // Default distance function is euclidean
            case distance.EUCLIDEAN:
                this._distance = this._euclidean_dist;
                this._unit = "";
                break;
            case distance.MANHATTAN:
                this._distance = this._manhattan_dist;
                this._unit = "blocks";
                break;
            case distance.HAVERSINE: 
                this._distance = this._haversine;
                this._unit = "km";
                break;
        }
        // Weight matrix values should be updated using the new distance equation
        this._weights = coord_to_weight_matrix(this._places, this._distance);
    }

    set places(p) {
        this._places = p;
        // Weight matrix values should be updated using the new distance equation
        this._weights = coord_to_weight_matrix(this._places, this._distance);
    }

    // Using arrow functions here to override parent class methods (not working other way)

    _doc = () => `<p>The <a href="https://en.wikipedia.org/wiki/Travelling_salesman_problem">Travelling Salesperson Problem (TSP)</a> 
            asks the following question: "Given a list of cities and the distances between each pair of cities, what is the 
            shortest possible route that visits each city exactly once and returns to the origin city?" It is an NP-hard 
            problem in combinatorial optimization, important in theoretical computer science and operations research.</p>`

    _objective = x => {
        let d = 0; // Total distance traveled
        for(let k = 0; k < x.length-1; k++)
            d += this._weights[ x[k] ][ x[k+1] ];
        d += this._weights[ x[x.length-1] ][ x[0] ]; // Returning to start point
        return d;
    }

    _objective_nice = x => {
        return this._objective(x).toFixed(2) + " " + this._unit;
    }

    _fitness = x => has_duplicates(x) ? 0 : 100/this._objective(x)

    _decode_nice = b => b.join("-")

    _rand_encoded = () => {
        let numbers = Array.from(Array(this._places.length).keys());
        shuffle_array(numbers);
        return numbers;
    }

    _euclidean_dist = (p1, p2) => Math.sqrt((p1[0]-p2[0])*(p1[0]-p2[0])+(p1[1]-p2[1])*(p1[1]-p2[1]))

    _manhattan_dist = (p1, p2) => Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1])

    _haversine = (p1, p2) => { // Haversine formula. Points should be in format [lat,long]
        // haversine([45, 67.5], [43, 65])) should return 299.6 (km)
        const r1 = [p1[0]/180*Math.PI, p1[1]/180*Math.PI];
        const r2 = [p2[0]/180*Math.PI, p2[1]/180*Math.PI];
        const a = Math.pow(Math.sin((r2[0]-r1[0]) / 2),2) + Math.cos(r1[0]) * Math.cos(r2[0]) * Math.pow(Math.sin((r2[1] - r1[1]) / 2),2);
        return 12742 * Math.asin(Math.sqrt(a)); // Distance is in km
    }
}


export default Tsp;
