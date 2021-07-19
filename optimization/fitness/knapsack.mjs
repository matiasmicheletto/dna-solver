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

// Penalty functions enumerator
export const penalty = {
    STEP: "step",
    RAMP: "ramp",
    SIGMOID: "sigmoid"
};

// Filters for penalty functions
export const filters = {
    step: (x,c) => x <= c ? 1:0,
    sigmoid: (x,c,r) => 1 - 1 / (1 + Math.exp((c - x) * r)),
    ramp: (x,c,r) => {        
        if(x <= c - r) 
            return 1;
        if(x <= c + r )
            return 0.5 + (c - x)/2/r;
        return 0; 
    }
};

export default class Knapsack extends Fitness {
    constructor(items = default_items, W = default_w, p = penalty.STEP, pl = 0.2) {
        super({_items: items, _W: W, _name:"Knapsack problem"});
        this.penalty_lvl = pl; // This parameter is used to control filter slope or level
        this.penalty = p; // Use the setter to select the eval method
        this.init();
    }

    init() { 
        // Separate items in different arrays
        this._values =  this._items.map(v=>v[0]);
        this._weights = this._items.map(v=>v[1]);
        this._max_weight = array_sum(this._weights);
    }

    set W(w) {
        if(typeof(w)==="number" && w > 0)
            if(w) this._W = w;
    }

    set items(items) {
        if(Array.isArray(items))
            if(items.length > 2){ // At least 3 items
                this._items = items;
                this.init();
            }
    }

    set penalty(f){
        switch(f){
            default:
            case penalty.STEP:
                this._penalty_fc = x => filters.step(x, this._W);
                break;
            case penalty.RAMP:
                this._penalty_fc = x => filters.ramp(x, this._W, 1/this._pl/2);
                break;
            case penalty.SIGMOID:
                this._penalty_fc = x => filters.sigmoid(x, this._W, this._pl);
                break;
        }
        this._penalty = f;
    }

    set penalty_lvl(pl){
        if(typeof(pl) === "number" && pl > 0)
            this._pl = pl;            
    }

    get W() {
        return this._W;
    }

    get items() {
        return this._items;
    }

    get penalty() {
        return this._penalty;
    }

    get penalty_fc() {
        return this._penalty_fc;
    }

    get penalty_lvl() {
        return this._pl;
    }

    get max_weight() {
        return this._max_weight;
    }

    get config() {
        return {
            items: this._items,
            W: this._W,
            penalty: this._penalty
        };
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
        return "V = " + obj[0] + ", W = " + obj[1];
    }

    decode(g) { // Returns the selected elements
        return Array.from(Array(this._items.length).keys()).filter((v, ind) => g[ind]===1).join(", ");
    }

    eval(g) {
        const obj = this.objective(g);
        return obj[0]*this._penalty_fc(obj[1]);
    }

    rand_encoded() {
        // Random binary array
        return new Array(this._items.length).fill(0).map(() => Math.round(Math.random()));
    }
}