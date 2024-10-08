#define MANUAL "manual.txt"

#include <iostream>
#include <vector>
#include <math.h>
#include <cstring>
#include <cstdlib>

#include "../../src/lib/misc/help.h"
#include "../../src/lib/ga/moga.h"


/*
    This example shows how to get the Pareto front of a multi-objective optimization problem.
    The  functions for the objectives are:
        f1(x) = x^2
        f2(x) = (x-2)^2
*/

int main(int argc, char **argv);


// The chromosome is a single real number, which is the variable x.
// The chromosome is initialized with a random float value between -10 and 10.
class VariableChromosome : public Chromosome {
    public:
        VariableChromosome() : Chromosome() {
            randomize();
        }

        std::string getName() const override {
            return "Single real number";
        }

        double getPhenotype() const {
            return x;
        }

        void printPhenotype() const override {
            std::cout << x << std::endl;
        }

        void crossover(Chromosome* other) override {
            VariableChromosome *otherCh = (VariableChromosome*) other;
            double otherX = otherCh->getPhenotype();
            x = (x + otherX) / 2.0;
        }

        void mutate() override {
            randomize();
        }

        void clone(const Chromosome* other) override {
            VariableChromosome *otherCh = (VariableChromosome*) other;
            x = otherCh->getPhenotype();   
        }

        std::vector<double> fitness;

    private:
        double x;
        inline void randomize() { x = uniform.random() * 20.0 - 10.0; }
};


// The fitness function is the multi-objective function we want to maximize.
// Unlike the single-objective case, the fitness function returns a vector of fitness values.
class SquareFitness : public MOFitness {
    public:
        std::string getName() const override {
            return "Multi-objective fitness function";
        }

        std::vector<double> evaluateMO(const Chromosome *chromosome) const {
            VariableChromosome *c = (VariableChromosome*) chromosome;
            double x = c->getPhenotype();
            double f1 = pow(x, 2);
            double f2 = pow(x - 2, 2);
            return {f1, f2};
        }

        VariableChromosome* generateChromosome() const override {
            VariableChromosome *ch = new VariableChromosome();
            ch->fitness = evaluateMO(ch);
            return ch;
        }
};



// These definitions allows to run the algorithm in a few steps, and let us 
// focus in the configuration parameters (hyperparameters).
int main(int argc, char **argv) {

    askedForHelp(argc, argv);

    MultiObjectiveGA *moga = new MultiObjectiveGA(new SquareFitness());

    // The configuration can be loaded directly from the program parameters.
    // See the manual for the list of arguments and how to use them.
    moga->setConfig(argc, argv); 
    moga->print();
    
    GAResults results = moga->run();
    results.print();

    return 0;
}

