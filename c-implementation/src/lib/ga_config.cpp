#include "ga_config.h"


GAConfig::GAConfig() : 
                populationSize(100), 
                maxGenerations(100), 
                mutationRate(0.1), 
                crossoverRate(0.8), 
                elitismRate(0.1),
                timeout(360),
                stagnationWindow(0.7),
                printLevel(0){

    OutputStream os(STREAM::CONSOLE);
    outputStream = os.getStream();
}


void GAConfig::setConfig(int argc, char **argv) {
    // Update the configuration with the command line arguments
    // Cannot update the fitness function here
    for (int i = 1; i < argc; i++) {
        if (strcmp(argv[i], "-p") == 0) {
            if(i+1 < argc){
                populationSize = atoi(argv[i + 1]);
            }else{
                std::cerr << "Error: Population size not provided" << std::endl;
                printHelp();
            }
        } else if (strcmp(argv[i], "-g") == 0) {
            if(i+1 < argc){
                maxGenerations = atoi(argv[i + 1]);
            }else{
                std::cerr << "Error: Max generations not provided" << std::endl;
                printHelp();
            }
        } else if (strcmp(argv[i], "-m") == 0) {
            if(i+1 < argc){
                mutationRate = atof(argv[i + 1]);
            }else{
                std::cerr << "Error: Mutation rate not provided" << std::endl;
                printHelp();
            }
        } else if (strcmp(argv[i], "-c") == 0) {
            if(i+1 < argc){
                crossoverRate = atof(argv[i + 1]);
            }else{
                std::cerr << "Error: Crossover rate not provided" << std::endl;
                printHelp();
            }
        } else if (strcmp(argv[i], "-e") == 0) {
            if(i+1 < argc){
                elitismRate = atof(argv[i + 1]);
            }else{
                std::cerr << "Error: Elitism rate not provided" << std::endl;
                printHelp();
            }
        } else if (strcmp(argv[i], "-t") == 0) {
            if(i+1 < argc){
                timeout = atoi(argv[i + 1]);
            }else{
                std::cerr << "Error: Timeout not provided" << std::endl;
                printHelp();
            }
        } else if (strcmp(argv[i], "-s") == 0) {
            if(i+1 < argc){
                stagnationWindow = atof(argv[i + 1]);
            }else{
                std::cerr << "Error: Stagnation window not provided" << std::endl;
                printHelp();
            }
        } else if (strcmp(argv[i], "-l") == 0) {
            if(i+1 < argc){
                printLevel = atoi(argv[i + 1]);
            }else{
                std::cerr << "Error: Print level not provided" << std::endl;
                printHelp();
            }
        } 
    }
}


void GAConfig::print()  {
        *outputStream << std::endl << "Genetic Algorithm Configuration" << std::endl;
        *outputStream << "  - Population size: " << populationSize << std::endl;
        *outputStream << "  - Max generations: " << maxGenerations << std::endl;
        *outputStream << "  - Timeout: " << timeout << " seconds." << std::endl;
        *outputStream << "  - Stagnation window: " << stagnationWindow*100 << "%" << std::endl;
        *outputStream << "  - Mutation rate: " << mutationRate << std::endl;
        *outputStream << "  - Crossover rate: " << crossoverRate << std::endl;
        *outputStream << "  - Elitism rate: " << elitismRate << std::endl << std::endl;
}