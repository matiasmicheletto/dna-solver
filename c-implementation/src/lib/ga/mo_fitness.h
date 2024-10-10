#ifndef MO_FITNESS_H
#define MO_FITNESS_H

#include "fitness.h"


class MOFitness : public Fitness {
    public:
        MOFitness() : Fitness() {}

        std::string getName() const override {
            return "Multi-objective fitness function";
        }

        virtual std::vector<double> evaluateMO(const Chromosome *chromosome) const {
            return {0.0, 0.0};
        }
};


#endif // MO_FITNESS_H