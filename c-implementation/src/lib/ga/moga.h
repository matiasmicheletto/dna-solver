#ifndef MULTI_OBJECTIVE_GA_H
#define MULTI_OBJECTIVE_GA_H

#include "./ga.h"
#include "./mo_fitness.h"


struct MOGAConfig : public GAConfig {
    MOFitness *fitness;
    
};

struct MOGAResults : public GAResults {
    std::vector<Chromosome*> paretoFront;
};

class MultiObjectiveGA : public GeneticAlgorithm {
    public:
        MultiObjectiveGA(Fitness *fitnessFunction, GAConfig config) : GeneticAlgorithm(fitnessFunction, config) {}
        MultiObjectiveGA(Fitness *fitnessFunction) : GeneticAlgorithm(fitnessFunction) {}
        MultiObjectiveGA() : GeneticAlgorithm() {}

        GAResults run() override;

    private:
        MOGAConfig config;
        std::vector<std::vector<Chromosome*>> paretoFronts;

        bool dominates(Chromosome *a, Chromosome *b);
        void sortPopulation() override;
        void evaluation() override;
        void selection() override;
};


#endif // MULTI_OBJECTIVE_GA_H