import cliProgress from 'cli-progress';
import OptManager, { fitness_types } from '../client/src/manager/index.mjs';
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

// Build the manager and add the NQueens fitness model
const om = new OptManager();
const f_id = om.add_fitness(fitness_types.NQUEENS); 

// Set the N value for the problem to 16
om.set_fitness_config(f_id, {N: 16});

// Now we initialize the optimizaers with some default configuration
const ga_ids = [];
for(let i = 0; i < 3; i++){
    ga_ids.push(om.add_ga(f_id));
    om.set_ga_config(ga_ids[i], {elitism: 3, pop_size: 30});
}

// Finally we configure the different crossover operators for each one:
om.set_ga_config(ga_ids[0], {crossover: crossover.SINGLE});
om.set_ga_config(ga_ids[1], {crossover: crossover.DOUBLE});
om.set_ga_config(ga_ids[2], {crossover: crossover.PMX});

// In order to avoid repeated elements after mutation, PMX crossover should be used with 
// the SWAP mutation operator, so we configure this as follows:
om.set_ga_config(ga_ids[2], {mutation: mutation.SWAP});
// Using PMX operator with RAND or BITFLIP mutation operators, may freeze the algorithm
// as the PMX function will never find a result with no repeated elements.


///////// Run the optimization analysis //////////

// To test the optimizers performance, we are running 10 rounds of 500 generations each
const rounds = 10;
const iters = 500;

// Progress bar and info
process.stdout.write(`Running ${rounds} rounds of ${iters} iterations...\n`);
const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);



// Lets run the experiment
progressBar.start(100, 0); 
om.optimize(rounds, iters, p => progressBar.update(p));
progressBar.stop(); 

// Finally, we print the results
const config = {};
config[ga_ids[0]] = "Single point crossover";
config[ga_ids[1]] = "Double point crossover";
config[ga_ids[2]] = "PMX operator crossover";
process.stdout.write(om.getPlainResults(config));
