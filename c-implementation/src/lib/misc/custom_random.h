#ifndef CUSTOM_RANDOM_H
#define CUSTOM_RANDOM_H

#include <stdio.h>      /* printf, scanf, puts, NULL */
#include <stdlib.h>     /* srand, rand */
#include <time.h>       /* time */


/*
std::random_device rd;
std::mt19937 gen(rd());
std::uniform_real_distribution<> dis(0.0, 1.0);

double u_random() {
    return dis(gen);
}

double u_random(double to){
    double value = dis(gen)*to;
    return value;
}

double u_random(double from, double to){
    double value = from + dis(gen)*(to-from);
    return value;
}
*/




double u_random() {
    return rand() / (RAND_MAX + 1.0);
}

double u_random(double to){
    double value = rand() / (RAND_MAX + 1.0) * to;
    return value;
}

double u_random(double from, double to){
    double value = from + rand() / (RAND_MAX + 1.0) * (to-from);
    return value;
}

#endif