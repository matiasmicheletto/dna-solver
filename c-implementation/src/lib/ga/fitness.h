#ifndef FITNESS_H
#define FITNESS_H

#include "gene.h"
#include "chromosome.h"

class Fitness { // Abstract class that models a fitness function
    public:
        virtual ~Fitness(){}
        virtual double evaluate(const Chromosome *chromosome) const = 0;
        virtual Chromosome* generateChromosome() const = 0;
        
        virtual unsigned int getGeneSize() const { return gene_size; }

    protected:
        Fitness(){}
        unsigned int gene_size;
};

#endif // FITNESS_H