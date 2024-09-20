#ifndef QUADRATIC_FITNESS
#define QUADRATIC_FITNESS

#include <cmath>
#include "../../src/lib/ga/fitness.h"
#include "chromosome.h"

class QuadraticFitness : public Fitness {
    public:
        QuadraticFitness() : Fitness() {
            gene_size = 64;
        }

        std::string getName() const override {
            return "Quadratic function";
        }
        
        double evaluate(const Chromosome *chromosome) const override {
            BinaryStringCh *c = (BinaryStringCh*) chromosome;
            double x = c->getValue();
            return -1 * pow(x, 2) + 2 * x + 1;
        }

        BinaryStringCh* generateChromosome() const override {
            BinaryStringCh *ch = new BinaryStringCh(gene_size);
            ch->fitness = evaluate(ch);
            return ch;
        }
};

#endif // QUADRATIC_FITNESS