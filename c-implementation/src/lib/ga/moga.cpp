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
            if (dominates(population[i], population[j])) {
                population[i]->dominatedChromosomes.push_back(population[j]);
            } else if (dominates(population[j], population[i])) {
                population[i]->dominationCount++;
            }
        }
        if (population[i]->dominationCount == 0) {
            if (paretoFronts.empty()) 
                paretoFronts.emplace_back();  // Create the first front if needed
            else
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
    for (unsigned int i = 0; i < config->populationSize; i++) {
        fitnessFunction->evaluate(population[i]);
    }
}

void MultiObjectiveGA::selection() { // Crowding distance
    std::vector<Chromosome*> newPopulation;

    // Crowding distance calculation
    for(std::vector<Chromosome*> front : paretoFronts){
        if(newPopulation.size() + front.size() <= config->populationSize){
            newPopulation.insert(newPopulation.end(), front.begin(), front.end());
            continue;
        } else { // Compute crowding distance for the current front
            for(unsigned int obj = 0; obj < front[0]->objectives.size(); obj++){
                std::sort(front.begin(), front.end(), [obj](Chromosome* a, Chromosome* b){
                    return a->objectives[obj] < b->objectives[obj];
                });
                front[0]->crowdingDistance = __DBL_MAX__;
                front[front.size()-1]->crowdingDistance = __DBL_MAX__;
                
                double minObj = front[0]->objectives[obj];
                double maxObj = front[front.size()-1]->objectives[obj];
                double range = maxObj - minObj;

                if(range == 0.0) 
                    continue;
                
                for(unsigned int i = 1; i < front.size()-1; i++){ 
                    front[i]->crowdingDistance += (front[i+1]->objectives[obj] - front[i-1]->objectives[obj]) / range;
                }
            }
        }
    }

    // Fill the rest of the population with the best individuals
    std::sort(newPopulation.begin(), newPopulation.end(), [](Chromosome* a, Chromosome* b){
        return a->crowdingDistance > b->crowdingDistance;
    });

    for(unsigned int i = newPopulation.size(); i < config->populationSize; i++){
        newPopulation.push_back(population[i]);
    }
    
    for(unsigned int i = 0; i < config->populationSize; i++){
        population[i] = newPopulation[i];
    }    
}

void MultiObjectiveGA::print() {

    if(config->printLevel < 0 || config->printLevel > 3){
        std::cerr << "Invalid print level" << std::endl;
        return;
    }

    if(config->printLevel >= 0)
        config->print();

    if(config->printLevel >= 1){
        if(population.size() == 0){
            std::cout << "Population not initialized" << std::endl;
            return;
        }
    }
    if(config->printLevel >= 2){
        std::cout << "Population objectives: " << std::endl;        
        for (unsigned int i = 0; i < paretoFronts[0].size(); i++) {
            std::cout << "Chromosome " << i << ": " << std::endl;
            for(unsigned int j = 0; j < paretoFronts[0][i]->objectives.size(); j++){
                std::cout << "    Objective " << j << ": " << paretoFronts[0][i]->objectives[j] << std::endl;
            }
        }
    }
    if(config->printLevel >= 3){
        std::cout << "Population genes: " << std::endl;
        for (unsigned int i = 0; i < paretoFronts[0].size(); i++) {
            paretoFronts[0][i]->printGenotype();
            paretoFronts[0][i]->printPhenotype();
        }
    }
}

GAResults MultiObjectiveGA::run() { // Try to avoid overriding this method
    GAResults results(OBJTYPE::MULTI);

    if (fitnessFunction == nullptr) {
        std::cerr << "Run: Fitness function not set" << std::endl;
        return results;
    }

    if (population.size() == 0) {
        std::cerr << "Population not initialized" << std::endl;
        return results;
    }

    status = STATUS::RUNNING;
    currentGeneration = 0;
    
    // Start the timer
    auto start = std::chrono::high_resolution_clock::now();
    
    while(status == STATUS::RUNNING) {

        // GA steps
        sortPopulation();
        selection();
        crossover();
        mutation();
        evaluation();


        ///// Check stop conditions ///////

        auto elapsed = std::chrono::high_resolution_clock::now() - start; // Time in milliseconds
        if (std::chrono::duration_cast<std::chrono::seconds>(elapsed).count() > config->timeout) {
            //*config->outputStream << "Timeout reached (" << config->timeout << "s)" << std::endl;
            status = STATUS::TIMEOUT;
            break;
        }

        currentGeneration++;
        if(currentGeneration >= config->maxGenerations){
            //*config->outputStream << "Max generations reached (" << config->maxGenerations << ")" << std::endl;
            status = STATUS::MAX_GENERATIONS;
            break;
        }
    }

    auto end = std::chrono::high_resolution_clock::now();
    auto duration = std::chrono::duration_cast<std::chrono::milliseconds>(end - start); // Convert to milliseconds

    results.status = status;
    results.paretoFront = paretoFronts[0];
    results.generations = currentGeneration;
    results.elapsed = static_cast<int>(duration.count());

    return results;
}