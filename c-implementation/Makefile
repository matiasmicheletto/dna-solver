CPP      = g++
CFLAGS   = -Wall -pthread 
LDFLAGS  = -lgsl -lgslcblas -lm
SRCDIR   = src
OBJDIR   = obj
LIBDIR   = $(SRCDIR)/lib

TARGET         = solver

SOLVER_SOURCES  = $(wildcard $(SRCDIR)/main.cpp) $(wildcard $(LIBDIR)/**/*.cpp)

SOLVER_OBJECTS  = $(patsubst $(SRCDIR)/%.cpp,$(OBJDIR)/%.o,$(SOLVER_SOURCES))

HEADERS         = $(wildcard $(LIBDIR)/**/*.h)

INCLUDES = -I$(LIBDIR) -I$(LIBDIR)/ga

ifdef DEBUG
    CFLAGS += -DDEBUG=true
endif

all: $(TARGET)

$(TARGET): $(SOLVER_OBJECTS)
	@echo "Compiling solver..."
	$(CPP) $(CFLAGS) $(INCLUDES) $^ -o $@ $(LDFLAGS)
	@if [ "$(DEBUG)" = "true" ]; then echo "Debug mode enabled"; fi
	@echo "Solver compiled"

$(OBJDIR)/%.o: $(SRCDIR)/%.cpp $(HEADERS)
	@mkdir -p $(@D)
	@echo "Compiling $<..."
	$(CPP) $(CFLAGS) $(INCLUDES) -c $< -o $@ $(LDFLAGS)

clean:
	rm -rf $(OBJDIR) ./main

.PHONY: all clean
