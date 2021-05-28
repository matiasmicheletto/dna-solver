const replaceChar = function(str, ind, rep) { 
    // Change a single char of a string (btw strings are immutable in js)
    return str.substring(0, ind) + rep + str.substring(ind + 1);
}

const probability = (p) => { 
    // Returns true with probability p
    return Math.random() < p;
}

const sampleInt = (n, range) => { 
    // Returns array of "n" indexes within the specified "range"
    var arr = [];
    while(arr.length < n){
        var r = Math.floor(Math.random() * range);
        if(arr.indexOf(r) === -1) arr.push(r);
    }
    return arr;
}

const shuffleArray = (array) => {
    // Durstenfeld shuffle algorithm
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export { replaceChar, probability, sampleInt, shuffleArray };