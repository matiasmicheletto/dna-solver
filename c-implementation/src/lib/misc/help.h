#include <iostream>
#include <fstream>

void printHelp(const char* file) { // Open readme file with manual and print on terminal   
    std::ifstream manualFile(file);
    if (manualFile.is_open()) {
        std::string line;
        while (getline(manualFile, line)) {
            std::cout << line << std::endl;
        }
        manualFile.close();
    } else {
        std::cerr << "Error: Unable to open manual file." << std::endl;
    }
    exit(1);
}