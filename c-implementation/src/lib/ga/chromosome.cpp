#include "chromosome.h"

Chromosome::Chromosome(const Chromosome& ch) : genes(ch.genes) {}

Chromosome::~Chromosome() {
    for (unsigned int i = 0; i < genes.size(); i++) {
        delete genes[i];
    }
}

void Chromosome::mutate() {
    double prob = 1.0 / genes.size();
    for (unsigned int i = 0; i < genes.size(); i++) {
        if (rand() < prob)
            genes[i]->randomize();
    }
}

void Chromosome::crossover(const Chromosome* other) {
    unsigned int pivot = rand() % genes.size(); // Crossover point
    std::vector<Gene*> otherGenes = other->getGenes();
    std::vector<Gene*> temp(otherGenes.begin() + pivot, otherGenes.end());
    otherGenes.resize(pivot);
    otherGenes.insert(otherGenes.end(), temp.begin(), temp.end());
    genes.insert(genes.end(), temp.begin(), temp.end());
}
