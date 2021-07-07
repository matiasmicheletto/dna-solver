import Fitness from './index.mjs';
import { array_sum } from '../tools/index.mjs';

////////// KNAPSACK PROBLEM /////////////

// Default set of 10 items (pairs [v,w])
// Example from https://en.wikipedia.org/wiki/Knapsack_problem
const default_items = [
    [505, 23],
    [352, 26],
    [458, 20],
    [220, 18],
    [354, 32],
    [414, 27],
    [498, 29],
    [545, 26],
    [473, 30],
    [543, 27]
];

// Weight limit
const default_w = 67;

// Unfeasible solutions treatment enumerators
export const feasib_treat = {
    FILTER: "filter",
    PENALTY: "penalty"
};

export default class Knapsack extends Fitness {
    constructor(items = default_items, W = default_w, ft = feasib_treat.PENALTY) {
        super({_items: items, _W: W, _name:"Knapsack problem"});
        this.feasibility = ft; // Use the setter to select the eval method
        this.init();
    }

    init() { 
        // Separate items in different arrays
        this._values =  this._items.map(v=>v[0]);
        this._weights = this._items.map(v=>v[1]);
        // Obtain the cost factor for unfeasible solutions
        // (in case of penalty mode selected)
        const max_weight = array_sum(this._weights);
        this._df = max_weight - this._W;
    }

    set W(w) {
        if(w) {
            this._W = w;
            const max_weight = array_sum(this._weights);
            this._df = max_weight - this._W;
        }
    }

    set items(items) {
        this._items = items;
        this.init();
    }

    set feasibility(f){
        switch(f){
            default:
            case feasib_treat.FILTER:
                this.eval = this._eval_filter;
                break;
            case feasib_treat.PENALTY:
                this.eval = this._eval_penalty;
                break;
        }
        this._feasibility = f;
    }

    get W() {
        return this._W;
    }

    get items() {
        return this._items;
    }

    get feasibility() {
        return this._feasibility;
    }

    objective(selected) {
        // Objective function returns values and weights as a 2D vector
        const fltr = (v, ind) => selected[ind]===1; // Filter for selected items
        const selected_weights = this._weights.filter(fltr);
        const selected_values = this._values.filter(fltr);
        return [array_sum(selected_values), array_sum(selected_weights)];
    }

    objective_str(x) {
        const obj = this.objective(x);
        return "V = "+obj[0]+", W = "+obj[1];
    }

    decode(g) {
        return Array.from(Array(this._items.length).keys()).filter((v, ind) => g[ind]===1).join(", ");
    }

    _eval_filter(g) {
        // Unfeasible solutions returs 0
        const obj = this.objective(g);
        if(obj[1] <= this._W) // Is solution is feasible
            return obj[0]; // Return value
        else
            return 0; // Else fitness is 0
    }

    _eval_penalty(g) {
        // Value multiplied by factor proportional to difference between
        // weight and weight limit
        const obj = this.objective(g);
        return obj[0]*(1- (obj[1] - this._W)/this._df);
    }

    rand_encoded() {
        // Random binary array
        return new Array(this._items.length).fill(0).map(() => Math.round(Math.random()));
    }
}