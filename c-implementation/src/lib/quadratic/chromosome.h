#ifndef CUSTOM_CHROMOSOME_H
#define CUSTOM_CHROMOSOME_H

#include <vector>
#include "gene.h"
#include "../ga/chromosome.h"

class CustomChromosome : public Chromosome {
    public:
        CustomChromosome(unsigned int size) : Chromosome(size) {
            for (unsigned int i = 0; i < size; i++) {
                genes.push_back(new CustomGene());
            }
        }
};

#endif // CUSTOM_CHROMOSOME_H