// Class GeneticAlgorithm definition

#ifndef GENETIC_ALGORITHM
#define GENETIC_ALGORITHM

#include <iostream>
#include <vector>
#include <algorithm>
#include <chrono>
#include "fitness.h"
#include "chromosome.h"

struct GAConfig { // Configuration parameters for the Genetic Algorithm
    Fitness *fitness;
    unsigned int populationSize;
    unsigned int generations;
    double mutation_rate;
    double crossover_rate;
    double elitismRate;
    unsigned int maxIter;
    unsigned int timeout;
    double stagnationThreshold;

    void print() {
        std::cout << "Fitness function: " << fitness->getName() << std::endl;
        std::cout << "GA Configuration: " << std::endl;
        std::cout << "Population size: " << populationSize << std::endl;
        std::cout << "Generations: " << generations << std::endl;
        std::cout << "Mutation rate: " << mutation_rate << std::endl;
        std::cout << "Crossover rate: " << crossover_rate << std::endl;
        std::cout << "Elitism rate: " << elitismRate << std::endl << std::endl;
    }

    GAConfig() : 
        fitness(nullptr),
        populationSize(100), 
        generations(10), 
        mutation_rate(0.01), 
        crossover_rate(0.8), 
        elitismRate(0.1),
        maxIter(1000),
        timeout(360),
        stagnationThreshold(0.1) {}
};

enum STOP_CONDITION { // Stop condition for the Genetic Algorithm
    MAX_ITER,
    TIMEOUT,
    STAGNATION
};

struct GAResults { // Results of the Genetic Algorithm
    Chromosome *best;
    double best_fitness;
    unsigned int iterations;
    STOP_CONDITION stop_condition;
};


class GeneticAlgorithm {
    public:
        GeneticAlgorithm(GAConfig config);
        ~GeneticAlgorithm();

        inline Chromosome* getChromosome(int index) { return population[index]; }

        GAResults run();

        void print();
    
    private:
        GAConfig config;
        std::vector<Chromosome*> population;
        double fitnessSum;
        unsigned int iter;
        double lastBestFitness;

        void sortPopulation();
        void evaluatePopulation();
        void selection();
        void crossover();
        void mutation();
};

#endif // GENETIC_ALGORITHM

