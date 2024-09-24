// Class GeneticAlgorithm definition

#ifndef GENETIC_ALGORITHM
#define GENETIC_ALGORITHM

#include <iostream>
#include <vector>
#include <algorithm>
#include <chrono>
#include <math.h>
#include "fitness.h"
#include "chromosome.h"

struct GAConfig { // Configuration parameters for the Genetic Algorithm
    Fitness *fitnessFunction;
    unsigned int populationSize;
    unsigned int maxGenerations;
    double mutationRate;
    double crossoverRate;
    double elitismRate;
    unsigned int timeout;
    double stagnationThreshold;

    void print() {
        std::cout << "Fitness function: " << fitnessFunction->getName() << std::endl;
        std::cout << "GA Configuration: " << std::endl;
        std::cout << "Population size: " << populationSize << std::endl;
        std::cout << "Max generations: " << maxGenerations << std::endl;
        std::cout << "Mutation rate: " << mutationRate << std::endl;
        std::cout << "Crossover rate: " << crossoverRate << std::endl;
        std::cout << "Elitism rate: " << elitismRate << std::endl << std::endl;
    }

    GAConfig() : 
        fitnessFunction(nullptr),
        populationSize(100), 
        maxGenerations(1000), 
        mutationRate(0.01), 
        crossoverRate(0.8), 
        elitismRate(0.1),
        timeout(360),
        stagnationThreshold(1.0E-6) {}
};

enum STOP_CONDITION { // Stop condition for the Genetic Algorithm
    MAX_GENERATIONS,
    TIMEOUT,
    STAGNATION
};

struct GAResults { // Results of the Genetic Algorithm
    Chromosome *best;
    double bestFitnessValue;
    unsigned int generations;
    STOP_CONDITION stop_condition;

    void print() {
        std::cout << std::endl << "Best fitness: " << bestFitnessValue << std::endl;
        std::cout << "Best chromosome:" << std::endl;
        std::cout << "  - ";
        best->printGenotype();
        std::cout << "  - ";
        best->printPhenotype();

        std::cout << std::endl << "Generations: " << generations << std::endl;
        std::cout << "Stop condition: ";
        switch (stop_condition) {
            case MAX_GENERATIONS:
                std::cout << "Max generations" << std::endl;
                break;
            case TIMEOUT:
                std::cout << "Timeout" << std::endl;
                break;
            case STAGNATION:
                std::cout << "Stagnation" << std::endl;
                break;
        }
    }
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

        void sortPopulation();
        void evaluation();
        void selection();
        void crossover();
        void mutation();
};

#endif // GENETIC_ALGORITHM

