#define MANUAL "manual.txt"

#include <iostream>
#include <vector>
#include <math.h>
#include <cstring>
#include <cstdlib>

#include "../../src/lib/ga/help.h"
#include "../../src/lib/ga/moga.h"


/*
    Example 1 shows how to get the Pareto front of a multi-objective optimization problem.
    The  functions for the objectives are:
        f1(x) = x^2
        f2(x) = (x-2)^2

    Example 2 shows how to get the Pareto front for the following objectives:
        f1(x) = 2(x-1) + 1
        f2(x) = 2(x-3)^2 + 1
*/

int main(int argc, char **argv);


// The chromosome is a single real number, which is the variable x.
// The chromosome is initialized with a random float value between -10 and 10.
class RealNumberCh : public Chromosome {
    public:
        RealNumberCh() : Chromosome() {
            randomize();
        }

        std::string getName() const override {
            return "Single real number";
        }

        double getPhenotype() const {
            return x;
        }

        void printPhenotype() const override {
            std::cout << x;
        }

        void printGenotype() const override {
            std::cout << "Genotype: " << x << std::endl;
        }

        void crossover(Chromosome* other) override {
            RealNumberCh *otherCh = (RealNumberCh*) other;
            double otherX = otherCh->getPhenotype();
            x = (x + otherX) / 2.0;
        }

        void mutate() override {
            randomize();
        }

        void clone(const Chromosome* other) override {
            RealNumberCh *otherCh = (RealNumberCh*) other;
            x = otherCh->getPhenotype();   
            objectives = otherCh->objectives;
        }

    private:
        double x;
        inline void randomize() { x = uniform.random() * 20.0 - 10.0; }
};

// Example 1
// The fitness function is the multi-objective function we want to maximize.
// Unlike the single-objective case, the fitness function returns a vector of fitness values.
class MOFitnessExample1 : public Fitness {
    public:
        std::string getName() const override {
            return "f(x) = {x^2, (x-2)^2}";
        }

        void evaluate(Chromosome *chromosome) const {
            RealNumberCh *c = (RealNumberCh*) chromosome;
            double x = c->getPhenotype();
            double f1 = pow(x, 2);
            double f2 = pow(x - 2, 2);
            c->objectives = {f1, f2};
        }

        RealNumberCh* generateChromosome() const override {
            RealNumberCh *ch = new RealNumberCh();
            evaluate(ch);
            return ch;
        }
};


// Example 2
class MOFitnessExample2 : public Fitness {
    public:
        std::string getName() const override {
            return "f(x) = {2(x-1) + 1, 2(x-3)^2 + 1}";
        }

        void evaluate(Chromosome *chromosome) const {
            RealNumberCh *c = (RealNumberCh*) chromosome;
            double x = c->getPhenotype();
            double f1 = 2*(x-1) + 1;
            double f2 = 2*pow(x-3, 2) + 1;
            c->objectives = {f1, f2};
        }

        RealNumberCh* generateChromosome() const override {
            RealNumberCh *ch = new RealNumberCh();
            evaluate(ch);
            return ch;
        }
};


int main(int argc, char **argv) {

    // Check for help flag
    for (int i = 1; i < argc; i++) {
        if (strcmp(argv[i], "-h") == 0 || strcmp(argv[i], "--help") == 0) {
            printHelp();
        }
    }

    GAConfig* config = new GAConfig();
    config->setConfig(argc, argv); // Set the configuration with the command line arguments

    MultiObjectiveGA *moga = new MultiObjectiveGA(new MOFitnessExample1(), config);
    GAResults results = moga->run();

    // Set the output format with the command line arguments
    // Values are "txt", "csv", "svg", "html". Default is "txt"
    results.setConfig(argc, argv); 
    results.print();

    return 0;
}

