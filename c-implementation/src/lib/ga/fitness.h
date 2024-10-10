#ifndef FITNESS_H
#define FITNESS_H

#include "chromosome.h"

class Fitness { // Abstract class that models a fitness function
    public:
        virtual ~Fitness() = default;
        virtual std::string getName() const = 0;        
        virtual void evaluate(const Chromosome *chromosome) const = 0;
        virtual Chromosome* generateChromosome() const = 0;

    protected:
        Fitness() = default;
};

#endif // FITNESS_H