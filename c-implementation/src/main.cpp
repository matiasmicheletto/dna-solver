#define MANUAL "manual.txt"

#include "lib/misc.h"
#include "lib/quadratic/fitness.h"
#include "lib/quadratic/chromosome.h"
#include "lib/quadratic/gene.h"

#include <iostream>
#include <string.h>

void testGene();
void testChromosome();
void testFitness();

int main(int argc, char **argv) {
    for(int i = 0; i < argc; i++) {    
        if(strcmp(argv[i], "-h") == 0 || strcmp(argv[i], "--help") == 0 || argc == 1)
            printHelp(MANUAL);
    }
    return 0;
}

void testGene() {
    CustomGene *g = new CustomGene();
}

void testChromosome() {
    CustomChromosome *c = new CustomChromosome(10);
    c->mutate();
    CustomChromosome *c2 = new CustomChromosome(10);
    c->crossover(c2);
}

void testFitness() {
    CustomFitness *f = new CustomFitness();
    CustomChromosome *c = f->generateChromosome();
    double result = f->evaluate(c);
    std::cout << "Result: " << result << std::endl;
}
