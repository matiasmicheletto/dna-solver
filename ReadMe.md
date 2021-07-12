# DNA-Solver

<p align="">
    <img src="https://img.shields.io/github/license/matiasmicheletto/dna-solver">
    <img src="https://img.shields.io/github/package-json/v/matiasmicheletto/dna-solver">
    <img src="https://img.shields.io/website?down_color=red&down_message=offline&style=plastic&up_color=green&up_message=online&url=https%3A%2F%2Fdna-solver.herokuapp.com">
</p>

A [Node.js module](optimization) and a [React.js GUI](client) that allows to create and test Genetic Algorithms experiments with focus on hyperparametric optimization for solving the most common problems present in the combinatorial optimization literature.

This project was developed under the context of the final work for the posgraduate course *"Advanced Techniques for Evolutionary Computation"*  by [Dr. Ignacio Ponzoni](https://cs.uns.edu.ar/~ip/) at [DCIC](https://cs.uns.edu.ar/~devcs/) (UNS).  


## Installation

Try the latest version [here](https://dna-solver.herokuapp.com/) or use this application locally running the following commands ([Node.js](https://nodejs.org/es/) already installed is required):  

```bash
$ git clone https://github.com/matiasmicheletto/dna-solver.git
$ cd dna-solver
$ npm install
$ npm run build
$ npm run start
```

If you need to use just the optimization module via scripting (without GUI), checkout the [examples](examples) folder and run the scripts installing the optimization package only (and cli-progress for this example, but not necessary), using the following commands:  

```bash
$ git clone https://github.com/matiasmicheletto/dna-solver.git
$ cd dna-solver
$ npm install cli-progress ./optimization
$ node examples/tsp/example_tsp_selection.mjs
```

## Getting started

This library provides a class to model any objective function with an interface to be optimized using Genetic Algorithms. Five class examples are provided to show how to extend this class in order to model common combinatorial optimization problems. The Ga class implements a Genetic Algorithm optimizer with many configuration options. Finally, the Experiment class allows to create and run different experiments to test the behaviour of GA optimizers when configuring different hyperparameters.

![uml](doc/class_diagram.png)

To create a new Fitness model, extend the [prototype class](optimization/fitness/index.mjs), for example:

```js
export default class MyNewFitness extends Fitness {
    constructor(param1 = 1, param2 = 3) {
        // First we need to call the constructor of the parent class,
        // and pass the attributes or parameters:
        super({
          _param1: param1, 
          _param2: param2, 
          _name:"My new fitness model"
        });
        // Then we can use this._param1 or this._param2 as we need.
    }

    objective(x) {
        // This example just implements a simple linear function:
        return x * this._param1 + this._param2;
    }

    decode(g) {
      // Suppose we're using 16 bit BCD to decimal conversion.
      return parseInt(g.join("").slice(-16), 2);
    }
  
    objective_str(g) {
        // This function shows the result of evaluating the objective function
        // as a human-readable string.
        return "F("+g+")="+this.objective(this.decode(g));
    }

    eval(g) {
        // This is the fitness function. This function should return a numeric scalar
        // value that represents the solution's quality.
        return this.objective(this.decode(g));
    }

    rand_encoded() { 
        // As we're using binary strings, then the random solution generator will
        // return a random binary array with 16 bit length length:
        return new Array(16).fill(0).map(() => Math.round(Math.random()));
    }

    get ga_config() {
        // Lets say you don't want the user to know how to properly configure
        // the GA method to use your fitness model, so we can facilitate a
        // default configuration:
        return {
            pop_size: 50
            mut_prob: 0.01,
            cross_prob: 0.1,
            selection: selection.TOURNAMENT, // Remember to import "selection" from "ga"
            mutation: mutation.BITFLIP, // Remember to import "mutation" from "ga"
            tourn_k: 4 // As we're using tournament, we set the tournament size to 4
        };
    }
}
```

And thats it, now we can make our first experiment to see how does this behave (spoiler: will behave pretty bad, as its just a linear function):

```js
import Experiment from 'optimization/experiment/index.mjs';
import MyNewFitness from 'mynewfitness.mjs'

const experiment = new Experiment(); // Create the experiment manager
const f_id = experiment.add_fitness(MyNewFitness, [2, 8]); // Add our fitness with some parameters
experiment.add_ga(f_id); // Attach an optimizer to our fitness

// Run the experiment!
experiment.run({
  rounds:100, 
  iters:25, 
  progressCallback:p => process.stdout.write("Progress = "+p+"% \n")
});

// Ptint results:
process.stdout.write(experiment.getPlainResults());
```


## Using the GUI

A [React.js](https://reactjs.org/) and [Bootstrap](https://react-bootstrap.github.io/) GUI allows to build experiments graphically. There are two components that depend on the Fitness models, ["FitnessConfig"](client/src/components/fitnessconfig) and ["SolutionViewer"](client/src/components/solutionviewer). If not appropiate components are provided to configurate the model, then the FitnessConfig section will be displayed as a blank or empty space, and the SolutionViewer will show the solution vectors as dash-separated-element strings. Some ReactJS knowledge is required to code and include the components for a new Fitness model, but the ones provided will be helpful to understand the idea.

![uml](doc/components.png)

---

Author: [Matías Micheletto](matiasmicheletto.github.io) - [matias.micheletto@uns.edu.ar](mailto:matias.micheletto@uns.edu.ar)  
ICIC - CONICET - UNS  
License: GPL-3.0

---

## Backlog

Module development (93%).  
- [ ] Fitness function module (100%). 
    - [x] Parabola.  
    - [x] Subset sum problem.  
    - [x] N-Queens problem.  
    - [x] TSP Problem.  
- [ ] Optimizer module (85%).  
    - [x] Fitness model configuratinon.  
    - [x] Population size and elitism configuration.  
    - [x] Configuration of selection operators.  
    - [x] Configuration of crossover operators.  
    - [x] Configuration of mutation operators.  
    - [x] Termination criteria (fixed to generations number).  
    - [ ] Parameter control (deterministic and adaptive).  
- [x] Experiment manager module (100%).  
    - [x] Fitness modules lists management.  
    - [x] Optimizers list management.  
    - [x] Optimizers duplication.  
    - [x] Fitness and optimizers configuration.  
    - [x] Experiment execution.  
    - [x] Result summarization.  
- [x] Command line optimization example scripts (100%).  
    - [x] Example 1: Simple TSP. Experiment configuration.  
    - [x] Example 2: NQueens. Multiple fitness experiment.  
    - [x] Example 3: Complex TSP. Parameter tunning.  
- [x] Export results as plain text file (100%).  
- [x] Generate NodeJS module (100%).  

GUI development (94%)  
- [x] Graphical experiment configuration (100%).  
  - [x] Add and remove fitness models.  
  - [x] Add and remove optimizers.  
- [x] Graphical fitness model configuration (100%).  
  - [x] Problem description.  
  - [x] Parameter configuration.  
- [ ] Graphical optimizer configuration (66%).  
  - [x] Static parameters configuration.  
  - [x] Name edition.  
  - [ ] Adaptive/static parameter configuration.  
- [x] Graphical experiment control (100%).  
  - [x] Run and reset buttons.  
  - [x] Iterations and rounds configuration.  
  - [x] Timeout configuration.   
- [x] Graphical experiment output (100%).  
  - [x] Experiment results summary.  
  - [x] Solution evolution history.  
  - [x] Optimizers comparative bar plot.  
- [x] Solution candidate visualization (100%).  
  - [x] Quadratic function plot.  
  - [x] Chess board for N-Queens.  
  - [x] TSP destinations map.  
