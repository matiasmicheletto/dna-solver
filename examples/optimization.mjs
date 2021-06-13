import OptManager, { fitness_types } from '../client/src/manager/index.mjs';
import { distance } from '../client/src/fitness/tsp.mjs';
import { selection } from '../client/src/ga/index.mjs';
import cliProgress from 'cli-progress';

// In this example we are solving the Symetric Travelling Salesperson Problem (TSP)
// for the following destinations:
const places = [ 
    [-40, 55],
    [42, -58],
    [48, 66],
    [-36, -54],
    [50, 58],
    [-32, 12],
    [-49, 64],
    [48, -59],
    [29, -62],
    [10, 45]
];

///////// Solution //////////

// Build the manager to manage the optimization process and the result compiling
const om = new OptManager();

// We create a new fitness model of the TSP problem and add it to the manager.
// In case of needed, we could add different fitness models with different configurations,
// for example, if we want to test a single optimizer when solving similar problems
// with different complexity.
const f_id = om.add_fitness(fitness_types.TSP); // This returns an identifier for this fitness

// We need to configure the TSP problem by defining the destination array
om.set_fitness_config(f_id, "places", places);

// Then, we can tell the fitness model to use the Manhattan distance equation:
om.set_fitness_config(f_id, "distance", distance.MANHATTAN);

// Now we add three optimizers for the current fitness model. We're storing them ids
// in an array. The initialization of the optimizers will display them names and ids.
// The optimizers should always be initialized with a reference to the fitness function
// so that why we pass the fitness id (f_id) to the optimization manager.
const ga_ids = [];
for(let i = 0; i < 3; i++)
    ga_ids.push(om.add_ga(f_id));


// The optimizers are identical for now, so lets configure them with different
// parameters, as we would like to know which one performs better.
// By default, the TSP fitness model will configure the mutation operator
// as SWAP and the crossover operator as PMX. 
// Lets set the population size to 15 (default is 20) and the elitism number 
// to 3 for each optimizer (default is 2)
for(let i in ga_ids){
    const id = ga_ids[i];
    om.set_ga_config(id, "elitism", 3);
    om.set_ga_config(id, "pop_size", 15);
}

// Now suppose we want to compare the performance of each optimizer when using
// different selection methods. So lets configure the three different operators
// for each optimizer. 
om.set_ga_config(ga_ids[0], "selection", selection.ROULETTE);
om.set_ga_config(ga_ids[1], "selection", selection.RANK);
om.set_ga_config(ga_ids[2], "selection", selection.TOURNAMENT);
// Other parameters can be configured the same way, for example crossover and mutation
// probability (cross_prob and mut_prob), mutation proportion (mut_fr) and even
// rank r value (rank_r) or tournament k value (tourn_k), which are specific for
// each selection methods.



///////// Run the optimization analysis //////////

// To test the optimizers performance, we are running 10 rounds of 100 generations each
const rounds = 25;
const iters = 50;

// A progress bar is used to visualize the progress (useful in case of heavy problems)
const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
// Show some information before starting...
process.stdout.write(`Running ${rounds} rounds of ${iters} iterations...`);
progressBar.start(100, 0); // Initialize the progress bar


// Lets run the optimization analysis and updating the progress bar after the
// completion of every round
om.optimize(rounds, iters, p => progressBar.update(p));
progressBar.stop(); // Stop the progress bar after finnishing

// The results are returned as an object with two parts, the results by round
// and a more general result for each optimizer. To get the complete results 
// we can use the "results" getter of the Optimization Manager, which allows
// to present a detailed information of the analysis results.
// In this case, we're just showing some basic and plain text results, so we
// use the getPlainResults() method that returns a string with the summarized
// results for each optimizer.
// In order to identify which result corresponds to each optimizer, we can
// add extra optional information according to the configuration we selected 
// before, so we define the following object first:
const config = {};
config[ga_ids[0]] = "Roulette selection method";
config[ga_ids[1]] = "Ranking selection method (r=0.002)";
config[ga_ids[2]] = "Tournament selection method (k=3)";

// Finally, we pass this object to the getPlainResults() method to get our
// analysis result:
process.stdout.write(om.getPlainResults(config));