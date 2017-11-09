# c语言怎么实现字符串转整型

好久没写 C 了，写起来磕磕绊绊的，见笑了x

```c
#include <stdio.h>

int64_t mathPow (int64_t num, int index) {
    if (index == 0) return 1;
    if (index == 1) return num;
    return num * mathPow(num, index - 1);
}

int main () {
    int result = 0;
    char str[999999];
    int strLen = 0;

    printf("Numbers: ");
    scanf("%s", str);

    for (;str[strLen] != '\0'; strLen++) { 
        if(str[strLen] > 57 || str[strLen] < 48) {
            printf("String illegal.");
	    return -1;
        }
    }
    printf("strLen: %d\n", strLen);
    
    for (int i = strLen - 1, j = 0; i >= 0; i--, j++) {
	    // printf("index: %d; str[i]: %d; pow: %lld\n", j, str[i] - 48, mathPow(10, j));
        result += (str[i] - 48) * mathPow(10, j);
    }

    printf("String2Int: %d", result);

    return 0;
}
```