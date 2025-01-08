package database

import (
    "log"
    "fmt"

    "gorm.io/driver/postgres"
    "gorm.io/gorm"
    "Co-Founder-bac/models"
)

var DB *gorm.DB

func Connect() {
    dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s",
        "aws-0-ap-south-1.pooler.supabase.com",
        "postgres.angpfmtdnekkdzoednql",
        "deauther@2560", 
        "postgres",
        "5432",
    )
    database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
    if err != nil {
        log.Fatal("Failed to connect to database:", err)
    }
    DB = database

    // Auto-migrate models 
    database.AutoMigrate(&models.User{}, &models.Idea{}, &models.Application{})
    log.Println("Database connection successful")
}

