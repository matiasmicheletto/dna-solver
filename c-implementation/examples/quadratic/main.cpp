#define MANUAL "manual.txt"

#include <iostream>
#include "fitness.h"
#include "../../src/lib/ga/ga.h"

int main(int argc, char **argv) {
    srand(time(nullptr));

    GAConfig config;
    config.fitnessFunction = new QuadraticFitness();
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
    results.print();

    return 0;
}

