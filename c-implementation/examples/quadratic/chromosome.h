#ifndef BINARY_STRING_CH
#define BINARY_STRING_CH

#include <iostream>
#include <vector>
#include <cstring>
#include "util.h"
#include "../../src/lib/ga/chromosome.h"
#include "gene.h"

#define CH_SIZE 32

class BinaryStringCh : public Chromosome { // Models a float value using binary code
    public:
        BinaryStringCh() : Chromosome(CH_SIZE) {
            // Generate random chromosome representing values between -100 and 100;
            const double value = (float)rand() / (float)RAND_MAX * 100.0 - 100.0;
            std::vector<bool> binary = flt2Bin(value);
            for (unsigned int i = 0; i < CH_SIZE; i++) {
                BoolGene *b = new BoolGene();
                b->setValue(binary[i]);
                genes.push_back(b);
            }
        }

        float getValue() const {
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

        void clone(const Chromosome& other) { // Copy the genes from another chromosome
            std::vector<Gene*> otherGenes = other.getGenes();
            std::vector<Gene*> thisGenes = getGenes();
            for (unsigned int i = 0; i < otherGenes.size(); i++) {
                BoolGene *thisGene = (BoolGene*) thisGenes[i];
                BoolGene *otherGene = (BoolGene*) otherGenes[i];
                thisGene->setValue(otherGene->getValue());
            }
        }

        void printPhenotype() const override {
            std::cout << "Phenotype: " << getValue() << std::endl;
        }
};

#endif // BINARY_STRING_CH