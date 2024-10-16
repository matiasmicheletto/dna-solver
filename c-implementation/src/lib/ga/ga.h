// Class GeneticAlgorithm definition

#ifndef GENETIC_ALGORITHM
#define GENETIC_ALGORITHM

#include <iostream>
#include <fstream>
#include <vector>
#include <algorithm>
#include <chrono>
#include <math.h>
#include <cstring>

#include "ga_config.h"
#include "ga_results.h"
#include "fitness.h"


class GeneticAlgorithm {
    public:
        GeneticAlgorithm();
        GeneticAlgorithm(Fitness *fitnessFunction);
        
        ~GeneticAlgorithm();

        inline Chromosome* getChromosome(int index) { return population[index]; }

        GAConfig& getConfig() { return config; }

        void setPopulation(std::vector<Chromosome*> population);

        virtual GAResults run();

        virtual void print();
    
    protected:
        GAConfig config;
        STATUS status;
        std::vector<Chromosome*> population;
        unsigned int elite;
        Uniform uniform;
        Chromosome *bestChromosome;
        double bestFitnessValue;

        unsigned int currentGeneration;
        unsigned int stagnatedGenerations;

        virtual void sortPopulation();
        void initialize();
        void clearPopulation();
        
        virtual void evaluation();
        virtual void selection();
        void crossover();
        void mutation();
};

#endif // GENETIC_ALGORITHM

