#ifndef GENE_H
#define GENE_H

#include <iostream>
#include "./uniform.h"

class Gene { // Abstract class that models a gene
    public:
        virtual ~Gene(){}
        virtual void randomize() = 0;
        virtual void print() const = 0;

    protected:
        Gene() = default;
        Uniform uniform; //RANDOM
};

#endif // GENE_H