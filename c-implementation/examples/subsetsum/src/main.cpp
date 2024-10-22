#include "../../src/lib/ga/help.h"
#include "../../src/lib/ga/uniform.h"
#include "../../src/lib/ga/ga.h"

#define SET_SIZE 20

class BoolGene : public Gene {
    public:    
        BoolGene() : Gene() {
            randomize();
        }

        inline void randomize() override{
            //digit = u_random() < 0.5;
            digit = uniform.random() < 0.5; //RANDOM
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

class BinaryStringCh : public Chromosome { // Models a float value using binary code
    public:
        BinaryStringCh(std::vector<unsigned int> *set, double mutProb) : Chromosome(mutProb) {
            this->set = set;
            unsigned int size = set->size();
            for (unsigned int i = 0; i < size; i++) {
                BoolGene *ig = new BoolGene();
                genes.push_back(ig);
            }
        }

        std::string getName() const override {
            return "Subset selection array";
        }

        unsigned int getPhenotype() const { // Sums selected (active genes) values from the set
            unsigned int sum = 0;
            for (unsigned int i = 0; i < genes.size(); i++) {
                BoolGene *gene = (BoolGene*) genes[i];
                if (gene->getValue()) {
                    sum += set->at(i);
                }
            }
            return sum;
        }

        void printGenotype() const override {
            std::cout << "Genotype: ";
            for (Gene* gene : genes) {
                gene->print();
            }
            std::cout << std::endl;
        }

        void printPhenotype() const override {
            std::cout << "Phenotype: Subset = ";
            for (unsigned int i = 0; i < genes.size(); i++) {
                BoolGene *gene = (BoolGene*) genes[i];
                if (gene->getValue()) {
                    std::cout << set->at(i) << " ";
                }
            }
            std::cout << "- Sum = " << getPhenotype() << std::endl;
        }

        void clone(const Chromosome* other) { // Copy the genes from another chromosome
            std::vector<Gene*> otherGenes = other->getGenes();
            // To access the child class methods, we need to cast the genes
            std::vector<Gene*> thisGenes = getGenes(); 
            for (unsigned int i = 0; i < otherGenes.size(); i++) {
                BoolGene *thisGene = dynamic_cast<BoolGene*>(thisGenes[i]);
                BoolGene *otherGene = dynamic_cast<BoolGene*>(otherGenes[i]);
                if (thisGene && otherGene) {
                    thisGene->setValue(otherGene->getValue());
                } else {
                    std::cerr << "Gene cast failed" << std::endl;
                }
            }
            fitness = other->fitness;
        }
    
    private:
        std::vector<unsigned int> *set;
};

class SubSetSumFitness : public Fitness {
    public:
        SubSetSumFitness(std::vector<unsigned int> *set, long int target) : Fitness() {
            this->set = set;
            this->target = target;
        }

        std::string getName() const override {
            return "Subset sum function";
        }
        
        void evaluate(Chromosome *chromosome) const override {
            BinaryStringCh *c = (BinaryStringCh*) chromosome;
            unsigned int subSetSize = 0;
            for(unsigned int i = 0; i < set->size(); i++){
                BoolGene *gene = (BoolGene*) c->getGenes()[i];
                if(gene->getValue()){
                    subSetSize++;
                }
            }
            const double error = abs((double) c->getPhenotype() - (double) target);
            //const double sizeCost = (double)subSetSize/(double)set->size();

            c->fitness = abs(100.0 / (error + 1.0));
        }

        BinaryStringCh* generateChromosome() const override {
            BinaryStringCh *ch = new BinaryStringCh(set, 10.0/(double)set->size());
            evaluate(ch);
            return ch;
        }
    
    private:
        std::vector<unsigned int> *set;
        unsigned int target;
};


int main(int argc, char **argv) {

    // Check for help flag
    for (int i = 1; i < argc; i++) {
        if (strcmp(argv[i], "-h") == 0 || strcmp(argv[i], "--help") == 0) {
            printHelp();
        }
    }

    // Target
    Uniform uniform;
    unsigned int target = (unsigned int) uniform.random(100, 200);
    
    // Generate set
    std::vector<unsigned int> set;
    for (int i = 0; i < SET_SIZE; i++) {
        unsigned int n = (unsigned int) uniform.random(1, 100);
        set.push_back(n);
    }

    std::cout << std::endl << "Set: ";
    for (unsigned int i = 0; i < SET_SIZE; i++) {
        std::cout << set[i] << " ";
    }
    std::cout << std::endl;
    std::cout << "Target: " << target << std::endl;

    GAConfig* config = new GAConfig();
    config->setConfig(argc, argv); 

    GeneticAlgorithm *ga = new GeneticAlgorithm(new SubSetSumFitness(&set, target), config);
    
    ga->print();

    GAResults results = ga->run();
    
    results.print();

    std::cout << "Error: " << ((BinaryStringCh*) results.best)->getPhenotype() - target << std::endl;

    return 0;
}
