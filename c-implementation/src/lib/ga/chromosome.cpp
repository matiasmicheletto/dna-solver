#include "chromosome.h"

Chromosome::Chromosome(const Chromosome& ch) : genes(ch.genes) {}

Chromosome::~Chromosome() {
    for(Gene* gene : genes) {
        delete gene;
    }
} 

void Chromosome::mutate() { // Mutate each gene with a probability of 1/genes.size()
    double prob = 1.0 / genes.size();
    for (unsigned int i = 0; i < genes.size(); i++) {
        if (rand()/RAND_MAX < prob)
            genes[i]->randomize();
    }
}

void Chromosome::crossover(Chromosome* other) { // Single point crossover
    unsigned int pivot = rand() % genes.size(); // Crossover point
    // From 0 to pivot, swap genes
    for (unsigned int i = 0; i < pivot; i++) { 
        Gene *tmp = genes[i];
        genes[i] = other->genes[i];
        other->genes[i] = tmp;
    }
}

void Chromosome::printGenotype() const { 
    // Print the genotype of the chromosome. 
    for (unsigned int i = 0; i < genes.size(); i++) {
        genes[i]->print();
    }
    std::cout << std::endl;
}