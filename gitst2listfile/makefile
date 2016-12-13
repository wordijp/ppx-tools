TARGET = gitst2listfile.exe

#CXX = g++
CXX = x86_64-w64-mingw32-g++
CXXFLAGS = -Wall -O2 -g -std=c++11

STRIP = x86_64-w64-mingw32-strip

SRCS = main.cpp \
	   
OBJS = $(patsubst %, obj/%, $(SRCS:.cpp=.o))

# -----------------------------------------------

all: obj $(TARGET)
	
obj: 
	mkdir obj
	
obj/%.o: %.cpp
	$(CXX) $(CXXFLAGS) -o $@ -c $<
	
$(TARGET): $(OBJS)
	$(CXX) $(OBJS) -o $@
	$(STRIP) $@

clean:
	rm -f $(TARGET)
	rm -Rf obj

# -----------------------------------------------

.PHONY: clean
