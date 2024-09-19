#ifndef CUSTOM_GENE
#define CUSTOM_GENE

#include <cstdlib>
#include "../ga/gene.h"

class CustomGene : public Gene {
    public:    
        CustomGene() : Gene() {
            digit = false;
        }

        void copy(Gene *g) override {
            CustomGene* c = dynamic_cast<CustomGene*>(g);
            if (c) {
                digit = c->digit;    
            }
        }

        void randomize() override{
            digit = rand() % 2;
        }

        bool getValue() const {
            return digit;
        }

    private:
        bool digit;
};

#endif // CUSTOM_GENE