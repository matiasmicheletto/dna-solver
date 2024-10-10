// Class GeneticAlgorithm definition

#ifndef GENETIC_ALGORITHM
#define GENETIC_ALGORITHM

#include <iostream>
#include <vector>
#include <algorithm>
#include <chrono>
#include <math.h>
#include <cstring>
#include "fitness.h"

struct GAConfig { // Configuration parameters for the Genetic Algorithm
    Fitness *fitnessFunction;
    unsigned int populationSize;
    unsigned int maxGenerations;
    double mutationRate;
    double crossoverRate;
    double elitismRate;
    unsigned int timeout;
    double stagnationWindow;
    int printLevel;

    void print() {
        std::cout << std::endl << "Genetic Algorithm Configuration" << std::endl;
        if(fitnessFunction == nullptr)
            std::cout << "  - Fitness function: not set" << std::endl;
        else
            std::cout << "  - Fitness function: " << fitnessFunction->getName() << std::endl;
        std::cout << "  - Population size: " << populationSize << std::endl;
        std::cout << "  - Max generations: " << maxGenerations << std::endl;
        std::cout << "  - Timeout: " << timeout << " seconds." << std::endl;
        std::cout << "  - Stagnation window: " << stagnationWindow*100 << "%" << std::endl;
        std::cout << "  - Mutation rate: " << mutationRate << std::endl;
        std::cout << "  - Crossover rate: " << crossoverRate << std::endl;
        std::cout << "  - Elitism rate: " << elitismRate << std::endl << std::endl;
    }

    GAConfig() : 
        fitnessFunction(nullptr),
        populationSize(100), 
        maxGenerations(100), 
        mutationRate(0.05), 
        crossoverRate(0.8), 
        elitismRate(0.02),
        timeout(360),
        stagnationWindow(0.7),
        printLevel(0) {}
};

enum STATUS { // Stop condition for the Genetic Algorithm
    IDLE,
    RUNNING,
    MAX_GENERATIONS,
    TIMEOUT,
    STAGNATED
};

struct GAResults { // Results of the Genetic Algorithm
    Chromosome *best;
    double bestFitnessValue;
    unsigned int generations;
    STATUS status;
    int elapsed;

    void print() {
        std::cout << std::endl << "Best fitness: " << bestFitnessValue << std::endl;
        std::cout << "Best chromosome:" << std::endl;
        std::cout << "  - ";
        best->printGenotype();
        std::cout << "  - ";
        best->printPhenotype();
        std::cout << std::endl << "Generations: " << generations << std::endl;
        std::cout << "Stop condition: ";
        switch (status) {
            case IDLE:
                std::cout << "Idle" << std::endl;
                break;
            case RUNNING:
                std::cout << "Population evolving" << std::endl;
            case MAX_GENERATIONS:
                std::cout << "Max generations" << std::endl;
                break;
            case TIMEOUT:
                std::cout << "Timeout" << std::endl;
                break;
            case STAGNATED:
                std::cout << "Stagnation" << std::endl;
                break;
            default:
                std::cout << "Unknown" << std::endl;
        }
    }
};


class GeneticAlgorithm {
    public:
        GeneticAlgorithm();
        GeneticAlgorithm(Fitness *fitnessFunction, GAConfig config = GAConfig());
        
        ~GeneticAlgorithm();

        inline Chromosome* getChromosome(int index) { return population[index]; }

        void setConfig(GAConfig config);
        void setConfig(int argc, char **argv);
        void setFitnessFunction(Fitness *fitnessFunction);
        void setPopulation(std::vector<Chromosome*> population);

        virtual GAResults run();

        void print();
    
    protected:
        GAConfig config;
        STATUS status;
        std::vector<Chromosome*> population;
        Uniform uniform;
        Chromosome *bestChromosome;
        double bestFitnessValue;

        unsigned int currentGeneration;
        unsigned int stagnatedGenerations;


        virtual void sortPopulation();
        void initPopulation();
        void clearPopulation();
        
        virtual void evaluation();
        virtual void selection();
        void crossover();
        void mutation();
};

#endif // GENETIC_ALGORITHM

