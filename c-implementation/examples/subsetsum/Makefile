# Compiler and flags
CPP      = g++
CFLAGS   = -Wall -std=c++11

# Include directories
INCLUDES = -I../../src/lib/ga

# Source and object files
SRC      = main.cpp
OBJS     = ../../obj/lib/ga/chromosome.o ../../obj/lib/ga/ga.o

# Target executable
TARGET   = subsetsum_example

# Default rule
all: $(TARGET)

# Linking rule
$(TARGET): $(SRC) $(OBJS)
	$(CPP) $(CFLAGS) $(INCLUDES) $(SRC) $(OBJS) -o $(TARGET)

# Clean up
clean:
	rm -f $(TARGET)

.PHONY: all clean
