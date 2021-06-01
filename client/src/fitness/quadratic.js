import Fitness from './index';

////////// INVERTED QUADRATIC /////////////
// Fitness function y = a - b*(x-c)^2;

class Quadratic extends Fitness {
    constructor(nbit = 10, a = 1000) {
        super({_nbit: nbit, _a: a});

        // First zero is z1 = 0, and the second is at 2^_nbit-1 (max range)
        this._z1 = Math.pow(2, this._nbit) - 1;
        // Then we can calculate the value of b that makes the quadratic have a max of "a".
        this._b = 4*this._a/this._z1/this._z1;
        // The max is in the middle between the zeros, so its z1/2.
        this._c = this._z1/2;
    }

    set nbit(val) { // Update parameter nbit
        this._nbit = val;
        this._z1 = Math.pow(2, this._nbit) - 1;        
        this._b = 4*this._a/this._z1/this._z1;        
        this._c = this._z1/2;
    }

    set a(val) { // Update parameter "a"
        this._a = val;
        this._b = 4*this._a/this._z1/this._z1;
    }

    _doc = () => {
        let desc = `<div>
            <p>Fitness function is <b>y = ${this._a}-(x-${this._c})<sup>2</sup>/${(1/this._b).toFixed(2)}</b> for <b>x</b> in range <b>(0..${this._z1+1})</b>.</p> 
            <p>Hit the <i>Evolve!</i> button and let the algorithm find the value of <b>x</b> (column phenotype) that maximizes the fitness function <b>y</b>.</p>
        </div>`;
        return desc;
    }

    _objective = x => {
        return this._a - this._b*(x - this._c)*(x - this._c);
    }

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