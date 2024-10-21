#include "ga_results.h"

GAResults::GAResults(OBJTYPE type) {
    this->type = type;
    best = nullptr;
    bestFitnessValue = 0;
    generations = 0;
    status = IDLE;
    elapsed = 0;
    outputFormat = TXT;

    OutputStream os(streams::STREAM::CONSOLE);
    outputStream = os.getStream();
}

void GAResults::printStats() {
    *outputStream << std::endl << "Generations: " << generations << std::endl;
    *outputStream << "Elapsed time: " << elapsed << "ms" << std::endl;
    *outputStream << "Stop condition: ";
    switch (status) {
        case IDLE:
            *outputStream << "Idle" << std::endl;
            break;
        case RUNNING:
            *outputStream << "Population evolving" << std::endl;
        case MAX_GENERATIONS:
            *outputStream << "Max generations" << std::endl;
            break;
        case TIMEOUT:
            *outputStream << "Timeout" << std::endl;
            break;
        case STAGNATED:
            *outputStream << "Stagnation" << std::endl;
            break;
        default:
            *outputStream << "Unknown" << std::endl;
    }
}

void GAResults::printBest() {
    *outputStream << std::endl << "Best fitness: " << bestFitnessValue << std::endl;
    *outputStream << "Best chromosome:" << std::endl;
    *outputStream << "  - ";
    best->printGenotype();
    *outputStream << "  - ";
    best->printPhenotype();
}

void GAResults::printPareto() {
    if(paretoFront.size() == 0) {
        *outputStream << "Not valid Pareto front." << std::endl;
        return;
    }

    *outputStream << "Pareto front: (";
    *outputStream << paretoFront.size() << " individuals)" << std::endl;
    for (unsigned int i = 0; i < paretoFront.size(); i++) {
        *outputStream << "x = ";
        paretoFront[i]->printPhenotype();
        *outputStream << "  f(x) = {";
        for (unsigned int j = 0; j < paretoFront[i]->objectives.size(); j++) {
            *outputStream << paretoFront[i]->objectives[j];
            if (j < paretoFront[i]->objectives.size() - 1)
                *outputStream << ", ";
        }
        *outputStream << "}" << std::endl;
    }
}

void GAResults::printCSV() {
    for (unsigned int i = 0; i < paretoFront.size(); i++) {
        for (unsigned int j = 0; j < paretoFront[i]->objectives.size(); j++) {
            *outputStream << paretoFront[i]->objectives[j];
            if (j < paretoFront[i]->objectives.size() - 1)
                *outputStream << ",";
        }
        *outputStream << std::endl;
    }
}

void GAResults::printSVG() {
    const int width = 1000;
    const int height = 1000;
    const int axisOffset = 50;  // Offset for axes so the points don’t crowd the edges

    *outputStream << "<svg width=\"" << width << "\" height=\"" << height << "\" xmlns=\"http://www.w3.org/2000/svg\">" << std::endl;

    // Draw axes
    *outputStream << "<line x1=\"" << axisOffset << "\" y1=\"" << height / 2;
    *outputStream << "\" x2=\"" << width - axisOffset << "\" y2=\"" << height / 2;
    *outputStream << "\" style=\"stroke:black;stroke-width:2\" />" << std::endl;

    *outputStream << "<line x1=\"" << axisOffset << "\" y1=\"" << axisOffset;
    *outputStream << "\" x2=\"" << axisOffset << "\" y2=\"" << height - axisOffset;
    *outputStream << "\" style=\"stroke:black;stroke-width:2\" />" << std::endl;

    // Draw grid lines (optional for better visualization)
    for (int i = 0; i <= 10; ++i) {
        int gridX = axisOffset + i * (width - 2 * axisOffset) / 10;
        int gridY = axisOffset + i * (height - 2 * axisOffset) / 10;

        *outputStream << "<line x1=\"" << gridX << "\" y1=\"" << axisOffset << "\" x2=\"" << gridX << "\" y2=\"" << height - axisOffset << "\" style=\"stroke:lightgray;stroke-width:1\" />" << std::endl;
        *outputStream << "<line x1=\"" << axisOffset << "\" y1=\"" << gridY << "\" x2=\"" << width - axisOffset << "\" y2=\"" << gridY << "\" style=\"stroke:lightgray;stroke-width:1\" />" << std::endl;
    }

    // Draw points (Pareto front)
    for (unsigned int i = 0; i < paretoFront.size(); ++i) {
        double x = paretoFront[i]->objectives[0] * 10 + axisOffset;  // Scale and offset
        double y = height - (paretoFront[i]->objectives[1] * 10 + axisOffset);  // Invert y-axis

        *outputStream << "<circle cx=\"" << x << "\" cy=\"" << y << "\" r=\"5\" fill=\"red\" />" << std::endl;
    }

    // Optionally add axis labels (x and y objectives)
    *outputStream << "<text x=\"" << width / 2 << "\" y=\"" << height - 20 << "\" font-size=\"16\" text-anchor=\"middle\">Objective 1</text>" << std::endl;
    *outputStream << "<text x=\"20\" y=\"" << height / 2 << "\" font-size=\"16\" text-anchor=\"middle\" transform=\"rotate(-90 20," << height / 2 << ")\">Objective 2</text>" << std::endl;

    *outputStream << "</svg>" << std::endl;
}

void GAResults::printHTML() {
    *outputStream << "<!DOCTYPE html>" << std::endl;
    *outputStream << "<html>" << std::endl;
    *outputStream << "<body>" << std::endl;
    printSVG();
    *outputStream << "</body>" << std::endl;
    *outputStream << "</html>" << std::endl;
}

void GAResults::print() {
    switch (outputFormat) {
        case TXT:
            printStats();
            if(type == SINGLE)
                printBest();
            else
                printPareto();
            break;
        case CSV:
            if(type == MULTI)
                printCSV();
            else
                *outputStream << "CSV output is only available for multi-objective problems" << std::endl;
            break;
        case SVG:
            if(type == MULTI)
                printSVG();
            else
                *outputStream << "SVG output is only available for multi-objective problems" << std::endl;
            break;
        case HTML:
            if(type == MULTI)
                printHTML();
            else
                *outputStream << "HTML output is only available for multi-objective problems" << std::endl;
            break;
        default:
            *outputStream << "Unknown output format" << std::endl;
    }
}