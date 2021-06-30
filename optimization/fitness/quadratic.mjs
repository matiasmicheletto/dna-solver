import Fitness from './index.mjs';

////////// INVERTED QUADRATIC /////////////
// Fitness function y = a - b*(x-c)^2;

export default class Quadratic extends Fitness {
    constructor(nbit = 10, a = 1000) {
        super({_nbit: nbit, _a: a});
        this._update_params();
    }

    _update_params() {
        // First zero is z1 = 0, and the second is at 2^_nbit-1 (max range)
        this._z1 = Math.pow(2, this._nbit) - 1;
        // Then we can calculate the value of b that makes the quadratic have a max of "a".
        this._b = 4*this._a/this._z1/this._z1;
        // The max is in the middle between the zeros, so its z1/2.
        this._c = this._z1/2;
    }

    set nbit(val) {
        this._nbit = val;
        this._update_params();
    }

    set a(val) {
        this._a = val;
        this._update_params();
    }

    get name() {
        return "Parabola optimization";
    }

    get nbit() {
        return this._nbit;
    }

    get a() {
        return this._a;
    }

    get b() {
        return this._b;
    }

    get c() {
        return this._c;
    }

    get z1() {
        return this._z1;
    }
    
    objective(x) {
        return this._a - this._b*(x - this._c)*(x - this._c);
    }

    objective_str(x) {
        return this.eval(x).toFixed(2);
    }

    eval(g) {
        return this.objective(this.decode(g));
    } 
    
    // Decoder function will convert the binary array to decimal
    decode(g) {
        return parseInt(g.join("").slice(-this._nbit), 2);
    }
    
    // Encoder function converts the decimal value of x to bitstring
    encode(x) {
        return x.toString(2)
            .padStart(this._nbit,"0")
            .slice(-this._nbit)
            .split("")
            .map(function(e){ return parseInt(e, 10)});
    }
    
    // Generator generates numbers for x between 0 and 2^_nbit
    rand_encoded() {
        return this.encode(Math.floor(Math.random() * Math.pow(2, this._nbit)));
    }
};