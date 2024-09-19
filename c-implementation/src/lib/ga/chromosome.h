#ifndef CHROMOSOME_H
#define CHROMOSOME_H

#include <vector>
#include <cstdlib>
#include "gene.h"

class Chromosome { // Abstract class that models a chromosome (list of genes with GA operators)
    public:
        Chromosome(const Chromosome& ch);
        virtual ~Chromosome();

        void mutate(); 
        void crossover(const Chromosome* other);
        std::vector<Gene*> getGenes() const { return genes; }
    
    protected:
        Chromosome(unsigned int size) {};
        std::vector<Gene*> genes;
};

#endif // CHROMOSOME_H