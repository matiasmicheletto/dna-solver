import { adjs, nouns } from './strings';

// Change a single char of a string (btw strings are immutable in js)
export const replace_char = (str, ind, rep) =>  str.substring(0, ind) + rep + str.substring(ind + 1);

// Returns true with probability p
export const probability = p => (Math.random() < p);

// Generates a random non repeating string identifier
export const generate_id = () => Math.random().toString(36).substr(2)+Date.now();

// Random integer in range (0..max)
export const randint = max => Math.floor(Math.random()*max);

// Capitalize string
export const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);

// Generates a random string name (adjective-space-noun)
export const random_name = () => capitalize(adjs[randint(adjs.length)]) + " " + capitalize(nouns[randint(nouns.length)]);

export const random_select = (n, range) => { 
    // Returns array of "n" indexes within the specified "range"
    var arr = [];
    while(arr.length < n){
        var r = randint(range);
        if(arr.indexOf(r) === -1) arr.push(r);
    }
    return arr;
}

export const shuffle_array = (array) => {
    // Durstenfeld shuffle algorithm
    for (let i = array.length - 1; i > 0; i--) {
        const j = randint(i+1);
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export const has_duplicates = arr => {
    // Search for duplicated numbers in array    
    let temp = Array.from(arr);
    for (let i = 0; i < temp.length; i++) {
        var abs_value = Math.abs(temp[i]);
        if (temp[abs_value] >= 0)
            temp[abs_value] = -temp[abs_value];
        else
            return true;
    }
    return false;
}

export const coord_to_weight_matrix = (p, dist) => {
    // Returns the weight matrix for set of points "p" using provided distance function "dist"
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
}    