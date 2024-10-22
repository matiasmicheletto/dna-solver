#include <iostream>
#include <string.h>

#include "lib/help.h"

int main(int argc, char **argv) {
    for(int i = 0; i < argc; i++) {    
        if(strcmp(argv[i], "-h") == 0 || strcmp(argv[i], "--help") == 0 || argc == 1)
            printHelp();
    }
    return 0;
}
