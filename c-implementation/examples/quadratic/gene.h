#ifndef BOOL_GENE
#define BOOL_GENE

#include <cstdlib>
#include "../../src/lib/ga/gene.h"

class BoolGene : public Gene {
    public:    
        BoolGene() : Gene() {
            randomize();
        }

        inline void randomize() override{
            digit = (bool) (rand() % 2);
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

#endif // BOOL_GENE