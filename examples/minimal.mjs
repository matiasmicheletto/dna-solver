import Ga from 'optimization/ga/index.mjs';
import NQueens from 'optimization/fitness/nqueens.mjs';

const f = new NQueens();
const ga = new Ga(f);

for(let gen = 0; gen < 100; gen++)
    ga.evolve();    

const solution = ga.population[0];

console.log(solution);