TARGET = cwd.exe

#CXX = g++
CXX = i686-w64-mingw32-gcc
CXXFLAGS = -Wall -O2 -g

SRCS = main.c \
	   
OBJS = $(patsubst %, obj/%, $(SRCS:.c=.o))

# -----------------------------------------------

all: obj $(TARGET)
	
obj: 
	mkdir obj
	
obj/%.o: %.c
	$(CXX) $(CXXFLAGS) -o $@ -c $<
	
$(TARGET): $(OBJS)
	$(CXX) $(OBJS) -o $@
	strip $@

clean:
	rm -f $(TARGET)
	rm -Rf obj
	
# -----------------------------------------------

.PHONY: clean
