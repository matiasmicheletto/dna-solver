#ifndef CUSTOM_FITNESS
#define CUSTOM_FITNESS

#include <cmath>
#include "../ga/fitness.h"
#include "chromosome.h"
#include "gene.h"

class CustomFitness : public Fitness {
    public:
        CustomFitness() : Fitness() {}
        
        double evaluate(const Chromosome *chromosome) const override {
            CustomChromosome *c = (CustomChromosome*) chromosome;
            // Convert binary to decimal
            int value = 0;
            unsigned int size = c->getGenes().size();
            for (unsigned int i = 0; i < size; i++) {
                CustomGene *g = (CustomGene*) c->getGenes()[i];
                value += g->getValue() * pow(2, i);
            }
            // Evaluate the quadratic function
            return (double) value * value;
        }

        CustomChromosome* generateChromosome() const override {
            return new CustomChromosome(gene_size);
        }
};

#endif // CUSTOM_FITNESS