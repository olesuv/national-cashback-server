package db

import (
	"database/sql"
	"fmt"
	"log"

	"github.com/olesuv/national-cashback-app/internal/utils"
)

type DBManager struct {
	db *sql.DB
}

func DBManagerInit(connStr string) *DBManager {
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatalf("unable to connect to the database: %v", err)
	}

	return &DBManager{db: db}
}

func (dbm *DBManager) Close() error {
	if dbm.db != nil {
		return dbm.db.Close()
	}
	return nil
}

func (dbm *DBManager) MigrateCSVtoSQL(records [][]string, tableName string, columnNames []string) error {
	if dbm.db == nil {
		return fmt.Errorf("db is not initialized")
	}

	columns, placeholderStr := utils.ArrToStr(columnNames)
	query := fmt.Sprintf("INSERT INTO %s (%s) VALUES (%s)", tableName, columns, placeholderStr)

	stmt, err := dbm.db.Prepare(query)
	if err != nil {
		return fmt.Errorf("failed to prepare statement: %w", err)
	}
	defer stmt.Close()

	for i, record := range records {
		if i == 0 {
			// skip the header row
			continue
		}

		// use the dynamic number of fields
		args := make([]interface{}, len(columnNames))
		for j := range args {
			args[j] = record[j]
		}

		_, err := stmt.Exec(args...)
		if err != nil {
			log.Printf("failed to insert record %v: %v", record, err)
		} else {
			fmt.Printf("inserted record: %v\n", record)
		}
	}

	return nil
}
