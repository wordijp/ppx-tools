#include <Windows.h>
#include <stdio.h>


int main(void) {
	char cwd[1024];
	GetCurrentDirectory(1024, cwd);
	printf(cwd);
	return 0;
}
