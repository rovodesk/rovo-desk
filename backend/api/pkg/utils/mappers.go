package utils

import (
	"reflect"
	"strings"
)

func MapToStruct(m map[string]string, out interface{}) {
	v := reflect.ValueOf(out).Elem()

	for key, val := range m {
		field := v.FieldByNameFunc(func(name string) bool {
			return strings.EqualFold(name, key)
		})

		if field.IsValid() && field.CanSet() && field.Kind() == reflect.String {
			field.SetString(val)
		}
	}
}
