#include <iostream>
#include "fitness.h"
#include "../../src/lib/ga/ga.h"

#define SET_SIZE 25

int main(int argc, char **argv) {
    srand(time(nullptr));

    // Target
    unsigned int target = rand() % 200+100;
    // Generate set
    std::vector<unsigned int> set;
    for (int i = 0; i < SET_SIZE; i++) {
        int n = rand() % 100 + 1;
        set.push_back(n);
    }
    std::cout << std::endl;

    GAConfig config;
    config.fitnessFunction = new SubSetSumFitness(&set, target);
    config.populationSize = 100;
    config.maxGenerations = 500;
    config.mutationRate = 0.1;
    config.crossoverRate = 0.8; 
    config.elitismRate = 0.05;
    config.timeout = 360;
    config.stagnationThreshold = 0;
    config.print();

    GeneticAlgorithm *ga = new GeneticAlgorithm(config);
    GAResults results = ga->run();


    std::cout << std::endl << "Set: ";
    for (unsigned int i = 0; i < SET_SIZE; i++) {
        std::cout << set[i] << " ";
    }
    std::cout << std::endl;
    std::cout << "Target: " << target << std::endl;
    
    results.print();

    delete ga;

    return 0;
}