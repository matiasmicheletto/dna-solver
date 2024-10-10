#ifndef CHROMOSOME_H
#define CHROMOSOME_H

#include <iostream>
#include <vector>
#include <cstdlib>
#include "gene.h"

class Chromosome { // Abstract class that models a chromosome (list of genes with GA operators)
    public:
        Chromosome(){};
        Chromosome(const Chromosome& ch);
        virtual ~Chromosome();

        virtual std::string getName() const = 0;

        virtual void mutate(); 
        virtual void crossover(Chromosome* other);
        virtual void clone(const Chromosome* other) = 0;
        
        inline std::vector<Gene*> getGenes() const { return genes; }
        inline void setGenes(std::vector<Gene*> genes) { this->genes = genes; }

        virtual void printGenotype() const;
        virtual void printPhenotype() const = 0;

        double fitness; // Fitness value of the chromosome (value is updated by the fitness function)
        
        // For multi-objective optimization
        std::vector<double> objectives;
        std::vector<Chromosome*> dominatedChromosomes;
        unsigned int dominationCount;
        double crowdingDistance;
    
    protected:
        Chromosome(double mutProb) : mutProb(mutProb) {}

        std::vector<Gene*> genes; 
        double mutProb;
        Uniform uniform;
};

#endif // CHROMOSOME_H