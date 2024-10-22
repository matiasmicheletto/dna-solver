
CPP      = g++
CFLAGS   = -Wall -pthread 
LDFLAGS  = -lgsl -lgslcblas -lm
SRCDIR   = src
OBJDIR   = obj
LIBDIR   = ../../src

TARGET   = subsetsum_example

EXAMPLE_SOURCES  = $(wildcard $(SRCDIR)/main.cpp) $(wildcard $(LIBDIR)/**/*.cpp)

EXAMPLE_OBJECTS  = $(patsubst $(SRCDIR)/%.cpp,$(OBJDIR)/%.o,$(EXAMPLE_SOURCES))

INCLUDES = -I$(LIBDIR) -I$(LIBDIR)/lib

ifdef DEBUG
    CFLAGS += -DDEBUG=true
endif

CFLAGS += -DMANUAL_PATH=\"../../manual.txt\"


all: $(TARGET)

$(TARGET): $(EXAMPLE_OBJECTS)
	@echo "Compiling example..."
	$(CPP) $(CFLAGS) $(INCLUDES) $^ -o $@ $(LDFLAGS)
	@if [ "$(DEBUG)" = "true" ]; then echo "Debug mode enabled"; fi
	@echo "Example compiled"

$(OBJDIR)/%.o: $(SRCDIR)/%.cpp $(HEADERS)
	@mkdir -p $(@D)
	@echo "Compiling $<..."
	$(CPP) $(CFLAGS) $(INCLUDES) -c $< -o $@ $(LDFLAGS)

clean:
	rm -f $(TARGET)

.PHONY: all clean
