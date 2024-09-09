package utils

import (
	"fmt"
	"strings"
)

func ArrToStr(strArr []string) (string, string) {
	columns := strings.Join(strArr, ", ")

	placeholders := make([]string, len(strArr))
	for i := range placeholders {
		placeholders[i] = fmt.Sprintf("$%d", i+1)
	}
	placeholderStr := strings.Join(placeholders, ", ")

	return columns, placeholderStr
}
