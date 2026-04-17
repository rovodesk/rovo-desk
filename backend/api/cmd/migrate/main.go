// cmd/migrate/main.go
package main

import (
	"fmt"
	"os"

	"ariga.io/atlas-provider-gorm/gormschema"
	document "github.com/zero-heads-lab/api/modules/documents/data"
)

func main() {
	stmts, err := gormschema.New("postgres").Load(document.Models...)
	if err != nil {
		fmt.Println(err)
		panic(err)
	}

	fmt.Fprintln(os.Stdout, stmts)
}
