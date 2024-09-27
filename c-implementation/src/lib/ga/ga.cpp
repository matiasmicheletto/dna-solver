#include "ga.h"

GeneticAlgorithm::GeneticAlgorithm() { 
    // Initialize with default configuration
    config = GAConfig();
    // Cannot initialize population without a fitness function
}

GeneticAlgorithm::GeneticAlgorithm(Fitness *fitnessFunction, GAConfig config) {
    // Initialize with a fitness function and configuration
    config.fitnessFunction = fitnessFunction;
    this->config = config;
    initPopulation();
}

GeneticAlgorithm::~GeneticAlgorithm() {
    if(config.fitnessFunction != nullptr)
        delete config.fitnessFunction;
    clearPopulation();
}

void GeneticAlgorithm::setConfig(GAConfig config) {
    // Update the configuration
    this->config = config;
    
    if(config.fitnessFunction == nullptr)
        std::cerr << "Warning: configuration updated without fitness function" << std::endl;

    initPopulation();
}

void GeneticAlgorithm::setConfig(int argc, char **argv) {
    // Update the configuration with the command line arguments
    // Cannot update the fitness function here
    for (int i = 1; i < argc; i++) {
        if (strcmp(argv[i], "-p") == 0) {
            config.populationSize = atoi(argv[i + 1]);
        } else if (strcmp(argv[i], "-g") == 0) {
            config.maxGenerations = atoi(argv[i + 1]);
        } else if (strcmp(argv[i], "-m") == 0) {
            config.mutationRate = atof(argv[i + 1]);
        } else if (strcmp(argv[i], "-c") == 0) {
            config.crossoverRate = atof(argv[i + 1]);
        } else if (strcmp(argv[i], "-e") == 0) {
            config.elitismRate = atof(argv[i + 1]);
        } else if (strcmp(argv[i], "-t") == 0) {
            config.timeout = atoi(argv[i + 1]);
        } else if (strcmp(argv[i], "-s") == 0) {
            config.stagnationThreshold = atof(argv[i + 1]);
        } else if (strcmp(argv[i], "-l") == 0) {
            config.printLevel = atoi(argv[i + 1]);
        }
    }

    if(config.fitnessFunction == nullptr)
        std::cerr << "Warning: configuration updated without fitness function" << std::endl;

    initPopulation();
}

void GeneticAlgorithm::setFitnessFunction(Fitness *fitnessFunction) {
    config.fitnessFunction = fitnessFunction;
    initPopulation();
}

void GeneticAlgorithm::sortPopulation() {
    std::sort(population.begin(), population.end(), [](Chromosome* a, Chromosome* b) {
        return a->fitness > b->fitness; // Sort in descending order
    });
}

void GeneticAlgorithm::initPopulation(){
    if(config.fitnessFunction == nullptr){
        std::cerr << "Fitness function not set" << std::endl;
        return;
    }
    clearPopulation();
    for (unsigned int i = 0; i < config.populationSize; i++) {
        Chromosome *ch = config.fitnessFunction->generateChromosome();
        population.push_back(ch);
    }
    sortPopulation(); // Sort the population by fitness best to worse
}

void GeneticAlgorithm::clearPopulation() {
    population.clear();
}

void GeneticAlgorithm::evaluation() {
    for (unsigned int i = 0; i < config.populationSize; i++) {
        population[i]->fitness = config.fitnessFunction->evaluate(population[i]);
    }
}

void GeneticAlgorithm::selection() { // Roulette wheel selection
    
    // Keep the best chromosomes
    unsigned int elitism = config.elitismRate * config.populationSize;
    std::vector<Chromosome*> new_population;
    for (unsigned int i = 0; i < elitism; i++) {
        new_population.push_back(population[i]);
    }

    // Selection requires the fitness values to be positive
    // Calculate the sum of the shifted fitness values
    double minFitness = population[population.size() - 1]->fitness;
    double offset = std::abs(minFitness);
    double adjustedFitness[config.populationSize];
    double fitnessSum = 0.0;
    for (unsigned int i = 0; i < config.populationSize; i++) {
        adjustedFitness[i] = population[i]->fitness + offset + 1.0;
        fitnessSum += adjustedFitness[i];
    }

    // Select the best individuals between the rest of the population
    //for (unsigned int i = elitism; i < config.populationSize; i++) {
    unsigned int tries = 0;
    while(new_population.size() < config.populationSize){
        const double r = uniform.random(fitnessSum); //RANDOM
        //const double r = u_random(fitnessSum);
        double sum = 0.0;
        for (unsigned int j = elitism; j < config.populationSize; j++) {
            sum += adjustedFitness[j];
            if (sum >= r) {
                // Create new crhomosome (already evaluated)
                Chromosome *ch = config.fitnessFunction->generateChromosome();
                ch->clone(*population[j]);
                new_population.push_back(ch);
                break;
            }
        }
        tries++;
        if(tries > 1000){
            std::cerr << "Selection error" << std::endl;
            exit(1);
        }
    }

    population = new_population;    
}

void GeneticAlgorithm::crossover() {
    for (unsigned int i = 0; i < config.populationSize; i++) {
        if (uniform.random() < config.crossoverRate) { // RANDOM
            unsigned int parent1 = uniform.random(config.populationSize); //RANDOM
            population[i]->crossover(population[parent1]);
        }
    }
}

void GeneticAlgorithm::mutation() {
    for (unsigned int i = 0; i < config.populationSize; i++) {
        if (uniform.random() < config.mutationRate) { // RANDOM
        //if (u_random() < config.mutationRate) {
            population[i]->mutate();
        }
    }
}

void GeneticAlgorithm::print() {
    
    if(config.printLevel < 0 || config.printLevel > 3){
        std::cerr << "Invalid print level" << std::endl;
        return;
    }

    if(config.printLevel >= 0)
        config.print();

    if(config.printLevel >= 1){
        if(population.size() == 0){
            std::cout << "Population not initialized" << std::endl;
            return;
        }else{
            std::cout << "Best fitness: " << population[0]->fitness << std::endl;
            std::cout << "Best chromosome:" << std::endl;
            std::cout << "  - ";
            population[0]->printGenotype();
            std::cout << "  - ";
            population[0]->printPhenotype();
            std::cout << std::endl;
        }
    }
    if(config.printLevel >= 2){
        std::cout << "Population fitness: " << std::endl;
        for (unsigned int i = 0; i < config.populationSize; i++) {
            std::cout << "Chromosome " << i << ": " << population[i]->fitness << std::endl;
        }
    }
    if(config.printLevel >= 3){
        std::cout << "Population genes: " << std::endl;
        for (unsigned int i = 0; i < config.populationSize; i++) {
            population[i]->printGenotype();
            population[i]->printPhenotype();
        }
    }
}


GAResults GeneticAlgorithm::run() {
    
    GAResults results;

    if(config.fitnessFunction == nullptr){
        std::cerr << "Fitness function not set" << std::endl;
        return results;
    }
    if(population.size() == 0){
        std::cerr << "Population not initialized" << std::endl;
        return results;
    }

    #ifdef DEBUG
        std::cout << "Running Genetic Algorithm" << std::endl;
    #endif

    double bestFitnessValue = __DBL_MIN__; // Maximization

    Chromosome *bestChromosome = config.fitnessFunction->generateChromosome();
    

    // Start chronometer
    auto start = std::chrono::high_resolution_clock::now();

    // Run the algorithm for the specified number of generations
    unsigned int currentGeneration = 0;
    while (currentGeneration < config.maxGenerations) {
        
        // GA steps
        selection(); // Select the best individual by roulette wheel method
        crossover(); // Apply crossover using single point method
        mutation(); // Perform mutation (all individuals are evaluated here)
        evaluation(); // Evaluate the new population
        sortPopulation(); // Sort the population from best to worst fitness

        auto elapsed = std::chrono::high_resolution_clock::now() - start; // Time in milliseconds
        double er = fabs((bestFitnessValue - population[0]->fitness)/(bestFitnessValue+1));

        /*
        std::cout << "Generation " 
            << currentGeneration << " - Current best: " << population[0]->fitness 
            << "\t Last best: " << bestFitnessValue
            << "\t Elapsed time: " << std::chrono::duration_cast<std::chrono::seconds>(elapsed).count() << "s" 
            << "\t Relative error: " << er << std::endl;
        */

        ///// Check stop conditions ///////

        if (std::chrono::duration_cast<std::chrono::seconds>(elapsed).count() > config.timeout) {
            std::cout << "Timeout reached (" << config.timeout << "s)" << std::endl;
            results.stop_condition = TIMEOUT;
            break;
        }

        if(er < config.stagnationThreshold){
            std::cout << "Stagnation reached Er. = " << er << " Thres. = " << config.stagnationThreshold << std::endl;
            results.stop_condition = STAGNATION;
            break;
        }else{
            if(population[0]->fitness > bestFitnessValue){
                bestFitnessValue = population[0]->fitness;
                bestChromosome->clone(*population[0]);
                std::cout << "New best fitness: " << bestFitnessValue << " at generation " << currentGeneration << std::endl;
            } 
        }

        currentGeneration++;
    }

    if (currentGeneration >= config.maxGenerations) {
        std::cout << "Max generations reached (" << config.maxGenerations << ")" << std::endl;
        results.stop_condition = MAX_GENERATIONS;
    }

    auto end = std::chrono::high_resolution_clock::now();
    auto duration = std::chrono::duration_cast<std::chrono::milliseconds>(end - start); // Convert to milliseconds

    results.best = bestChromosome;
    results.bestFitnessValue = bestFitnessValue;
    results.generations = currentGeneration;
    results.elapsed = static_cast<int>(duration.count());

    return results;
}
