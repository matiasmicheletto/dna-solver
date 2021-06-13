import fs from 'fs';

export const symmetric_tsp_parser = async (f, s, e) => {
    return new Promise((fulfill, reject) => {
        let coords = [];
        fs.readFile(f, 'utf8', (err, data) => {
            if (err){ 
                console.log(err);
                reject(err);
            }else{
                const lines = data.split('\n');
                for(let l = s-1; l < e; l++){
                    const cols = lines[l].split(' ');
                    coords.push([cols[1], cols[2]]);
                }
            }
            fulfill(coords);
        });
    });
};
