package models

import (
    "gorm.io/gorm"
)

type User struct {
    gorm.Model
    GitHubID   string `gorm:"uniqueIndex"`
    Username   string
    Role       string // "founder" or "developer"
    AvatarURL  string
    // Relationship: A user (founder) can have many ideas
    FoundIdeas []Idea `gorm:"foreignKey:FounderID"`
}

type Idea struct {
    gorm.Model
    FounderID        uint
    Title            string
    Description      string
    Equity           string
    Salary           string
    PartnershipTerms string
    // Relationship: Each idea belongs to one founder (User)
    Founder          User   `gorm:"foreignKey:FounderID"`
}

type Application struct {
    gorm.Model
    IdeaID         uint
    DeveloperID    uint
    DeveloperName  string
    GitHubProfile  string
    WhatsAppNumber string
    Pitch          string

}
