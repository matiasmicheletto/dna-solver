const replace_char = function(str, ind, rep) { 
    // Change a single char of a string (btw strings are immutable in js)
    return str.substring(0, ind) + rep + str.substring(ind + 1);
}

const probability = (p) => { 
    // Returns true with probability p
    return Math.random() < p;
}

const random_select = (n, range) => { 
    // Returns array of "n" indexes within the specified "range"
    var arr = [];
    while(arr.length < n){
        var r = Math.floor(Math.random() * range);
        if(arr.indexOf(r) === -1) arr.push(r);
    }
    return arr;
}

const shuffle_array = (array) => {
    // Durstenfeld shuffle algorithm
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

const has_duplicates = arr => {
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

const coord_to_weight_matrix = (p, dist) => {
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

export { 
    replace_char, 
    probability, 
    random_select, 
    shuffle_array, 
    has_duplicates,
    coord_to_weight_matrix 
};