// Class GeneticAlgorithm definition

#ifndef GENETIC_ALGORITHM
#define GENETIC_ALGORITHM

#include <iostream>
#include <vector>
#include <algorithm>
#include "fitness.h"
#include "chromosome.h"

struct GAConfig {
    Fitness *fitness;
    unsigned int population_size;
    unsigned int generations;
    double mutation_rate;
    double crossover_rate;
    double elitism_rate;

    GAConfig() : 
        fitness(nullptr),
        population_size(100), 
        generations(10), 
        mutation_rate(0.01), 
        crossover_rate(0.8), 
        elitism_rate(0.1) {}
};

class GeneticAlgorithm {
    public:
        GeneticAlgorithm(GAConfig config);
        ~GeneticAlgorithm();

        inline Chromosome* getChromosome(int index) { return population[index]; }

        Chromosome* run();
    
    private:
        GAConfig config;
        std::vector<Chromosome*> population;
        void sortPopulation();

        void selection();
        void crossover();
        void mutation();
        void print();
};

#endif // GENETIC_ALGORITHM

