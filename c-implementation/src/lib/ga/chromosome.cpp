#include "chromosome.h"

Chromosome::Chromosome(const Chromosome& ch) : genes(ch.genes) {
    mutProb = ch.mutProb;
}

Chromosome::~Chromosome() {
    for(Gene* gene : genes)
        delete gene;
} 

void Chromosome::mutate() { // Mutate each gene with a probability of 1/genes.size()
    for (unsigned int i = 0; i < genes.size(); i++) {
        if (uniform.random() < mutProb)
            genes[i]->randomize();
    }
}

void Chromosome::crossover(Chromosome* other) { // Single point crossover
    unsigned int pivot = uniform.random(genes.size());
    // From 0 to pivot, swap genes
    for (unsigned int i = 0; i < pivot; i++){
        std::swap(genes[i], other->genes[i]);
    }
}

void Chromosome::printGenotype() const { 
    // Print the genotype of the chromosome. 
    for (unsigned int i = 0; i < genes.size(); i++)
        genes[i]->print();
    std::cout << std::endl;
}