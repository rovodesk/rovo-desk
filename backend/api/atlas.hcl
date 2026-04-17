data "external_schema" "gorm" {
  program = [
    "go",
    "run",
    "cmd/migrate/main.go",
  ]
}

env "gorm" {
  src = data.external_schema.gorm.url
  dev = "docker://postgres/15/dev"
  url = getenv("DATABASE_URL")
}