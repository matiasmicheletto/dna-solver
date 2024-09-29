#include <iostream>
#include <fstream>
#include <string>

void printHelp() {
    std::ifstream manualFile(MANUAL_PATH); // Defined in the Makefile
    if (manualFile.is_open()) {
        std::string line;
        while (getline(manualFile, line)) {
            std::cout << line << std::endl;
        }
        manualFile.close();
    } else {
        std::cerr << "Error: Unable to open manual file at " << MANUAL_PATH << std::endl;
    }
    exit(1);
}
