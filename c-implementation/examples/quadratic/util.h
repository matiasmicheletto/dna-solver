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

std::vector<bool> dbl2Bin(double value) {
    // Create a vector of 64 boolean values, initialized to false
    std::vector<bool> binaryArray(64, false);

    // Interpret the double value as a 64-bit integer
    uint64_t binaryRepresentation;
    std::memcpy(&binaryRepresentation, &value, sizeof(binaryRepresentation));

    // Convert the 64-bit integer to a binary vector
    for (int i = 0; i < 64; ++i) {
        binaryArray[63 - i] = (binaryRepresentation & (1ULL << i)) != 0;
    }

    return binaryArray;
}

float bin2Flt(std::vector<bool> binaryArray) {
    if (binaryArray.size() != 32) {
        std::cerr << "Error: The input vector must have exactly 32 elements." << std::endl;
        return 0.0f;
    }

    uint32_t binaryRepresentation = 0;

    // Convert the binary vector to a 32-bit integer
    for (int i = 0; i < 32; ++i) {
        if (binaryArray[i]) {
            binaryRepresentation |= (1U << (31 - i));
        }
    }

    // Interpret the 32-bit integer as a float
    float result;
    std::memcpy(&result, &binaryRepresentation, sizeof(result));

    return result;
}

std::vector<bool> flt2Bin(float value) {
    // Create a vector of 32 boolean values, initialized to false
    std::vector<bool> binaryArray(32, false);

    // Interpret the float value as a 32-bit integer
    uint32_t binaryRepresentation;
    std::memcpy(&binaryRepresentation, &value, sizeof(binaryRepresentation));

    // Convert the 32-bit integer to a binary vector
    for (int i = 0; i < 32; ++i) {
        binaryArray[31 - i] = (binaryRepresentation & (1U << i)) != 0;
    }

    return binaryArray;
}