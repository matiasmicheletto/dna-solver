#include "ga.h"

GeneticAlgorithm::GeneticAlgorithm(GAConfig config) : config(config) {
    // Initialize population and sort by fitness
    for (unsigned int i = 0; i < config.populationSize; i++) {
        Chromosome *ch = config.fitnessFunction->generateChromosome();
        population.push_back(ch);
    }
    
    sortPopulation(); // Sort the population by fitness best to worse
}

GeneticAlgorithm::~GeneticAlgorithm() {}

void GeneticAlgorithm::sortPopulation() {
    std::sort(population.begin(), population.end(), [](Chromosome* a, Chromosome* b) {
        return a->fitness > b->fitness; // Sort in descending order
    });
}

void GeneticAlgorithm::evaluation() {
    for (unsigned int i = 0; i < config.populationSize; i++) {
        population[i]->fitness = config.fitnessFunction->evaluate(population[i]);
    }
}

void GeneticAlgorithm::selection() { // Roulette wheel selection
    
    // Keep the best chromosomes
    unsigned int elitism = config.elitismRate * config.populationSize;
    std::vector<Chromosome*> new_population;
    for (unsigned int i = 0; i < elitism; i++) {
        new_population.push_back(population[i]);
    }

    // Selection requires the fitness values to be positive
    // Calculate the sum of the shifted fitness values
    double minFitness = population[population.size() - 1]->fitness;
    double offset = std::abs(minFitness);
    double adjustedFitness[config.populationSize];
    double fitnessSum = 0.0;
    for (unsigned int i = 0; i < config.populationSize; i++) {
        adjustedFitness[i] = population[i]->fitness + offset + 1.0;
        fitnessSum += adjustedFitness[i];
    }

    // Select the best individuals between the rest of the population
    //for (unsigned int i = elitism; i < config.populationSize; i++) {
    unsigned int tries = 0;
    while(new_population.size() < config.populationSize){
        const double r = (double) rand() / (double) RAND_MAX * fitnessSum;
        double sum = 0.0;
        for (unsigned int j = elitism; j < config.populationSize; j++) {
            sum += adjustedFitness[j];
            if (sum >= r) {
                new_population.push_back(population[j]);
                break;
            }
        }
        tries++;
        if(tries > 1000){
            std::cout << "Error in selection" << std::endl;
            std::cout << "Min fitness: " << minFitness << " offset: " << offset << " fitnessSum: " << fitnessSum << std::endl;
            exit(1);
            break;
        }
    }

    // Update the population
    population = std::move(new_population);
}

void GeneticAlgorithm::crossover() {
    const int scale = config.crossoverRate*RAND_MAX; // To compare against rand()
    for (unsigned int i = 0; i < config.populationSize; i++) {
        if (rand() < scale) {
            unsigned int parent1 = rand() % config.populationSize;
            population[i]->crossover(population[parent1]);
        }
    }
}

void GeneticAlgorithm::mutation() {
    const int scale = config.mutationRate*RAND_MAX; // To compare against rand()
    for (unsigned int i = 0; i < config.populationSize; i++) {
        if (rand() < scale) {
            population[i]->mutate();
        }
    }
}

void GeneticAlgorithm::print() {
    for (unsigned int i = 0; i < config.populationSize; i++) {
        std::cout << "Chromosome " << i << ": " << population[i]->fitness << std::endl;
    }
}


GAResults GeneticAlgorithm::run() {

    std::cout << std::endl << "Started Genetic Algorithm..." << std::endl;
    GAResults results;
    double bestFitnessValue = __DBL_MIN__; // Maximization
    Chromosome *bestChromosome = config.fitnessFunction->generateChromosome();

    // Start chronometer
    auto start = std::chrono::high_resolution_clock::now();

    // Run the algorithm for the specified number of generations
    unsigned int currentGeneration = 0;
    while (currentGeneration < config.maxGenerations) {
        
        // GA steps
        selection(); // Select the best individual by roulette wheel method
        crossover(); // Apply crossover using single point method
        mutation(); // Perform mutation (all individuals are evaluated here)
        evaluation(); // Evaluate the new population
        sortPopulation(); // Sort the population from best to worst fitness

        auto elapsed = std::chrono::high_resolution_clock::now() - start; // Time in milliseconds
        double er = fabs((bestFitnessValue - population[0]->fitness)/(bestFitnessValue+1));

        std::cout << "Generation " 
            << currentGeneration << " - Current best: " << population[0]->fitness 
            << "\t Last best: " << bestFitnessValue
            << "\t Elapsed time: " << std::chrono::duration_cast<std::chrono::seconds>(elapsed).count() << "s" 
            << "\t Relative error: " << er << std::endl;


        ///// Check stop conditions ///////

        if (std::chrono::duration_cast<std::chrono::seconds>(elapsed).count() > config.timeout) {
            std::cout << "Timeout reached (" << config.timeout << "s)" << std::endl;
            results.stop_condition = TIMEOUT;
            break;
        }

        if(er < config.stagnationThreshold){
            std::cout << "Stagnation reached Er. = " << er << " Thres. = " << config.stagnationThreshold << std::endl;
            results.stop_condition = STAGNATION;
            break;
        }else{
            if(population[0]->fitness > bestFitnessValue){
                bestFitnessValue = population[0]->fitness;
                bestChromosome->clone(*population[0]);
            } 
        }

        currentGeneration++;
    }

    if (currentGeneration >= config.maxGenerations) {
        std::cout << "Max generations reached (" << config.maxGenerations << ")" << std::endl;
        results.stop_condition = MAX_GENERATIONS;
    }

    results.best = bestChromosome;
    results.bestFitnessValue = bestFitnessValue;
    results.generations = currentGeneration;

    return results;
}
