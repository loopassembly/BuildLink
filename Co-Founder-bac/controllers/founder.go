package controllers

import (
    "github.com/gofiber/fiber/v2"
    "Co-Founder-bac/database"
    "Co-Founder-bac/models"
)

func FounderDashboard(c *fiber.Ctx) error {
    // Retrieve session using the global session store
    sess, err := SessionStore.Get(c)
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).SendString("Session error")
    }

    userID := sess.Get("user_id")
    if userID == nil {
        return c.Redirect("/auth/github")
    }

    // Optionally assert type if needed:
    uid, ok := userID.(uint)
    if !ok {
        return c.Status(fiber.StatusInternalServerError).SendString("Invalid user ID type")
    }

    var ideas []models.Idea
    database.DB.Where("founder_id = ?", uid).Find(&ideas)
    return c.JSON(ideas)
}

func CreateIdea(c *fiber.Ctx) error {
    sess, err := SessionStore.Get(c)
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).SendString("Session error")
    }

    userID := sess.Get("user_id")
    if userID == nil {
        return c.Redirect("/auth/github")
    }

    // Assert the type of userID appropriately
    uid, ok := userID.(uint)
    if !ok {
        return c.Status(fiber.StatusInternalServerError).SendString("Invalid user ID type")
    }

    idea := new(models.Idea)
    if err := c.BodyParser(idea); err != nil {
        return c.Status(400).SendString("Invalid input")
    }
    idea.FounderID = uid
    database.DB.Create(&idea)
    return c.SendStatus(201)
}

func ViewApplications(c *fiber.Ctx) error {
    ideaId := c.Params("ideaId")
    var apps []models.Application
    database.DB.Where("idea_id = ?", ideaId).Find(&apps)
    return c.JSON(apps)
}

func AcceptApplication(c *fiber.Ctx) error {
    return c.SendString("WhatsApp numbers shared!")
}
