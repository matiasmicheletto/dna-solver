#ifndef BOOL_GENE
#define BOOL_GENE

#include <cstdlib>
#include "../../src/lib/ga/gene.h"

class BoolGene : public Gene {
    public:    
        BoolGene() : Gene() {
            randomize();
        }

        void randomize() override{
            digit = (bool) (rand() % 2);
        }

        void print() const override {
            std::cout << digit << " ";
        }

        bool getValue() const {
            return digit;
        }

    private:
        bool digit;
};

#endif // BOOL_GENE