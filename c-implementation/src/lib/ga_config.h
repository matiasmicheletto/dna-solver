#ifndef GA_CONFIG_H
#define GA_CONFIG_H

#include <iostream>
#include <cstring>


#include "./output_stream.h"
#include "fitness.h"
#include "./help.h"


class GAConfig {
    
    public:
        GAConfig();

        unsigned int populationSize;
        unsigned int maxGenerations;
        double mutationRate;
        double crossoverRate;
        double elitismRate;
        unsigned int timeout;
        double stagnationWindow;
        int printLevel;
        std::ostream *outputStream;

        void setConfig(int argc, char **argv);
        void print();
};

#endif // GA_CONFIG_H