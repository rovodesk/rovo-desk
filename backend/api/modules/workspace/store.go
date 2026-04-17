package workspace

import "encore.dev/storage/sqldb"

var sqlStore = sqldb.NewDatabase("workspace", sqldb.DatabaseConfig{
	Migrations: "./migrations",
})
