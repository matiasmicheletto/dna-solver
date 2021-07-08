import cliProgress from 'cli-progress';
import Experiment from 'optimization/experiment/index.mjs';
import { selection } from 'optimization/ga/index.mjs';
import { distance } from 'optimization/fitness/tsp.mjs';
import fs from 'fs';


// In this example we are solving the Symmetric Travelling Salesperson Problem (TSP),
// considering the following set of destinations:
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

// Build the experiment manager to manage the optimization process and the result compiling
const experiment = new Experiment();

// We create a new fitness model of the TSP problem and add it to the manager.
// In case of needed, we could add different fitness models with different configurations,
// for example, if we want to test a single optimizer when solving similar problems
// with different complexity.
const f_id = experiment.add_fitness(Experiment.fitness_types.TSP); // This returns an identifier for this fitness

// We need to configure the TSP problem by defining the destination array and
// also, we can tell the fitness model to use the MANHATTAN distance equation:
experiment.set_fitness_config(f_id, {places: places, distance: distance.MANHATTAN});

// Now we add three optimizers for the current fitness model. We're storing them ids
// in an array. The initialization of the optimizers will display them names and ids.
// The optimizers should always be initialized with a reference to the fitness function
// so that why we pass the fitness id (f_id) to the experiment manager.
const ga_ids = [];
for(let i = 0; i < 3; i++)
    ga_ids.push(experiment.add_ga(f_id));


// The optimizers are identical for now, so lets configure them with different
// parameters, as we would like to know which one performs better.
// By default, the TSP fitness model will configure the mutation operator
// as SWAP and the crossover operator as PMX. 
// Lets set the population size to 15 (default is 20) and the elitism number 
// to 3 for each optimizer (default is 2)
for(let i in ga_ids)
    experiment.set_ga_config(ga_ids[i], {elitism: 3, pop_size: 15});    

// Now suppose we want to compare the performance of each optimizer when using
// different selection methods. So lets configure the three different operators
// for each optimizer. 
experiment.set_ga_config(ga_ids[0], {selection: selection.ROULETTE});
experiment.set_ga_config(ga_ids[1], {selection: selection.RANK});
experiment.set_ga_config(ga_ids[2], {selection: selection.TOURNAMENT});
// Other parameters can be configured the same way, for example crossover and mutation
// probability (cross_prob and mut_prob) and even rank r value (rank_r) or tournament k 
// value (tourn_k), which are specific for each selection methods.

// In order to identify which result corresponds to each optimizer, we can
// modify their default names according to the configuration we selected 
// before, so we set the following names:
experiment.set_ga_config(ga_ids[0], {name: "Roulette selection method"});
experiment.set_ga_config(ga_ids[1], {name: "Ranking selection method (r=0.002)"});
experiment.set_ga_config(ga_ids[2], {name: "Tournament selection method (k=3)"});




///////// Run the optimization analysis //////////

// To test the optimizers performance, we are running 20 rounds of 50 generations each
const rounds = 20;
const iters = 50;

// Show some information before starting...
process.stdout.write(`Running ${rounds} rounds of ${iters} iterations...\n`);
// A progress bar is used to visualize the progress (useful in case of heavy problems)
const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);


// Lets run the optimization analysis, updating the progress bar after the
// completion of every round.
progressBar.start(100, 0); // Initialize the progress bar
experiment.run({
    rounds:rounds, 
    iters:iters, 
    progressCallback:p => progressBar.update(p)
});
progressBar.stop(); // Stopping the progress bar allows us to print more data

// The results are returned as an object with two parts, the results by round
// and a more general result for each optimizer. To get the complete results 
// we can use the "results" getter of the experiment, which allows us
// to present a detailed information of the analysis results.
// In this case, we're just showing some basic and plain text ouput, so we
// use the getPlainResults() method that returns a string with the summarized
// results for each optimizer:
const results = experiment.getPlainResults();
process.stdout.write(results);

// If we need to export the results to analyze using other software, then
// the writeFile() function can be used:
const filename = 'example_1_results.txt';
fs.writeFile(filename, results, () => process.stdout.write("Results saved as "+filename+"\n"));