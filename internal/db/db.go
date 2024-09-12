package db

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"

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

	err = db.Ping()
	if err != nil {
		log.Fatalf("unable to ping the database: %v", err)
	}

	log.Println("db connect success")
	return &DBManager{db: db}
}

func (dbm *DBManager) IsAlive() bool {
	if dbm.db == nil {
		return false
	}
	return dbm.db.Ping() == nil
}

func (dbm *DBManager) Close() error {
	if dbm.db != nil {
		return dbm.db.Close()
	}
	return nil
}

func (dbm *DBManager) migrateCSVtoSQL(records [][]string, tableName string, columnNames []string) error {
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

	var record_n int = 0
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
			log.Panicf("failed to insert record %v: %v", record, err)
		} else {
			record_n++
		}
	}

	log.Printf("inserted %d amount of records for %s table", record_n, tableName)
	return nil
}
