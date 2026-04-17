package database

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jackc/pgx/v5/stdlib"
	"go4.org/syncutil"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/pressly/goose/v3"
)

var (
	once   syncutil.Once
	gormDB *gorm.DB
)

// Conn returns a GORM database instance backed by pgx pool.
func Conn(ctx context.Context, url string) (*gorm.DB, error) {
	err := once.Do(func() error {
		// 1. Setup the pgxpool
		pool, err := pgxpool.New(ctx, url)
		if err != nil {
			return err
		}

		// 2. Convert pgxpool to *sql.DB (this satisfies gorm.ConnPool)
		// OpenDBFromPool creates a standard sql.DB handle using the existing pgx pool
		sqlDB := stdlib.OpenDBFromPool(pool)

		// 3. Wrap with GORM
		db, err := gorm.Open(postgres.New(postgres.Config{
			Conn: sqlDB,
		}), &gorm.Config{})
		if err != nil {
			return err
		}

		gormDB = db
		return nil
	})

	return gormDB, err
}

func RunMigrations(db *sql.DB, dir string) error {
	if err := goose.SetDialect("postgres"); err != nil {
		return err
	}

	if err := goose.Up(db, dir); err != nil {
		return fmt.Errorf("migration failed: %w", err)
	}

	fmt.Println("Migrations applied successfully")
	return nil
}
