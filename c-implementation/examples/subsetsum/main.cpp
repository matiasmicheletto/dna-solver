#include <iostream>
#include <cstdlib>
#include <vector>
#include <cstring>
#include <math.h>

#include "../../src/lib/misc/help.h"
#include "../../src/lib/misc/uniform.h" //RANDOM
#include "../../src/lib/ga/ga.h"

#define SET_SIZE 25

class BoolGene : public Gene {
    public:    
        BoolGene() : Gene() {
            randomize();
        }

        inline void randomize() override{
            //digit = u_random() < 0.5;
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

class BinaryStringCh : public Chromosome { // Models a float value using binary code
    public:
        BinaryStringCh(std::vector<unsigned int> *set) : Chromosome(set->size()) {
            this->set = set;
            unsigned int size = set->size();
            for (unsigned int i = 0; i < size; i++) {
                BoolGene *ig = new BoolGene();
                genes.push_back(ig);
            }
        }

        unsigned int getPhenotype() const { // Sums selected (active genes) values from the set
            unsigned int sum = 0;
            for (unsigned int i = 0; i < genes.size(); i++) {
                BoolGene *gene = (BoolGene*) genes[i];
                if (gene->getValue()) {
                    sum += set->at(i);
                }
            }
            return sum;
        }

        void printGenotype() const override {
            std::cout << "Genotype: ";
            for (Gene* gene : genes) {
                gene->print();
            }
            std::cout << std::endl;
        }

        void printPhenotype() const override {
            std::cout << "Phenotype: Subset = ";
            for (unsigned int i = 0; i < genes.size(); i++) {
                BoolGene *gene = (BoolGene*) genes[i];
                if (gene->getValue()) {
                    std::cout << set->at(i) << " ";
                }
            }
            std::cout << "- Sum = " << getPhenotype() << std::endl;
        }

        void clone(const Chromosome& other) { // Copy the genes from another chromosome
            std::vector<Gene*> otherGenes = other.getGenes();
            // To access the child class methods, we need to cast the genes
            std::vector<Gene*> thisGenes = getGenes(); 
            for (unsigned int i = 0; i < otherGenes.size(); i++) {
                
                //BoolGene *thisGene = (BoolGene*) thisGenes[i];
                //BoolGene *otherGene = (BoolGene*) otherGenes[i];
                //thisGene->setValue(otherGene->getValue()); 

                BoolGene *thisGene = dynamic_cast<BoolGene*>(thisGenes[i]);
                BoolGene *otherGene = dynamic_cast<BoolGene*>(otherGenes[i]);
                if (thisGene && otherGene) {
                    thisGene->setValue(otherGene->getValue());
                } else {
                    std::cerr << "Gene cast failed" << std::endl;
                }
            }
        }
    
    private:
        std::vector<unsigned int> *set;
};

class SubSetSumFitness : public Fitness {
    public:
        SubSetSumFitness(std::vector<unsigned int> *set, long int target) : Fitness() {
            this->set = set;
            this->target = target;
        }

        std::string getName() const override {
            return "Quadratic function";
        }
        
        double evaluate(const Chromosome *chromosome) const override {
            BinaryStringCh *c = (BinaryStringCh*) chromosome;
            unsigned int subSetSize = 0;
            for(unsigned int i = 0; i < set->size(); i++){
                BoolGene *gene = (BoolGene*) c->getGenes()[i];
                if(gene->getValue()){
                    subSetSize++;
                }
            }
            const long int error = (long int)c->getPhenotype() - (long int)target;
            const double sizeCost = (double)subSetSize/(double)set->size();
            return abs(100.0 / ((double) abs(error) + 1.0) - sizeCost);
        }

        BinaryStringCh* generateChromosome() const override {
            BinaryStringCh *ch = new BinaryStringCh(set);
            ch->fitness = evaluate(ch);
            return ch;
        }
    
    private:
        std::vector<unsigned int> *set;
        unsigned int target;
};


int main(int argc, char **argv) {

    for (int i = 1; i < argc; i++) {
        if (strcmp(argv[i], "-h") == 0 || strcmp(argv[i], "--help") == 0) {
            printHelp();
            return 0;
        }
    }

    // Target
    Uniform uniform;
    unsigned int target = (unsigned int) uniform.random(100, 200);
    
    // Generate set
    std::vector<unsigned int> set;
    for (int i = 0; i < SET_SIZE; i++) {
        unsigned int n = (unsigned int) uniform.random(1, 100);
        //unsigned int n = (unsigned int) u_random(1, 100);
        set.push_back(n);
    }

    std::cout << std::endl << "Set: ";
    for (unsigned int i = 0; i < SET_SIZE; i++) {
        std::cout << set[i] << " ";
    }
    std::cout << std::endl;
    std::cout << "Target: " << target << std::endl;


    GeneticAlgorithm *ga = new GeneticAlgorithm(new SubSetSumFitness(&set, target));
    ga->setConfig(argc, argv);
    ga->print();

    GAResults results = ga->run();
    results.print();

    delete ga;

    return 0;
}