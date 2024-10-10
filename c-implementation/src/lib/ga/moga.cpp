#include "moga.h"

bool MultiObjectiveGA::dominates(Chromosome *a, Chromosome *b) {
    bool at_least_one_better = false;
    for (unsigned int i = 0; i < a->objectives.size(); i++) {
        if (a->objectives[i] > b->objectives[i]) {
            return false;
        }
        if (a->objectives[i] < b->objectives[i]) {
            at_least_one_better = true;
        }
    }
    return at_least_one_better;
}

void MultiObjectiveGA::sortPopulation() { // Non-dominated sorting
    paretoFronts.clear();
    
    // Step 1: Calculate domination counts and dominated sets for each chromosome
    for (unsigned int i = 0; i < population.size(); ++i) {
        population[i]->dominationCount = 0;
        population[i]->dominatedChromosomes.clear();
        for (unsigned int j = 0; j < population.size(); ++j) {
            if (i == j) continue;

            if (dominates(population[i], population[j])) {
                population[i]->dominatedChromosomes.push_back(population[j]);
            } else if (dominates(population[j], population[i])) {
                population[i]->dominationCount++;
            }
        }
        if (population[i]->dominationCount == 0) {
            if (paretoFronts.empty()) paretoFronts.emplace_back();  // Create the first front if needed
            paretoFronts[0].push_back(population[i]);  // Add to the first Pareto front
        }
    }

    // Step 2: Calculate the rest of the fronts
    unsigned int currentFront = 0;
    while (!paretoFronts[currentFront].empty()) {
        std::vector<Chromosome*> nextFront;
        for (Chromosome *chromosome : paretoFronts[currentFront]) {
            for (Chromosome *dominated : chromosome->dominatedChromosomes) {
                dominated->dominationCount--;
                if (dominated->dominationCount == 0) {
                    nextFront.push_back(dominated);
                }
            }
        }
        currentFront++;
        paretoFronts.push_back(nextFront);
    }
}

void MultiObjectiveGA::evaluation() {
    for (unsigned int i = 0; i < config.populationSize; i++) {
        population[i]->objectives = config.fitness->evaluateMO(population[i]);
    }
}

void MultiObjectiveGA::selection() { // Crowding distance
    std::vector<Chromosome*> newPopulation;

    for(std::vector<Chromosome*> front : paretoFronts){
        if(newPopulation.size() + front.size() <= config.populationSize){
            newPopulation.insert(newPopulation.end(), front.begin(), front.end());
            continue;
        } else { // Compute crowding distance for the current front
            for(unsigned int obj = 0; obj < front[0]->objectives.size(); obj++){
                std::sort(front.begin(), front.end(), [obj](Chromosome* a, Chromosome* b){
                    return a->objectives[obj] < b->objectives[obj];
                });
                front[0]->crowdingDistance = __DBL_MAX__;
                
                double minObj = front[0]->objectives[obj];
                double maxObj = front[front.size()-1]->objectives[obj];
                double range = maxObj - minObj;
                
                if(range == 0)
                    continue;
                
                for(unsigned int i = 1; i < front.size()-1; i++){
                    front[i]->crowdingDistance += (front[i+1]->objectives[obj] - front[i-1]->objectives[obj]) / range;
                }
            }

            for(unsigned int i = 0; i < front.size(); i++){
                front[i]->crowdingDistance = front[i]->crowdingDistance;
            }
        }
    }
}

GAResults MultiObjectiveGA::run() {
    GAResults results;
    return results;
}