
CPP      = g++
CFLAGS   = -Wall -pthread 
LDFLAGS  = -lgsl -lgslcblas -lm

TARGET   = quadratic_example

TEST_SOURCES      = main.cpp

TEST_OBJECTS     = ../../obj/lib/ga/chromosome.o ../../obj/lib/ga/ga.o

INCLUDES = -I../../src/lib/ga

all: $(TARGET)


$(TARGET): $(TEST_OBJECTS)
	@echo "Compiling tests..."
	$(CPP) $(CFLAGS) $(INCLUDES) $(TEST_SOURCES) $(TEST_OBJECTS) -o $(TARGET)
	@echo "Tests compiled"

../../obj/lib/ga/main.o: $(TEST_SOURCES)
	@mkdir -p $(@D)
	$(CPP) $(CFLAGS) $(INCLUDES) -c $(TEST_SOURCES) -o $@

clean:
	rm -f $(TARGET)

.PHONY: all clean
