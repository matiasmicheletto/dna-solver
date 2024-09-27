#ifndef CHROMOSOME_H
#define CHROMOSOME_H

#include <iostream>
#include <vector>
#include <cstdlib>
#include "gene.h"

class Chromosome { // Abstract class that models a chromosome (list of genes with GA operators)
    public:
        Chromosome(const Chromosome& ch);
        ~Chromosome();

        void mutate(); 
        void crossover(Chromosome* other);
        virtual void clone(const Chromosome& other) = 0;
        
        double fitness; // Fitness value of the chromosome (value is updated by the fitness function)
        
        inline std::vector<Gene*> getGenes() const { return genes; }
        inline void setGenes(std::vector<Gene*> genes) { this->genes = genes; }

        virtual void printGenotype() const;
        virtual void printPhenotype() const = 0;
    
    protected:
        Chromosome(unsigned int size) {
            mutProb = 10.0/(double)size;
        } 
        std::vector<Gene*> genes; 
        double mutProb;
        Uniform uniform; // RANDOM
};

#endif // CHROMOSOME_H