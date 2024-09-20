#include "ga.h"

GeneticAlgorithm::GeneticAlgorithm(GAConfig config) : config(config) {
    // Initialize population, chromosomes are already evaluated
    fitnessSum = 0.0;
    for (unsigned int i = 0; i < config.populationSize; i++) {
        Chromosome *ch = config.fitness->generateChromosome();
        population.push_back(ch);
        fitnessSum += ch->fitness;
    }
    
    sortPopulation(); // Sort the population by fitness
    lastBestFitness = population[0]->fitness;

    iter = 0;
}

GeneticAlgorithm::~GeneticAlgorithm() {}

void GeneticAlgorithm::sortPopulation() {
    std::sort(population.begin(), population.end(), [](Chromosome* a, Chromosome* b) {
        return a->fitness > b->fitness; // Sort in descending order
    });
}

void GeneticAlgorithm::evaluatePopulation() {
    fitnessSum = 0.0;
    for (unsigned int i = 0; i < config.populationSize; i++) {
        population[i]->fitness = config.fitness->evaluate(population[i]);
        fitnessSum += population[i]->fitness;
    }
}

void GeneticAlgorithm::selection() { // Roulette wheel selection
    // Keep the best chromosomes
    unsigned int elitism = config.elitismRate * config.populationSize;
    std::vector<Chromosome*> new_population;
    for (unsigned int i = 0; i < elitism; i++) {
        new_population.push_back(population[i]);
    }

    // Select the best individuals between the rest of the population
    for (unsigned int i = elitism; i < config.populationSize; i++) {
        const double r = (double) rand() / RAND_MAX * fitnessSum;
        double sum = 0.0;
        for (unsigned int j = elitism; j < config.populationSize; j++) {
            sum += population[j]->fitness;
            if (sum >= r) {
                new_population.push_back(population[j]);
                break;
            }
        }
    }

    // Update the population
    population = new_population;
}

void GeneticAlgorithm::crossover() {
    for (unsigned int i = 0; i < config.populationSize; i++) {
        if (rand() < config.crossover_rate) {
            unsigned int parent1 = rand() % config.populationSize;
            population[i]->crossover(population[parent1]);
        }
    }
}

void GeneticAlgorithm::mutation() {
    for (unsigned int i = 0; i < config.populationSize; i++) {
        if (rand() < config.mutation_rate) {
            population[i]->mutate();
        }
    }
}

void GeneticAlgorithm::print() {
    for (unsigned int i = 0; i < config.populationSize; i++) {
        std::cout << "Chromosome " << i << ": " << population[i]->fitness << std::endl;
    }
}


GAResults GeneticAlgorithm::run() {

    std::cout << "Running Genetic Algorithm..." << std::endl;

    GAResults results;

    // Start chronometer
    auto start = std::chrono::high_resolution_clock::now();

    // Run the algorithm for the specified number of generations
    for (unsigned int i = 0; i < config.generations; i++) {
        selection(); // Select the best individual by roulette wheel method
        crossover(); // Apply crossover using single point method
        mutation(); // Perform mutation (all individuals are evaluated here)
        evaluatePopulation(); // Evaluate the new population
        sortPopulation(); // Sort the population from best to worst fitness
        
        std::cout << "Generation " << i << " - Best fitness: " << population[0]->fitness << std::endl;

        // Check stop conditions

        iter++;
        if(iter > config.maxIter){
            results.stop_condition = MAX_ITER;
            break;
        }

        auto elapsed = std::chrono::high_resolution_clock::now() - start; // Time in milliseconds
        if (std::chrono::duration_cast<std::chrono::seconds>(elapsed).count() > config.timeout) {
            std::cout << "Timeout reached" << std::endl;
            results.stop_condition = TIMEOUT;
            break;
        }

        if(lastBestFitness - population[0]->fitness < config.stagnationThreshold){
            std::cout << "Stagnation reached" << std::endl;
            results.stop_condition = STAGNATION;
            break;
        }
    }

    results.best = population[0];
    results.best_fitness = population[0]->fitness;
    results.iterations = iter;

    return results;
}
