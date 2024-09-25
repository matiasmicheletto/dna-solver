#define MANUAL "manual.txt"

#include <iostream>
#include "tests.h"

int main(int argc, char **argv) {
    srand(time(nullptr));
    testGene();
    testMutation();
    testCrossover();
    testFitness();
    return 0;
}

