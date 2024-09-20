#ifndef CHROMOSOME_H
#define CHROMOSOME_H

#include <iostream>
#include <vector>
#include <cstdlib>
#include "gene.h"

class Chromosome { // Abstract class that models a chromosome (list of genes with GA operators)
    public:
        Chromosome(const Chromosome& ch);
        virtual ~Chromosome();

        void mutate(); 
        void crossover(Chromosome* other);
        double fitness; // Fitness value of the chromosome (value is updated by the fitness function)
        
        virtual void print() const;
        inline std::vector<Gene*> getGenes() const { return genes; }
        inline void setGenes(std::vector<Gene*> genes) { this->genes = genes; }
    
    protected:
        Chromosome(unsigned int size) {}; 
        std::vector<Gene*> genes; 
};

#endif // CHROMOSOME_H