#include <iostream>
#include <vector>
#include <cstring>
#include <cstdint>

double bin2Dbl(std::vector<bool> binaryArray) { // Convert the binary vector to a double
    if (binaryArray.size() != 64) {
        std::cerr << "Error: The input vector must have exactly 64 elements." << std::endl;
        return 0.0;
    }

    uint64_t binaryRepresentation = 0;

    // Convert the binary vector to a 64-bit integer
    for (int i = 0; i < 64; ++i) {
        if (binaryArray[i]) {
            binaryRepresentation |= (1ULL << (63 - i));
        }
    }

    // Interpret the 64-bit integer as a double
    double result;
    std::memcpy(&result, &binaryRepresentation, sizeof(result));

    return result;
}