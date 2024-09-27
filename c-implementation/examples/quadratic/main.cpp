#define MANUAL "manual.txt"

#include <iostream>
#include <vector>
#include <math.h>
#include <cstring>
#include <cstdlib>
#include "util.h"
#include "../../src/lib/ga/ga.h"

#define FLOAT_BITS 32

int main(int argc, char **argv);

class BoolGene : public Gene {
    public:    
        BoolGene() : Gene() {
            randomize();
        }

        inline void randomize() override{
            digit = uniform.random() < 0.5; //RANDOM
            //digit = u_random() < 0.5;
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

class BinaryStringCh : public Chromosome { // Models a float value using binary code
    public:
        BinaryStringCh(unsigned int size) : Chromosome(size) {
            // Generate random chromosome representing values between -100 and 100;
            const double value = uniform.random(-100.0, 100.0); // RANDOM
            //const double value = u_random(-100.0, 100.0);
            std::vector<bool> binary = flt2Bin(value);
            for (unsigned int i = 0; i < size; i++) {
                BoolGene *b = new BoolGene();
                b->setValue(binary[i]);
                genes.push_back(b);
            }
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

        void clone(const Chromosome& other) { // Copy the genes from another chromosome
            std::vector<Gene*> otherGenes = other.getGenes();
            std::vector<Gene*> thisGenes = getGenes();
            for (unsigned int i = 0; i < otherGenes.size(); i++) {
                BoolGene *thisGene = (BoolGene*) thisGenes[i];
                BoolGene *otherGene = (BoolGene*) otherGenes[i];
                thisGene->setValue(otherGene->getValue());
            }
        }
};

class QuadraticFitness : public Fitness {
    public:
        QuadraticFitness() : Fitness() {}

        std::string getName() const override {
            return "Quadratic function";
        }
        
        double evaluate(const Chromosome *chromosome) const override {
            // f(x) = -x^2 + 2x + 1; 
            BinaryStringCh *c = (BinaryStringCh*) chromosome;
            double x = (double) c->getPhenotype();
            double y = -1*pow(x, 2)+2*x+1; // max in (1, 2)
            if(std::isnan(y) || std::isinf(y))
                y = __DBL_MIN__;
            c->fitness = y;
            return y;
        }

        BinaryStringCh* generateChromosome() const override {
            BinaryStringCh *ch = new BinaryStringCh(FLOAT_BITS);
            ch->fitness = evaluate(ch);
            return ch;
        }
};


int main(int argc, char **argv) {

    GeneticAlgorithm *ga = new GeneticAlgorithm(new QuadraticFitness());

    ga->setConfig(argc, argv);
    ga->print();
    
    GAResults results = ga->run();
    results.print();

    delete ga;

    return 0;
}

