#ifndef BINARY_STRING_CH
#define BINARY_STRING_CH

#include <iostream>
#include <vector>
#include <cstring>
#include "../../src/lib/ga/chromosome.h"
#include "gene.h"

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
            std::vector<Gene*> thisGenes = getGenes();
            for (unsigned int i = 0; i < otherGenes.size(); i++) {
                BoolGene *thisGene = (BoolGene*) thisGenes[i];
                BoolGene *otherGene = (BoolGene*) otherGenes[i];
                thisGene->setValue(otherGene->getValue());
            }
        }
    
    private:
        std::vector<unsigned int> *set;
};

#endif // BINARY_STRING_CH