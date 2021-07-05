import Fitness from './index.mjs';
import { array_sum } from "../tools/index.mjs";

////////// SUBSET SUM PROBLEM /////////////

// By default, a random set of 20 integers between -100 and 100 is used
let default_set = [];
for(let k = 0; k < 20; k++)
    default_set.push(Math.round(Math.random()*200)-100);
default_set.sort((a,b) => a-b);

export default class SubsetSum extends Fitness {
    constructor(set = default_set, T = 0) {
        super({_set: set, _T: T, _name:"Subset sum problem"});
    }

    set T(t) {
        if(t) this._T = t;
    }

    set set(s) {
        this._set = s;
    }

    get T() {
        return this._T;
    }

    get set() {
        return this._set;
    }

    objective(selected) { // Returns the sum of the selected elements
        // Selected elements
        const subset = this._set.filter((v, ind) => selected[ind]===1);
        // Return sum and number of elements
        return [array_sum(subset), subset.length];
    }

    objective_str(x) {
        const obj = this.objective(x);
        return "S = "+obj[0]+", N = "+obj[1];
    }

    decode(g) {
        return this._set.filter((v, ind) => g[ind]===1).join(",");
    }

    eval(g) {
        // Fitness function returns values between 0 and 100
        if(!g.every(item => item === 0)){ // If proposed array is not empty
            const obj = this.objective(g);
            return Math.abs(100 / (Math.abs(obj[0] - this._T) + 1 ) - obj[1] / g.length);
        }else{ // Return lowest possible value for fitness
            return 0;
        }
    }

    rand_encoded() {
        // Random binary array
        let random_selected = [];
        for(let k = 0; k < this._set.length; k++)
            random_selected.push(Math.round(Math.random()));
        return random_selected;
    }
}