CPP      = g++
CFLAGS   = -Wall -pthread 
LDFLAGS  = -lgsl -lgslcblas -lm

TARGET   = subsetsum_example

SOURCES      = main.cpp

OBJECTS     = ../../obj/lib/ga/chromosome.o ../../obj/lib/ga/ga.o

INCLUDES = -I../../src/lib/ga

all: $(TARGET)


$(TARGET): $(OBJECTS)
	@echo "Compiling example..."
	$(CPP) $(CFLAGS) $(INCLUDES) $(SOURCES) $(OBJECTS) -o $(TARGET)
	@echo "Example compiled"

../../obj/lib/ga/main.o: $(SOURCES)
	@mkdir -p $(@D)
	$(CPP) $(CFLAGS) $(INCLUDES) -c $(SOURCES) -o $@

clean:
	rm -f $(TARGET)

.PHONY: all clean
