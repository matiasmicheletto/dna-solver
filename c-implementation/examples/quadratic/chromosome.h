#ifndef BINARY_STRING_CH
#define BINARY_STRING_CH

#include <iostream>
#include <vector>
#include <cstring>
#include "util.h"
#include "../../src/lib/ga/chromosome.h"
#include "gene.h"

class BinaryStringCh : public Chromosome {
    public:
        BinaryStringCh(unsigned int size) : Chromosome(size) {
            for (unsigned int i = 0; i < size; i++) {
                genes.push_back(new BoolGene());
            }
        }

        ~BinaryStringCh() {
            for (Gene* gene : genes) {
                delete gene; // Free each BoolGene object
            }
        }

        double getValue() const {
            // Convert gene array to binary array and then to double
            std::vector<bool> binaryArray;
            for (Gene* gene : genes)
                binaryArray.push_back(((BoolGene*)gene)->getValue());
            return bin2Dbl(binaryArray);
        }

        void print() const override {
            std::cout << "Genotype: ";
            for (Gene* gene : genes) {
                gene->print();
            }
            std::cout << "-- Phenotype: " << getValue() << std::endl;
        }
};

#endif // BINARY_STRING_CH