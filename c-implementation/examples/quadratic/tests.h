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

void testChromosome() {
    std::cout << std::endl << "----------------------" << std::endl;
    std::cout << "Testing chromosome" << std::endl;
    std::cout << "Chromosome created: ";
    BinaryStringCh *c = new BinaryStringCh(64);
    c->print();

    std::cout << std::endl << "Mutated chromosome: ";
    c->mutate();
    c->print();

    std::cout << std::endl << "Crossover against: ";
    BinaryStringCh *c2 = new BinaryStringCh(64);
    c2->print();

    c->crossover(c2);

    std::cout << std::endl << "Offspring:" << std::endl;
    std::cout << "Chromosome 1: ";
    c->print();
    std::cout << "Chromosome 2: ";
    c2->print();
    
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
    c->print();
    double result = f->evaluate(c);
    std::cout << "Result: " << result << std::endl;

    delete f;
    delete c;
}

void testGA() {
    std::cout << std::endl << "----------------------" << std::endl;
    std::cout << "Testing Genetic Algorithm" << std::endl;

    GAConfig config;
    config.fitness = new QuadraticFitness();
    config.populationSize = 100;
    config.generations = 10;
    config.mutation_rate = 0.01;
    config.crossover_rate = 0.8;
    config.elitismRate = 0.1;
    config.maxIter = 1000;
    config.timeout = 360;
    config.stagnationThreshold = 0.1;
    config.print();

    GeneticAlgorithm *ga = new GeneticAlgorithm(config);
    ga->run();

    delete ga;
}