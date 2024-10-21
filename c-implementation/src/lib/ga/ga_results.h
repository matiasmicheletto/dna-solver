#ifndef GA_RESULTS_H
#define GA_RESULTS_H


#include <iostream>
#include <vector>

#include "../misc/output_stream.h"
#include "chromosome.h"

enum OUTPUTFORMAT {TXT, CSV, SVG, HTML};

enum STATUS { // Stop condition for the Genetic Algorithm
    IDLE,
    RUNNING,
    MAX_GENERATIONS,
    TIMEOUT,
    STAGNATED
};

enum OBJTYPE {SINGLE, MULTI};

class GAResults { // Results of the Genetic Algorithm

    public:
        GAResults(OBJTYPE type);
        Chromosome *best;
        double bestFitnessValue;
        unsigned int generations;
        std::vector<Chromosome*> paretoFront;
        STATUS status;
        int elapsed;
        std::ostream *outputStream;
        OUTPUTFORMAT outputFormat;

        void print();

    private:
        OBJTYPE type;

        void printStats();
        void printBest();
        void printPareto();
        void printCSV();
        void printSVG();
        void printHTML();
};

#endif // GA_RESULTS_H