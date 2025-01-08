	package routes

import (
    "github.com/gofiber/fiber/v2"
    "github.com/gofiber/fiber/v2/middleware/session"
    "Co-Founder-bac/controllers"
    "Co-Founder-bac/middleware"
)

func Setup(app *fiber.App, store *session.Store) {
    // Authentication routes
    app.Get("/auth/github", controllers.GitHubLogin)
    app.Get("/auth/github/callback", controllers.GitHubCallback)
    app.Post("/auth/logout", controllers.Logout)

    // Use middleware to require authentication for protected routes
    authRequired := middleware.RequireAuth(store)

    // Founder routes
    founder := app.Group("/founder", authRequired)
    founder.Get("/dashboard", controllers.FounderDashboard)
    founder.Post("/create-idea", controllers.CreateIdea)
    founder.Get("/applications/:ideaId", controllers.ViewApplications)
    founder.Post("/applications/:ideaId/accept", controllers.AcceptApplication)

    // Developer routes
    developer := app.Group("/developer", authRequired)
    developer.Get("/dashboard", controllers.DeveloperDashboard)
    // developer.Post("/apply/:ideaId", controllers.ApplyToIdea)
     developer.Post("/apply/:ideaId", controllers.ApplyToIdea)
}
