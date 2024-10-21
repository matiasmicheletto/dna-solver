#define MANUAL "manual.txt"

#include <iostream>
#include <vector>
#include <math.h>
#include <cstring>
#include <cstdlib>
#include "util.h"
#include "../../src/lib/ga/help.h"
#include "../../src/lib/ga/ga.h"


/*
    This example shows how to find the maximum of a quadratic function.
    The function is f(x) = -x^2 + 2x + 1, which has a maximum in x = 1.
    The chromosome is a binary string representing a float value between -100 and 100. 
*/

// We are using a float representation (32 bit) for the x variable.
#define FLOAT_BITS 32

int main(int argc, char **argv);

// First, we define the gene, which is the minimal unit of a chromosome.
// In this case, it consist of a single boolean value.
// This may seem like an overkill, but later we'll see that the chromosome 
// class works with Gene type objects, to ease the problem modelling.
class BoolGene : public Gene {
    public:    
        BoolGene() : Gene() {
            randomize();
        }

        inline void randomize() override{
            digit = uniform.random() < 0.5; //RANDOM
        }

        inline void print() const override {
            std::cout << digit << " ";
        }

        inline bool getValue() const {
            return digit;
        }

        inline void setValue(bool value) {
            digit = value;
        }

    private:
        bool digit;
};


// The chromosome class is a container for genes. It is basically an array of genes, 
// which is the genotype, and it models a float number, which is its phenotype, using binary
// to float conversion.
// The chromosome is initialized with a random float value between -100 and 100.
// Crossover and mutation operators are implemented in the base class, and thats why
// we defined genes instead of directly using the chromosome class.
class BinaryStringCh : public Chromosome { // Models a float value using binary code
    public:
        BinaryStringCh(double mutProb) : Chromosome(mutProb) {
            // Generate random chromosome representing values between -100 and 100;
            const double value = uniform.random(-100.0, 100.0);
            std::vector<bool> binary = flt2Bin(value);
            for (unsigned int i = 0; i < FLOAT_BITS; i++) {
                BoolGene *b = new BoolGene();
                b->setValue(binary[i]);
                genes.push_back(b);
            }
        }

        std::string getName() const override {
            return "Binary float value";
        }

        float getPhenotype() const {
            // Convert gene array to binary array and then to double
            std::vector<bool> binaryArray;
            for (Gene* gene : genes)
                binaryArray.push_back(((BoolGene*)gene)->getValue());
            return bin2Flt(binaryArray);
        }

        void printGenotype() const override {
            std::cout << "Genotype: ";
            for (Gene* gene : genes) {
                gene->print();
            }
            std::cout << std::endl;
        }

        void printPhenotype() const override {
            std::cout << "Phenotype: " << getPhenotype() << std::endl;
        }

        void clone(const Chromosome* other) { // Copy the genes from another chromosome
            std::vector<Gene*> otherGenes = other->getGenes();
            std::vector<Gene*> thisGenes = getGenes();
            for (unsigned int i = 0; i < otherGenes.size(); i++) {
                BoolGene *thisGene = (BoolGene*) thisGenes[i];
                BoolGene *otherGene = (BoolGene*) otherGenes[i];
                thisGene->setValue(otherGene->getValue());
            }
            fitness = other->fitness;
        }
};

// The fitness function is the quadratic function we want to maximize.
// This function models the problem, it is the only input required by the genetic algorithm,
// and as the algorithm needs to initialize its population, the fitness function is in charge of
// providing the constructors for the chromosomes, and their fitness values. 
class QuadraticFitness : public Fitness {
    public:
        QuadraticFitness() : Fitness() {}

        std::string getName() const override {
            return "f(x) = -x^2 + 2x + 1";
        }
        
        void evaluate(Chromosome *chromosome) const override {
            // f(x) = -x^2 + 2x + 1; 
            BinaryStringCh *c = (BinaryStringCh*) chromosome;
            double x = (double) c->getPhenotype();
            double y = -1*pow(x, 2)+2*x+1; // max in (1, 2)
            if(std::isnan(y) || std::isinf(y))
                y = __DBL_MIN__;
            c->fitness = y;
        }

        BinaryStringCh* generateChromosome() const override {
            double mutProb = 10.0/(double)FLOAT_BITS;
            BinaryStringCh *ch = new BinaryStringCh(mutProb);
            evaluate(ch);
            return ch;
        }
};

// These definitions allows to run the algorithm in a few steps, and let us 
// focus in the configuration parameters (hyperparameters).
int main(int argc, char **argv) {

    askedForHelp(argc, argv);

    GAConfig* config = new GAConfig();
    config->setConfig(argc, argv); 

    GeneticAlgorithm *ga = new GeneticAlgorithm(new QuadraticFitness(), config);

    ga->print();
    
    GAResults results = ga->run();

    results.print();

    std::cout << "Error fitness: " << results.best->fitness - 2.0 << std::endl;
    std::cout << "Error phenotype: " << ((BinaryStringCh*) results.best)->getPhenotype() - 1.0 << std::endl;


    return 0;
}

