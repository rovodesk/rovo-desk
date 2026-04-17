//go:build tools
// +build tools

package tools

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"

	_ "ariga.io/atlas-go-sdk/recordriver"
	_ "github.com/alicebob/miniredis/v2"
	_ "github.com/go-redis/redis/v8"
	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/pressly/goose/v3"
)

func Migrate(dsn ...string) {
	ctx := context.Background()

	dbURL, err := resolveDSN(dsn...)
	if err != nil {
		panic(err)
	}

	wd, err := os.Getwd()
	if err != nil {
		panic(err)
	}

	migrationsPath := filepath.Join(wd, "./migrations")

	cmd := getCommand()

	switch cmd {

	// --------------------------------
	// 🔥 Atlas: Generate migrations
	// --------------------------------
	case "diff":
		name := getArg(2)
		if name == "" {
			panic("provide migration name: diff <name>")
		}

		runAtlasDiff(name, *dbURL)
		return

	// --------------------------------
	// 🧱 Goose: Apply migrations
	// --------------------------------
	case "up", "down", "reset":
		runGoose(ctx, *dbURL, migrationsPath, cmd)
		return

	default:
		panic("invalid command: diff | up | down | reset")
	}
}

func runAtlasDiff(name, dbURL string) {
	fmt.Println("⚙️ Generating migration via Atlas:", name)

	cmd := exec.Command(
		"atlas",
		"migrate", "diff", name,
		"--env", "gorm",
	)

	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	// pass DATABASE_URL to Atlas
	cmd.Env = append(os.Environ(), "DATABASE_URL="+dbURL)

	if err := cmd.Run(); err != nil {
		panic(fmt.Errorf("atlas diff failed: %w", err))
	}
}

func runGoose(ctx context.Context, dbURL, migrationsPath, command string) {
	db, err := sql.Open("pgx", dbURL)
	if err != nil {
		panic(fmt.Errorf("failed to open db: %w", err))
	}
	defer db.Close()

	if err := db.PingContext(ctx); err != nil {
		panic(fmt.Errorf("failed to ping db: %w", err))
	}

	if err := goose.SetDialect("postgres"); err != nil {
		panic(err)
	}

	switch command {
	case "up":
		err = goose.Up(db, migrationsPath)
	case "down":
		err = goose.Down(db, migrationsPath)
	case "reset":
		err = goose.Reset(db, migrationsPath)
	}

	if err != nil {
		panic(fmt.Errorf("migration failed: %w", err))
	}

	fmt.Println("✅ migration", command, "successful")
}

func getArg(index int) string {
	if len(os.Args) > index {
		return os.Args[index]
	}
	return ""
}

func resolveDSN(input ...string) (*string, error) {
	if len(input) > 0 && input[0] != "" {
		return &input[0], nil
	}

	if env := os.Getenv("DATABASE_URL"); env != "" {
		return &env, nil
	}

	return nil, errors.New("database DSN not provided (arg or env DATABASE_URL)")
}

func getCommand() string {
	if len(os.Args) < 2 {
		return "up"
	}
	return os.Args[1]
}
