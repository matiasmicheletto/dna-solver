import cliProgress from 'cli-progress';
import Experiment from 'optimization/experiment/index.mjs';
import SubsetSum from 'optimization/fitness/subsetsum.mjs';
import { selection } from 'optimization/ga/index.mjs';

// In this example, we are evaluating the impact of the population number in
// the optimization performance when solving the subset sum problem.
// Lets consider the following set, and we want to find the minimum size
// subset which sum equals to 0.

const set = [-96, -91, -87, -84, -82, -75, -71, -27, 12, 30, 46, 53, 73, 79, 80, 88, 90, 94, 94, 95];


///////// Solution //////////

// Build the experiment manager and add the Subset sum fitness model with the given set
const experiment = new Experiment();
const f_id = experiment.add_fitness(SubsetSum, [set, 0]); 

// Now we initialize five optimizers with an increasing number of population.
// We are using the tournament selection operator with k = 3 (default).
experiment.add_ga(f_id, {selection: selection.TOURNAMENT, pop_size: 10, name: "Pop. size = 10"});
experiment.add_ga(f_id, {selection: selection.TOURNAMENT, pop_size: 20, name: "Pop. size = 20"});
experiment.add_ga(f_id, {selection: selection.TOURNAMENT, pop_size: 30, name: "Pop. size = 30"});
experiment.add_ga(f_id, {selection: selection.TOURNAMENT, pop_size: 40, name: "Pop. size = 40"});
experiment.add_ga(f_id, {selection: selection.TOURNAMENT, pop_size: 50, name: "Pop. size = 50"});


///////// Run the optimization analysis //////////

// To test the optimizers performance, we are running 50 rounds of 1000 generations each
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
