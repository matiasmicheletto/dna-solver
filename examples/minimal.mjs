import Ga from 'optimization/ga/index.mjs';
import NQueens from 'optimization/fitness/nqueens.mjs';

const f = new NQueens();
const ga = new Ga(f);

for(let gen = 0; gen < 500; gen++)
    ga.evolve();    

const solution = ga.population[0];

process.stdout.write("Queens row placement per column: "+solution.genotype+"\n");
process.stdout.write("Objective value: "+solution.objective+"\n");
