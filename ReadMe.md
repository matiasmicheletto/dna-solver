# SGA-Node

<p align="">
    <img src="https://img.shields.io/github/license/matiasmicheletto/sganode">
    <img src="https://img.shields.io/github/package-json/v/matiasmicheletto/sganode">
    <img src="https://img.shields.io/website?down_color=red&down_message=offline&style=plastic&up_color=green&up_message=online&url=https%3A%2F%2Fsganode.herokuapp.com">
</p>

A Node.js module and a React.js GUI that allows to create and test evolutionary algorithms experiments with focus on hyperparametric optimization for specific optimization problems.

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
$ npm install cli-progress
$ node examples/example_1_tsp_simple.mjs
```

Author: [Matías Micheletto](https://matiasmicheletto.github.io)  
Email: [matias.micheletto@uns.edu.ar](mailto:matias.micheletto@uns.edu.ar)  

---

## Backlog

Module development (100%).  
- [x] Fitness function module.  
- [x] Optimizer module.  
- [x] Experiment manager module.  
- [x] Command line optimization example scripts.  
- [x] Export results as csv file.  
- [x] Add flexibility to fitness modules extension.  

GUI development (66%)  
- [x] Graphical experiment configuration.  
  - [x] Add and remove fitness models.  
  - [x] Add and remove optimizers.  
- [x] Graphical fitness model configuration.  
  - [x] Problem description.  
  - [x] Parameter configuration.  
- [ ] Graphical optimizer configuration.  
  - [x] Static parameters configuration.  
  - [x] Name edition.  
  - [ ] Paramenter control configuration.  
- [ ] Graphical experiment control.  
  - [x] Run and reset buttons.  
  - [x] Iterations and rounds configuration.  
  - [ ] Termination criteria.  
  - [ ] Timeout configuration.   
- [x] Graphical experiment output.  
  - [x] Experiment results summary.  
  - [x] Solution evolution history.  
  - [x] Optimizers comparative bar plot.  
- [x] Solution candidate visualization.  
  - [x] Quadratic function plot.  
  - [x] Chess board for N-Queens.  
  - [x] TSP destinations map.  
