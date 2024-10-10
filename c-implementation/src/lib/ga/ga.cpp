#include "ga.h"

GeneticAlgorithm::GeneticAlgorithm() { 
    // Initialize with default configuration
    config = GAConfig(); // Cannot initialize population without a fitness function
    status = IDLE;
    bestChromosome = config.fitnessFunction->generateChromosome();
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
            config.stagnationWindow = atof(argv[i + 1]);
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

void GeneticAlgorithm::setPopulation(std::vector<Chromosome*> population) {
    clearPopulation();
    this->population = population;
    for(unsigned int i = 0; i < population.size(); i++){
        config.fitnessFunction->evaluate(population[i]);
    }
    sortPopulation();
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
    long int bestFitnessIndex = -1;
    for (unsigned int i = 0; i < config.populationSize; i++) {
        population[i]->fitness = config.fitnessFunction->evaluate(population[i]);
        if(population[i]->fitness > bestFitnessValue){
            bestFitnessIndex = i;
        }
    }
    /*
    if(bestFitnessIndex != -1){
        bestFitnessValue = population[bestFitnessIndex]->fitness;
        bestChromosome->clone(population[bestFitnessIndex]);
    }else{
        stagnatedGenerations++;
    }
    */
}

void GeneticAlgorithm::selection() { // Roulette wheel selection

    // Keep the best chromosomes
    unsigned int elite = config.elitismRate * (double) config.populationSize;
    std::vector<Chromosome*> newPopulation;
    for (unsigned int i = 0; i < elite; i++) {
        newPopulation.push_back(population[i]);
    }

    // Selection requires the fitness values to be positive
    // Calculate the sum of the shifted fitness values
    double minFitness = population[population.size() - 1]->fitness;
    double offset = std::abs(minFitness);
    double scaledFitness[config.populationSize];
    double fitnessSum = 0.0;
    for (unsigned int j = elite; j < config.populationSize; j++) {
        scaledFitness[j] = population[j]->fitness + offset + 1.0; // Scaling to positive values
        fitnessSum += scaledFitness[j];
    }

    // Select the best individuals between the rest of the population
    unsigned int tries = 0; // Avoid infinite loop (should never happen)
    while(newPopulation.size() < config.populationSize){
        const double r = uniform.random(fitnessSum);
        double sum = 0.0;
        for (unsigned int j = elite; j < config.populationSize; j++) {
            sum += scaledFitness[j];
            if (sum >= r) {
                // Create new chromosome (already evaluated)
                Chromosome *ch = config.fitnessFunction->generateChromosome();
                ch->clone(population[j]);
                newPopulation.push_back(ch);
                break;
            }
        }
        tries++;
        if(tries > 200){
            std::cerr << "Selection error" << std::endl;
            std::cout << "Fitness sum: " << fitnessSum << std::endl;
            std::cout << "r = " << r << std::endl;
            std::cout << "Sum: " << sum << std::endl;
            exit(1);
        }
    }

    for(unsigned int i = elite; i < config.populationSize; i++){
        delete population[i];
        population[i] = newPopulation[i];
    }
}

void GeneticAlgorithm::crossover() {
    for (unsigned int i = 0; i < config.populationSize; i++) {
        if (uniform.random() < config.crossoverRate) {
            unsigned int parent1 = uniform.random(config.populationSize);
            population[i]->crossover(population[parent1]);
        }
    }
}

void GeneticAlgorithm::mutation() {
    for (unsigned int i = 0; i < config.populationSize; i++) {
        if (uniform.random() < config.mutationRate) {
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
    
    status = RUNNING;
    bestFitnessValue = __DBL_MIN__;
    currentGeneration = 0;
    stagnatedGenerations = 0;
    unsigned int maxStagationGenerations = config.stagnationWindow*config.maxGenerations;

    // Start chronometer
    auto start = std::chrono::high_resolution_clock::now();

    while (status == RUNNING){
        
        // GA steps
        
        sortPopulation(); // Sort the population from best to worst fitness
        selection(); // Select the best individual by roulette wheel method
        crossover(); // Apply crossover using single point method
        mutation(); // Perform mutation (all individuals are evaluated here)
        evaluation(); // Evaluate the new population


        ///// Check stop conditions ///////

        auto elapsed = std::chrono::high_resolution_clock::now() - start; // Time in milliseconds
        if (std::chrono::duration_cast<std::chrono::seconds>(elapsed).count() > config.timeout) {
            std::cout << "Timeout reached (" << config.timeout << "s)" << std::endl;
            status = TIMEOUT;
            break;
        }

        if(stagnatedGenerations > maxStagationGenerations){
            std::cout << "Stagnation reached: " << stagnatedGenerations << " generations out of " << config.maxGenerations << " stipulated." << std::endl;
            status = STAGNATED;
            break;
        }

        currentGeneration++;
        if(currentGeneration >= config.maxGenerations){
            std::cout << "Max generations reached (" << config.maxGenerations << ")" << std::endl;
            status = MAX_GENERATIONS;
            break;
        }
    }

    // Get the best chromosome
    bestChromosome = std::max_element(population.begin(), population.end(), [](Chromosome* a, Chromosome* b) {
        return a->fitness < b->fitness; // Sort in descending order
    }).operator*();

    auto end = std::chrono::high_resolution_clock::now();
    auto duration = std::chrono::duration_cast<std::chrono::milliseconds>(end - start); // Convert to milliseconds

    // Export results
    results.status = status;
    results.best = bestChromosome;
    results.bestFitnessValue = bestChromosome->fitness;
    results.generations = currentGeneration;
    results.elapsed = static_cast<int>(duration.count());

    return results;
}
