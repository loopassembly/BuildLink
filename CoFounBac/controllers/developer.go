package controllers

import (
    "strconv"

    "github.com/gofiber/fiber/v2"
    // "github.com/gofiber/fiber/v2/middleware/session"
    "Co-Founder-bac/database"
    "Co-Founder-bac/models"
)

// DeveloperDashboard handles the GET /developer/dashboard route.
func DeveloperDashboard(c *fiber.Ctx) error {
    // Retrieve session using the global session store
    sess, err := SessionStore.Get(c)
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).SendString("Session error")
    }

    userID := sess.Get("user_id")
    if userID == nil {
        return c.Redirect("/auth/github")
    }

    uid, ok := userID.(uint)
    if !ok {
        return c.Status(fiber.StatusInternalServerError).SendString("Invalid user ID type")
    }

    var user models.User
    if err := database.DB.First(&user, uid).Error; err != nil {
        return c.Status(fiber.StatusInternalServerError).SendString("User not found")
    }

    var ideas []models.Idea
    if user.Role == "developer" {
        // Exclude ideas posted by this user
        database.DB.Where("founder_id != ?", uid).Find(&ideas)
    } else {
        database.DB.Find(&ideas)
    }

    return c.JSON(ideas)
}



func ApplyToIdea(c *fiber.Ctx) error {
    sess, err := SessionStore.Get(c)
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).SendString("Session error")
    }

    userID := sess.Get("user_id")
    if userID == nil {
        return c.Redirect("/auth/github")
    }

    uid, ok := userID.(uint)
    if !ok {
        return c.Status(fiber.StatusInternalServerError).SendString("Invalid user ID type")
    }

    ideaIdParam := c.Params("ideaId")
    ideaID, err := strconv.ParseUint(ideaIdParam, 10, 64)
    if err != nil {
        return c.Status(fiber.StatusBadRequest).SendString("Invalid idea ID")
    }

    appData := new(models.Application)
    // Parse JSON body including WhatsAppNumber
    if err := c.BodyParser(appData); err != nil {
        return c.Status(400).SendString("Invalid input")
    }

    appData.IdeaID = uint(ideaID)
    appData.DeveloperID = uid

    // Optionally retrieve developer info from the database
    var user models.User
    if err := database.DB.First(&user, uid).Error; err == nil {
        appData.DeveloperName = user.Username
    }

    // Save application
    if err := database.DB.Create(&appData).Error; err != nil {
        return c.Status(fiber.StatusInternalServerError).SendString("Failed to submit application")
    }

    return c.SendString("Application submitted!")
}



// ApplyToIdea handles the POST /developer/apply/:ideaId route.
// func ApplyToIdea(c *fiber.Ctx) error {
//     // Retrieve session
//     sess, err := SessionStore.Get(c)
//     if err != nil {
//         return c.Status(fiber.StatusInternalServerError).SendString("Session error")
//     }

//     userID := sess.Get("user_id")
//     if userID == nil {
//         return c.Redirect("/auth/github")
//     }

//     uid, ok := userID.(uint)
//     if !ok {
//         return c.Status(fiber.StatusInternalServerError).SendString("Invalid user ID type")
//     }

//     ideaIdParam := c.Params("ideaId")
//     ideaID, err := strconv.ParseUint(ideaIdParam, 10, 64)
//     if err != nil {
//         return c.Status(fiber.StatusBadRequest).SendString("Invalid idea ID")
//     }

//     appData := new(models.Application)
//     if err := c.BodyParser(appData); err != nil {
//         return c.Status(400).SendString("Invalid input")
//     }

//     appData.IdeaID = uint(ideaID)
//     appData.DeveloperID = uid

//     // Optionally retrieve developer info from the database
//     var user models.User
//     if err := database.DB.First(&user, uid).Error; err == nil {
//         appData.DeveloperName = user.Username
//     }

//     // Create a new application record in the database
//     if err := database.DB.Create(&appData).Error; err != nil {
//         return c.Status(fiber.StatusInternalServerError).SendString("Failed to submit application")
//     }

//     return c.SendString("Application submitted!")
// }
