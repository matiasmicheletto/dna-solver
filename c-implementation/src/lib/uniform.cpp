#include "uniform.h"

Uniform::Uniform() {
    gen = std::mt19937(rd());
    dis = std::uniform_real_distribution<>(0.0, 1.0);
}

Uniform::~Uniform() {}

double Uniform::random() {
    return dis(gen);
}

double Uniform::random(double to) {
    double value = dis(gen) * to;
    return value;
}

double Uniform::random(double from, double to) {
    double value = from + dis(gen) * (to - from);
    return value;
}