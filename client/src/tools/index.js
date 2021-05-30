const replace_char = function(str, ind, rep) { 
    // Change a single char of a string (btw strings are immutable in js)
    return str.substring(0, ind) + rep + str.substring(ind + 1);
}

const probability = (p) => { 
    // Returns true with probability p
    return Math.random() < p;
}

const sample_ints = (n, range) => { 
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

export { replace_char, probability, sample_ints, shuffle_array, has_duplicates };