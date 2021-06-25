/*
Fitness Function Class Module
-----------------------------
Fitness functions are used to compare candidate solutions generated by the optimization algorithm.
The goal is to provide context for the optimization problem and decouple this context from the optimizer
in order to use multiple fitness models with the same optimization algorithm.
*/

import { generate_id } from '../tools/index.mjs';

class Fitness { // Fitness model class
    constructor(params) {
        for(let p in params)
            this[p] = params[p];
        this._id = generate_id();
    }

    get id() { // Fitness unique identifier
        return this._id;
    }

    get name() { // A readable name for this fitness function model
        return "N/D";
    }

    decode(g) { // Default decoding function
        return g.join("-");
    }

    // This function is used to override the GA default configuration
    // that is necesary in some cases.
    get ga_config() {
        return {};
    }
}

export default Fitness;