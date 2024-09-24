#ifndef QUADRATIC_FITNESS
#define QUADRATIC_FITNESS

#include <cmath>
#include "../../src/lib/ga/fitness.h"
#include "chromosome.h"

class QuadraticFitness : public Fitness {
    public:
        QuadraticFitness() : Fitness() {}

        std::string getName() const override {
            return "Quadratic function";
        }
        
        double evaluate(const Chromosome *chromosome) const override {
            // f(x) = -x^2 + 2x + 1; 
            BinaryStringCh *c = (BinaryStringCh*) chromosome;
            double x = (double) c->getValue();
            double y = -1*pow(x, 2)+2*x+1; // max in (1, 2)
            if(std::isnan(y) || std::isinf(y))
                y = __DBL_MIN__;
            c->fitness = y;
            return y;
        }

        BinaryStringCh* generateChromosome() const override {
            BinaryStringCh *ch = new BinaryStringCh();
            ch->fitness = evaluate(ch);
            return ch;
        }
};

#endif // QUADRATIC_FITNESS