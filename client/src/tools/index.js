const replaceChar = function(str, ind, rep) { // Change gen of chromosome
    return str.substring(0, ind) + rep + str.substring(ind + 1);
}

const probability = (p) => { // Returns true with probability p
    return Math.random() < p;
}

const sample_int = (len, range) => {     
    var arr = [];
    while(arr.length < len){
        var r = Math.floor(Math.random() * range);
        if(arr.indexOf(r) === -1) arr.push(r);
    }
    return arr;
}

export { replaceChar, probability, sample_int };