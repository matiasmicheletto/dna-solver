#ifndef UNIFORM_H
#define UNIFORM_H

#include <random>

class Uniform {
    public:
        Uniform();
        ~Uniform();
        double random();
        double random(double to);
        double random(double from, double to);

    private:
        std::random_device rd;
        std::mt19937 gen;
        std::uniform_real_distribution<> dis;
};


#endif // UNIFORM_H