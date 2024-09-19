#include "ga.h"

GeneticAlgorithm::GeneticAlgorithm(GAConfig config) : config(config) {
    
}

GeneticAlgorithm::~GeneticAlgorithm() {}

void GeneticAlgorithm::sortPopulation() {
    std::sort(population.begin(), population.end(), [&](Chromosome* a, Chromosome* b) {
        return config.fitness->evaluate(a) > config.fitness->evaluate(b);
    });
}

void GeneticAlgorithm::selection() {
    // Sort the population by fitness
    sortPopulation();

    // Keep the best chromosomes
    unsigned int elitism = config.elitism_rate * config.population_size;
    std::vector<Chromosome*> new_population;
    for (unsigned int i = 0; i < elitism; i++) {
        new_population.push_back(population[i]);
    }

    // Select the rest of the population
    for (unsigned int i = elitism; i < config.population_size; i++) {
        unsigned int parent1 = rand() % config.population_size;
        unsigned int parent2 = rand() % config.population_size;
        Chromosome* child = new Chromosome(*population[parent1]);
        child->crossover(population[parent2]);
        new_population.push_back(child);
    }

    // Update the population
    population = new_population;
}

void GeneticAlgorithm::crossover() {
    for (unsigned int i = 0; i < config.population_size; i++) {
        if (rand() < config.crossover_rate) {
            unsigned int parent1 = rand() % config.population_size;
            unsigned int parent2 = rand() % config.population_size;
            population[i]->crossover(population[parent1]);
        }
    }
}

void GeneticAlgorithm::mutation() {
    for (unsigned int i = 0; i < config.population_size; i++) {
        if (rand() < config.mutation_rate) {
            population[i]->mutate();
        }
    }
}

void GeneticAlgorithm::print() {
    for (unsigned int i = 0; i < config.population_size; i++) {
        std::cout << "Chromosome " << i << ": " << config.fitness->evaluate(population[i]) << std::endl;
    }
}


Chromosome* GeneticAlgorithm::run() {
    // Initialize population
    for (unsigned int i = 0; i < config.population_size; i++) {
        population.push_back(config.fitness->generateChromosome());
    }

    // Run the algorithm for the specified number of generations
    for (unsigned int i = 0; i < config.generations; i++) {
        selection();
        crossover();
        mutation();
    }

    return population[0];
}
