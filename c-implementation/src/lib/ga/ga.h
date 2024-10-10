// Class GeneticAlgorithm definition

#ifndef GENETIC_ALGORITHM
#define GENETIC_ALGORITHM

#include <iostream>
#include <vector>
#include <algorithm>
#include <chrono>
#include <math.h>
#include <cstring>
#include "fitness.h"

enum OUTPUTFORMAT {TXT, CSV, SVG};

struct GAConfig { // Configuration parameters for the Genetic Algorithm
    Fitness *fitnessFunction;
    unsigned int populationSize;
    unsigned int maxGenerations;
    double mutationRate;
    double crossoverRate;
    double elitismRate;
    unsigned int timeout;
    double stagnationWindow;
    int printLevel;
    OUTPUTFORMAT outputFormat;

    void print() {
        std::cout << std::endl << "Genetic Algorithm Configuration" << std::endl;
        if(fitnessFunction == nullptr)
            std::cout << "  - Fitness function: not set" << std::endl;
        else
            std::cout << "  - Fitness function: " << fitnessFunction->getName() << std::endl;
        std::cout << "  - Population size: " << populationSize << std::endl;
        std::cout << "  - Max generations: " << maxGenerations << std::endl;
        std::cout << "  - Timeout: " << timeout << " seconds." << std::endl;
        std::cout << "  - Stagnation window: " << stagnationWindow*100 << "%" << std::endl;
        std::cout << "  - Mutation rate: " << mutationRate << std::endl;
        std::cout << "  - Crossover rate: " << crossoverRate << std::endl;
        std::cout << "  - Elitism rate: " << elitismRate << std::endl << std::endl;
    }

    GAConfig() : 
        fitnessFunction(nullptr),
        populationSize(100), 
        maxGenerations(100), 
        mutationRate(0.1), 
        crossoverRate(0.8), 
        elitismRate(0.1),
        timeout(360),
        stagnationWindow(0.7),
        printLevel(0),
        outputFormat(TXT) {}
};

enum STATUS { // Stop condition for the Genetic Algorithm
    IDLE,
    RUNNING,
    MAX_GENERATIONS,
    TIMEOUT,
    STAGNATED
};

struct GAResults { // Results of the Genetic Algorithm
    Chromosome *best;
    double bestFitnessValue;
    unsigned int generations;
    std::vector<Chromosome*> paretoFront;
    STATUS status;
    int elapsed;

    void printStats() {
        std::cout << std::endl << "Generations: " << generations << std::endl;
        std::cout << "Elapsed time: " << elapsed << "ms" << std::endl;
        std::cout << "Stop condition: ";
        switch (status) {
            case IDLE:
                std::cout << "Idle" << std::endl;
                break;
            case RUNNING:
                std::cout << "Population evolving" << std::endl;
            case MAX_GENERATIONS:
                std::cout << "Max generations" << std::endl;
                break;
            case TIMEOUT:
                std::cout << "Timeout" << std::endl;
                break;
            case STAGNATED:
                std::cout << "Stagnation" << std::endl;
                break;
            default:
                std::cout << "Unknown" << std::endl;
        }
    }

    void printBest() {
        std::cout << std::endl << "Best fitness: " << bestFitnessValue << std::endl;
        std::cout << "Best chromosome:" << std::endl;
        std::cout << "  - ";
        best->printGenotype();
        std::cout << "  - ";
        best->printPhenotype();
    }

    void printPareto() {
        std::cout << "Pareto front: (";
        std::cout << paretoFront.size() << " individuals)" << std::endl;
        for (unsigned int i = 0; i < paretoFront.size(); i++) {
            std::cout << "x = ";
            paretoFront[i]->printPhenotype();
            std::cout << "  f(x) = {";
            for (unsigned int j = 0; j < paretoFront[i]->objectives.size(); j++) {
                std::cout << paretoFront[i]->objectives[j];
                if (j < paretoFront[i]->objectives.size() - 1)
                    std::cout << ", ";
            }
            std::cout << "}" << std::endl;
        }
    }

    void printCSV() {
        for (unsigned int i = 0; i < paretoFront.size(); i++) {
            for (unsigned int j = 0; j < paretoFront[i]->objectives.size(); j++) {
                std::cout << paretoFront[i]->objectives[j];
                if (j < paretoFront[i]->objectives.size() - 1)
                    std::cout << ",";
            }
            std::cout << std::endl;
        }
    }

    /*
    void printSVG() {
        std::cout << "<svg width=\"1000\" height=\"1000\">" << std::endl;
        // Draw axix
        std::cout << "<line x1=\"0\" y1=\"500\" x2=\"1000\" y2=\"500\" style=\"stroke:rgb(0,0,0);stroke-width:2\" />" << std::endl;

        // Draw dots
        for (unsigned int i = 0; i < paretoFront.size(); i++) {
            std::cout << "<circle cx=\"" << paretoFront[i]->objectives[0] * 10;
            std::cout << "\" cy=\"" << paretoFront[i]->objectives[1] * 10;
            std::cout << "\" r=\"5\" fill=\"red\" />" << std::endl;
        }

        std::cout << "</svg>" << std::endl;
    }
    */

    void printSVG() {
        const int width = 1000;
        const int height = 1000;
        const int axisOffset = 50;  // Offset for axes so the points don’t crowd the edges

        std::cout << "<svg width=\"" << width << "\" height=\"" << height << "\" xmlns=\"http://www.w3.org/2000/svg\">" << std::endl;

        // Draw axes
        std::cout << "<line x1=\"" << axisOffset << "\" y1=\"" << height / 2;
        std::cout << "\" x2=\"" << width - axisOffset << "\" y2=\"" << height / 2;
        std::cout << "\" style=\"stroke:black;stroke-width:2\" />" << std::endl;

        std::cout << "<line x1=\"" << axisOffset << "\" y1=\"" << axisOffset;
        std::cout << "\" x2=\"" << axisOffset << "\" y2=\"" << height - axisOffset;
        std::cout << "\" style=\"stroke:black;stroke-width:2\" />" << std::endl;

        // Draw grid lines (optional for better visualization)
        for (int i = 0; i <= 10; ++i) {
            int gridX = axisOffset + i * (width - 2 * axisOffset) / 10;
            int gridY = axisOffset + i * (height - 2 * axisOffset) / 10;

            std::cout << "<line x1=\"" << gridX << "\" y1=\"" << axisOffset << "\" x2=\"" << gridX << "\" y2=\"" << height - axisOffset << "\" style=\"stroke:lightgray;stroke-width:1\" />" << std::endl;
            std::cout << "<line x1=\"" << axisOffset << "\" y1=\"" << gridY << "\" x2=\"" << width - axisOffset << "\" y2=\"" << gridY << "\" style=\"stroke:lightgray;stroke-width:1\" />" << std::endl;
        }

        // Draw points (Pareto front)
        for (unsigned int i = 0; i < paretoFront.size(); ++i) {
            double x = paretoFront[i]->objectives[0] * 10 + axisOffset;  // Scale and offset
            double y = height - (paretoFront[i]->objectives[1] * 10 + axisOffset);  // Invert y-axis

            std::cout << "<circle cx=\"" << x << "\" cy=\"" << y << "\" r=\"5\" fill=\"red\" />" << std::endl;
        }

        // Optionally add axis labels (x and y objectives)
        std::cout << "<text x=\"" << width / 2 << "\" y=\"" << height - 20 << "\" font-size=\"16\" text-anchor=\"middle\">Objective 1</text>" << std::endl;
        std::cout << "<text x=\"20\" y=\"" << height / 2 << "\" font-size=\"16\" text-anchor=\"middle\" transform=\"rotate(-90 20," << height / 2 << ")\">Objective 2</text>" << std::endl;

        std::cout << "</svg>" << std::endl;
    }

};


class GeneticAlgorithm {
    public:
        GeneticAlgorithm();
        GeneticAlgorithm(Fitness *fitnessFunction, GAConfig config = GAConfig());
        
        ~GeneticAlgorithm();

        inline Chromosome* getChromosome(int index) { return population[index]; }

        void setConfig(GAConfig config);
        void setConfig(int argc, char **argv);
        void setFitnessFunction(Fitness *fitnessFunction);
        void setPopulation(std::vector<Chromosome*> population);

        virtual GAResults run();

        virtual void print();
    
    protected:
        GAConfig config;
        STATUS status;
        std::vector<Chromosome*> population;
        unsigned int elite;
        Uniform uniform;
        Chromosome *bestChromosome;
        double bestFitnessValue;

        unsigned int currentGeneration;
        unsigned int stagnatedGenerations;

        virtual void sortPopulation();
        void initialize();
        void clearPopulation();
        
        virtual void evaluation();
        virtual void selection();
        void crossover();
        void mutation();
};

#endif // GENETIC_ALGORITHM

