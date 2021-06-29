import cliProgress from 'cli-progress';
import Experiment from '../client/src/experiment/index.mjs';
import { crossover, mutation } from '../client/src/ga/index.mjs';

// In this second example, we are solving the N-Queens problem for the case N = 16. The NQueens 
// fitness model only takes a simple argument, which is N, the size of the squared chess board.
// In this analysis, we are testing the crossover operator to see how it affects the behaviour
// of the evolutionary process.
// The fitness function encodes the solutions as arrays where each element value corresponds to
// the row number that is occupied by a queen on the given column that belongs the array element.
// So, repeated elements is allowed, and solutions with repeated elements may be produced when
// using single point and double point crossover, but not with PMX operator, as the default 
// initialization generates non repeated elements in the population. When using PMX operator, 
// it is important that the mutation operator does not produce repeated elements.
// Lets see how this reflect in the solutions quality obtained in the following experiment

///////// Solution //////////

// Build the experiment manager and add the NQueens fitness model
const experiment = new Experiment();
const f_id = experiment.add_fitness(Experiment.fitness_types.NQUEENS); 

// Set the N value for the problem to 16
experiment.set_fitness_config(f_id, {N: 16});

// Now we initialize the optimizaers with some default configuration
const ga_ids = [];
for(let i = 0; i < 3; i++){
    ga_ids.push(experiment.add_ga(f_id));
    experiment.set_ga_config(ga_ids[i], {elitism: 3, pop_size: 30});
}

// Then, we configure the different crossover operators for each one, and modifying
// their names at the same time:
experiment.set_ga_config(ga_ids[0], {crossover: crossover.SINGLE, name: "Single point crossover"});
experiment.set_ga_config(ga_ids[1], {crossover: crossover.DOUBLE, name: "Double point crossover"});

// In order to avoid repeated elements after mutation, PMX crossover should be used with 
// the SWAP mutation operator, so we configure this as follows:
experiment.set_ga_config(ga_ids[2], {crossover: crossover.PMX, mutation: mutation.SWAP, name: "PMX operator crossover"});
// Using PMX operator with RAND or BITFLIP mutation operators, may freeze the algorithm
// as the PMX function will never find a result with non repeating elements.


///////// Run the optimization analysis //////////

// To test the optimizers performance, we are running 50 rounds of 500 generations each
const rounds = 50;
const iters = 500;

// Progress bar and info
process.stdout.write(`Running ${rounds} rounds of ${iters} iterations...\n`);
const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);



// Lets run the experiment
progressBar.start(100, 0); 
experiment.run({rounds:rounds, iters:iters, progressCallback:p => progressBar.update(p)});
progressBar.stop(); 

// Finally, we print the results
process.stdout.write(experiment.getPlainResults());
