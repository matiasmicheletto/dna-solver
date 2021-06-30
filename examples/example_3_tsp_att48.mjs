import cliProgress from 'cli-progress';
import { readFile } from 'fs/promises';
import Experiment from 'optimization/experiment/index.mjs';
import { selection } from 'optimization/ga/index.mjs';
import { distance } from 'optimization/fitness/tsp.mjs';


// In this example we are solving the Symmetric Travelling Salesperson Problem (TSP),
// in particular, the att48 instance provided by the TSPLIB95 dataset
// (see http://comopt.ifi.uni-heidelberg.de/software/TSPLIB95/).
// Datasets should be converted to json format, to ease the parsing. Then the file is 
// imported using:
const filename = './json/att48.json';
const data = await readFile(new URL(filename, import.meta.url)); // Data is encoded as string
const instance = JSON.parse(data); // Convert to object

// And we can use the required configuration which is provided by this file:
const places = instance.coords; // Coordinates of destinations
const dist = distance[instance.distance]; // Distance function to calculate the weight matrix


///////// Solution //////////

// Build the experiment manager to manage the optimization process and the result compiling
const experiment = new Experiment();

// We create a new fitness model of the TSP problem and add it to the experiment.
const f_id = experiment.add_fitness(Experiment.fitness_types.TSP);

// The problem configuration is setted up from the data we parsed before:
experiment.set_fitness_config(f_id, {places:places, distance:dist});

// This time we're testing the crossover and mutation probability parameters, so we add
// two optimizers with 30 individuals and rank selection method:
const ga_ids = [experiment.add_ga(f_id), experiment.add_ga(f_id)];
for(let i in ga_ids)
    experiment.set_ga_config(ga_ids[i], {selection:selection.RANK, pop_size:30});

// Then we configure the desired probability parameters and change the optimizers names:
experiment.set_ga_config(ga_ids[0], {mut_prob:0.001, cross_prob:0.8, name: "Cross. prob.= 0.8, mut. prob.= 0.001"});
experiment.set_ga_config(ga_ids[1], {mut_prob:0.002, cross_prob:0.5, name: "Cross. prob.= 0.5, mut. prob.= 0.002"});


///////// Run the optimization analysis //////////

// To test the optimizers performance, we are running 10 rounds of 1000 generations each
const rounds = 10;
const iters = 1000;

// Show some information before starting...
process.stdout.write(`Running ${rounds} rounds of ${iters} iterations...\n`);
// A progress bar is used to visualize the progress (useful in case of heavy problems)
const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

// Now, we run the optimization:
progressBar.start(100, 0);
experiment.run({
    rounds:rounds, 
    iters:iters, 
    progressCallback:p => progressBar.update(p)
});
progressBar.stop();

// Finally, print the results:
process.stdout.write(experiment.getPlainResults());
