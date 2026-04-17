package workspace

import "encore.dev/storage/sqldb"

var sqlStore = sqldb.NewDatabase("user", sqldb.DatabaseConfig{
	Migrations: "./migrations",
})
