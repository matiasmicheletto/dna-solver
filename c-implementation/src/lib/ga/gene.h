#ifndef GENE_H
#define GENE_H

class Gene { // Abstract class that models a gene
    public:
        virtual ~Gene(){}
        virtual void copy(Gene *g) = 0;
        virtual void randomize() = 0;

    protected:
        Gene() = default;
};

#endif // GENE_H