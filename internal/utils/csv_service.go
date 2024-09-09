package utils

import (
	"encoding/csv"
	"log"
	"os"
)

type CSVManager struct {
	reader *csv.Reader
}

func CSVManagerInit() *CSVManager { return &CSVManager{} }

func (m *CSVManager) ReadCSV(fileName string) [][]string {
	file, err := os.Open(fileName)
	if err != nil {
		log.Fatalf("unable to open file: %v", err)
	}
	defer file.Close()

	m.reader = csv.NewReader(file)

	records, err := m.reader.ReadAll()
	if err != nil {
		log.Fatalf("unable to read CSV: %v", err)
	}

	return records
}
