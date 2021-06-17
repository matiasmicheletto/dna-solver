# SGA-Node

<p align="">
    <img src="https://img.shields.io/github/license/matiasmicheletto/sganode">
    <img src="https://img.shields.io/github/package-json/v/matiasmicheletto/sganode">
    <img src="https://img.shields.io/website?down_color=red&down_message=offline&style=plastic&up_color=green&up_message=online&url=https%3A%2F%2Fsganode.herokuapp.com">
</p>

A simple Node.js based application for creating and testing evolutionary algorithms experiments.  

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

If you wish to use only the optimization module via scripting (without GUI), checkout the [examples](examples) folder and run them installing a minimal Node.js number of packages, using the following commands:  

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

Module development (80%).  
- [x] Fitness function module.  
- [x] Optimizer module.  
- [x] Experiment manager module.  
- [x] Command line optimization example scripts.  
- [ ] Add flexibility to fitness modules extension.  

GUI development (50%)  
- [x] Graphical experiment configuration.  
  - [x] Add and remove fitness models.  
  - [x] Add and remove optimizers.  
- [ ] Graphical fitness model configuration.  
  - [ ] Problem description.  
  - [ ] Parameter configuration.  
- [ ] Graphical optimizer configuration.  
  - [x] Static parameters configuration.  
  - [x] Name edition.  
  - [ ] Paramenter control configuration.  
- [x] Graphical experiment control. 
  - [x] Run and reset buttons.  
  - [ ] Progress bar.  
  - [x] Iterations and rounds configuration.  
  - [ ] Termination criteria.  
  - [ ] Timeout configuration.   
- [x] Graphical experiment output.  
  - [x] Experiment results summary.  
  - [x] Solution evolution history.  
  - [x] Optimizers comparative bar plot.  
- [ ] Solution visualization.  
  - [ ] Monovariate functions plot.  
  - [ ] Chess board for N-Queens.  
  - [ ] TSP destinations map.  
