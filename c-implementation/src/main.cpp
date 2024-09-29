#include "lib/misc/help.h"
#include "lib/ga/fitness.h"
#include "lib/ga/chromosome.h"
#include "lib/ga/gene.h"
#include "lib/ga/ga.h"

#include <iostream>
#include <string.h>

int main(int argc, char **argv) {
    for(int i = 0; i < argc; i++) {    
        if(strcmp(argv[i], "-h") == 0 || strcmp(argv[i], "--help") == 0 || argc == 1)
            printHelp();
    }
    return 0;
}
