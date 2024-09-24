#ifndef FITNESS_H
#define FITNESS_H

#include "chromosome.h"

class Fitness { // Abstract class that models a fitness function
    public:
        virtual ~Fitness(){}
        virtual std::string getName() const = 0;
        virtual double evaluate(const Chromosome *chromosome) const = 0;
        virtual Chromosome* generateChromosome() const = 0;

    protected:
        Fitness(){}
};

#endif // FITNESS_H