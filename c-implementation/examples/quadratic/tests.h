#include "fitness.h"
#include "chromosome.h"
#include "gene.h"
#include "../../src/lib/ga/ga.h"

void testGene() {
    std::cout << std::endl << "----------------------" << std::endl;
    std::cout << "Testing gene: ";
    for(int i = 0; i < 10; i++) {
        BoolGene *g = new BoolGene();
        g->print();
        delete g;
    }
    std::cout << std::endl;
}

void testMutation() {
    std::cout << std::endl << "----------------------" << std::endl;
    std::cout << "Testing mutation" << std::endl;
    std::cout << "Chromosome created: ";
    BinaryStringCh *c = new BinaryStringCh();
    c->printGenotype();
    c->printPhenotype();

    std::cout << std::endl << "Mutated chromosome: ";
    c->mutate();
    c->printGenotype();
    c->printPhenotype();
}

void testCrossover() {
    std::cout << std::endl << "----------------------" << std::endl;
    std::cout << "Testing crossover" << std::endl;
    std::cout << "Chromosome 1: ";
    BinaryStringCh *c = new BinaryStringCh();
    c->printGenotype();
    c->printPhenotype();

    std::cout << std::endl << "Chromosome 2: ";
    BinaryStringCh *c2 = new BinaryStringCh();
    c2->printGenotype();
    c2->printPhenotype();

    c->crossover(c2);

    std::cout << std::endl << "Offspring:" << std::endl;
    std::cout << "Chromosome 1: ";
    c->printGenotype();
    c->printPhenotype();
    std::cout << "Chromosome 2: ";
    c2->printGenotype();
    c2->printPhenotype();
    
    delete c;
    delete c2;
}

void testFitness() {
    std::cout << std::endl << "----------------------" << std::endl;
    std::cout << "Testing fitness (quadratic function)" << std::endl;
    QuadraticFitness *f = new QuadraticFitness();
    std::cout << "Fitness name: " << f->getName() << std::endl;
    
    std::cout << "Evaluating chromosome: ";
    BinaryStringCh *c = f->generateChromosome();
    c->printGenotype();
    c->printPhenotype();
    double result = f->evaluate(c);
    std::cout << "Result: " << result << std::endl;

    delete f;
    delete c;
}

void testGA() {
    std::cout << std::endl << "----------------------" << std::endl;
    std::cout << "Testing Genetic Algorithm" << std::endl;

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

    delete ga;
}