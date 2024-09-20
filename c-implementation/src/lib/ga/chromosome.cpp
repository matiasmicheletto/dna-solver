#include "chromosome.h"

Chromosome::Chromosome(const Chromosome& ch) : genes(ch.genes) {}

Chromosome::~Chromosome() {} // No need to free memory, as it is done by the Gene objects

void Chromosome::mutate() { // Mutate each gene with a probability of 1/genes.size()
    double prob = 1.0 / genes.size();
    for (unsigned int i = 0; i < genes.size(); i++) {
        if (rand()/RAND_MAX < prob)
            genes[i]->randomize();
    }
}

void Chromosome::crossover(Chromosome* other) { // Single point crossover
    unsigned int pivot = rand() % genes.size(); // Crossover point
    for (unsigned int i = pivot; i < genes.size(); i++) { // Swap genes from pivot to the end
        Gene *tmp = genes[i];
        genes[i] = other->genes[i];
        other->genes[i] = tmp;
    }
}

void Chromosome::print() const { 
    // Print the genotype of the chromosome. 
    // To print the phenotype, override this method in the subclass
    for (unsigned int i = 0; i < genes.size(); i++) {
        genes[i]->print();
    }
    std::cout << std::endl;
}