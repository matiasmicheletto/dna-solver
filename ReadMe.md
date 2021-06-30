# SGA-Node

<p align="">
    <img src="https://img.shields.io/github/license/matiasmicheletto/sganode">
    <img src="https://img.shields.io/github/package-json/v/matiasmicheletto/sganode">
    <img src="https://img.shields.io/website?down_color=red&down_message=offline&style=plastic&up_color=green&up_message=online&url=https%3A%2F%2Fsganode.herokuapp.com">
</p>

A [Node.js module](optimization) and a [React.js GUI](client) that allows to create and test evolutionary algorithms experiments with focus on hyperparametric optimization for specific optimization problems.

This project was developed under the context of the final work for the posgraduate course *"Advanced Techniques for Evolutionary Computation"*  by [Dr. Ignacio Ponzoni](https://cs.uns.edu.ar/~ip/) at [DCIC](https://cs.uns.edu.ar/~devcs/) (UNS).  

---

Try the latest version [here](http://sganode.herokuapp.com/) or use this application locally running the following commands ([Node.js](https://nodejs.org/es/) already installed is required):  

```bash
$ git clone https://github.com/matiasmicheletto/sganode.git
$ cd sganode
$ npm install
$ npm run build
$ npm run start
```

If you need to use just the optimization module via scripting (without GUI), checkout the [examples](examples) folder and run the scripts installing a few packages, using the following commands:  

```bash
$ git clone https://github.com/matiasmicheletto/sganode.git
$ cd sganode
$ npm install cli-progress ./optimization
$ node examples/example_1_tsp_simple.mjs
```

Author: [Matías Micheletto](https://matiasmicheletto.github.io)  
Email: [matias.micheletto@uns.edu.ar](mailto:matias.micheletto@uns.edu.ar)  

---

## Backlog

Module development (74%).  
- [ ] Fitness function module (75%). 
    - [x] Parabola.  
    - [x] N-Queens problem.  
    - [ ] Subset sum problem.  
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
    - [x] Fitness and optimizers configuration.  
    - [x] Experiment execution.  
    - [x] Result summarization.  
- [x] Command line optimization example scripts (100%).  
    - [x] Example 1: Simple TSP. Experiment configuration.  
    - [x] Example 2: NQueens. Multiple fitness experiment.  
    - [x] Example 3: Complex TSP. Parameter tunning.  
- [x] Export results as plain text file (100%).  
- [ ] Generate NodeJS module (0%).  

GUI development (90%)  
- [x] Graphical experiment configuration (100%).  
  - [x] Add and remove fitness models.  
  - [x] Add and remove optimizers.  
- [x] Graphical fitness model configuration (100%).  
  - [x] Problem description.  
  - [x] Parameter configuration.  
- [ ] Graphical optimizer configuration (66%).  
  - [x] Static parameters configuration.  
  - [x] Name edition.  
  - [ ] Paramenter control configuration.  
- [ ] Graphical experiment control (75%).  
  - [x] Run and reset buttons.  
  - [x] Iterations and rounds configuration.  
  - [ ] Termination criteria.  
  - [x] Timeout configuration.   
- [x] Graphical experiment output (100%).  
  - [x] Experiment results summary.  
  - [x] Solution evolution history.  
  - [x] Optimizers comparative bar plot.  
- [x] Solution candidate visualization (100%).  
  - [x] Quadratic function plot.  
  - [x] Chess board for N-Queens.  
  - [x] TSP destinations map.  
