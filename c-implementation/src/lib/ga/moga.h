#ifndef MULTI_OBJECTIVE_GA_H
#define MULTI_OBJECTIVE_GA_H

#include "./ga.h"

class MultiObjectiveGA : public GeneticAlgorithm {
    public:
        MultiObjectiveGA(Fitness *fitnessFunction, GAConfig *config) : GeneticAlgorithm(fitnessFunction, config) {}
        MultiObjectiveGA() : GeneticAlgorithm() {}

        GAResults run() override;

        void print() override;

    private:
        std::vector<std::vector<Chromosome*>> paretoFronts;

        bool dominates(Chromosome *a, Chromosome *b);
        void sortPopulation() override;
        void evaluation() override;
        void selection() override;
};


#endif // MULTI_OBJECTIVE_GA_H