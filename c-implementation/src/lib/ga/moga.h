#ifndef MOGA_H
#define MOGA_H

#include "./ga.h"

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
        void sortPopulation() override;
        void evaluation() override;
        void selection() override;
};

#endif // MOGA_H