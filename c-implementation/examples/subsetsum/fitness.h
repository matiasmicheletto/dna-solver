#ifndef SUBSETSUM_FITNESS
#define SUBSETSUM_FITNESS

#include <math.h>
#include "../../src/lib/ga/fitness.h"
#include "chromosome.h"


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

#endif // SUBSETSUM_FITNESS