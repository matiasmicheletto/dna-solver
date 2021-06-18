import Fitness from './index.mjs';

////////// INVERTED QUADRATIC /////////////
// Fitness function y = a - b*(x-c)^2;

export const get_params = (nbit, a) => {
    // First zero is z1 = 0, and the second is at 2^_nbit-1 (max range)
    const z1 = Math.pow(2, nbit) - 1;
    // Then we can calculate the value of b that makes the quadratic have a max of "a".
    const b = 4*a/z1/z1;
    // The max is in the middle between the zeros, so its z1/2.
    const c = z1/2;
    return [z1, b, c];
}

class Quadratic extends Fitness {
    constructor(nbit = 10, a = 1000) {
        super({_nbit: nbit, _a: a});
        [this._z1, this._b, this._c] = get_params(nbit, a);
    }

    set nbit(val) { // Update parameter nbit
        this._nbit = val;
        [this._z1, this._b, this._c] = get_params(val, this._a);
    }

    set a(val) { // Update parameter "a"
        this._a = val;
        [this._z1, this._b, this._c] = get_params(this._nbit, val);
    }

    get name() {
        return "Parabola optimization";
    }

    _objective = x => {
        return this._a - this._b*(x - this._c)*(x - this._c);
    }

    _objective_nice = x => this._fitness(x).toFixed(2)

    _fitness = x => {
        return this._objective(this._decode(x));
    }
    
    // Decoder function will convert the binary array to decimal
    _decode = b => parseInt(b.join("").slice(-this._nbit), 2)
    
    // Encoder function converts the decimal value of x to bitstring
    _encode = d => d.toString(2)
                .padStart(this._nbit,"0")
                .slice(-this._nbit)
                .split("")
                .map(e=>parseInt(e, 10))
    
    // Beautifier function is the same as decoder
    _decode_nice = b => this._decode(b)
    
    // Generator generates numbers for x between 0 and 2^_nbit
    _rand_encoded = () => this._encode(Math.floor(Math.random() * Math.pow(2, this._nbit)))    
}




export default Quadratic;