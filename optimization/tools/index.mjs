import { adjs, nouns } from './strings.mjs';

// Change a single char of a string (btw strings are immutable in js)
export const replace_char = (str, ind, rep) =>  str.substring(0, ind) + rep + str.substring(ind + 1);

// Returns true with probability p
export const probability = p => (Math.random() < p);

// Generates a random non repeating string identifier
export const generate_id = () => "_" + Math.random().toString(36).substr(2) + Date.now();

// Random integer in range (0..max)
export const randint = max => Math.floor(Math.random()*max);

// Capitalize string
export const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);

// Generates a random string name (adjective-space-noun)
export const random_name = () => capitalize(adjs[randint(adjs.length)]) + " " + capitalize(nouns[randint(nouns.length)]);

export const hue2rgb = (p, q, h) => {
    // Color conversion
    if (h < 0) h += 1;
    if (h > 1) h -= 1;
    if (h < 1/6) return p + (q - p) * 6 * h;
    if (h < 1/2) return q;
    if (h < 2/3) return p + (q - p) * (2/3 - h) * 6;
    return p;
};

export const hsl2rgb = (h, s, l) => {
    // Color conversion
    let r, g, b = l; // In case s == 0, set all values to luminance

    if (s !== 0) {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [ Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255) ];
};

export const random_select = (n, range) => { 
    // Returns array of "n" indexes within the specified "range"
    var arr = [];
    while(arr.length < n){
        var r = randint(range);
        if(arr.indexOf(r) === -1) arr.push(r);
    }
    return arr;
};

export const shuffle_array = (array) => {
    // Durstenfeld shuffle algorithm
    for (let i = array.length - 1; i > 0; i--) {
        const j = randint(i+1);
        [array[i], array[j]] = [array[j], array[i]];
    }
};

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
};

export const coord_to_weight_matrix = (p, dist) => {
    // Returns the weight matrix for set of points "p" using provided distance function "dist"
    const N = p.length;
    let w = [];
    for(let j = 0; j < N-1; j++){
        if(!w[j]) w[j] = [];
        w[j][j] = 0; // Distance between same position is 0
        for(let k = j+1; k < N; k++){
            const d = dist(p[j], p[k]);
            w[j][k] = d;
            if(!w[k]) w[k] = [];
            w[k][j] = d;
        }
        w[N-1][N-1] = 0; // Last element
    }    
    return w;
};    

export const normalize_coords = coords => {
    // Return normalized (0..1) coordinates
    const maxX = Math.max.apply(Math, coords.map(v => v[0]));
    const minX = Math.min.apply(Math, coords.map(v => v[0]));
    const maxY = Math.max.apply(Math, coords.map(v => v[1]));
    const minY = Math.min.apply(Math, coords.map(v => v[1]));
    return coords.map( p => [ (p[0]-minX)/(maxX-minX) , (p[1]-minY)/(maxY-minY) ]);
}

// Mean or average of an array
export const array_mean = arr => arr.reduce((r, a) => a + r, 0)/arr.length;

// Array variance s2
export const array_s2 = (arr,m) => arr.reduce((r, a) => (a - m)*(a - m) + r, 0)/arr.length;

// Mean or average of an array of objects with a numeric attribute
export const obj_array_mean = (arr, attr) => arr.reduce((r, a) => a[attr] + r, 0)/arr.length;

export const matrix_columnwise_mean = matrix => {
    // Calculate the average accross a single columns of a matrix
    // Matrix should have same number of columns for every row!
    const numrows = matrix.length;
    const numcols = matrix[0].length;
    let avgs = new Array(numcols).fill(0);
    for(let row = 0; row < numrows; row++)
        for(let col = 0; col < numcols; col++)
            avgs[col] = (avgs[col]*row + matrix[row][col]) / (row+1); // cummulative avg
    return avgs;
};

export const final_slope = (data, window) => { 
    // Moving average slope of las data.
    const len = data.length; 
    return (len > 0 && window > 0) ? 
        (data[len-1] - data[len - Math.min(len, window)]) / data[len - 1] 
        : 
        0;
};