package main

import (
    "log"
    "os"

    "github.com/gofiber/fiber/v2"
    "github.com/gofiber/fiber/v2/middleware/cors"
    "github.com/gofiber/fiber/v2/middleware/session"
    "github.com/joho/godotenv"
    "Co-Founder-bac/controllers"
    "Co-Founder-bac/database"
    "Co-Founder-bac/routes"
)

func main() {
    // Load environment variables
    if err := godotenv.Load(); err != nil {
        log.Println("No .env file found")
    }

    // Initialize database
    database.Connect()

    // Initialize OAuth configuration
    controllers.InitOAuth()

    // Initialize session store
    // store := session.New(session.Config{
    //     CookieHTTPOnly: false,
    //     KeyLookup:      "cookie:" + os.Getenv("SESSION_SECRET"),
    // })
    
    store := session.New(session.Config{
        CookieHTTPOnly: false,
        CookieSameSite: "None",
        CookieSecure:   false,
        CookieDomain:   "localhost",
        CookiePath:     "/",
        KeyLookup:      "cookie:" + os.Getenv("SESSION_SECRET"),
    })
   
    controllers.SessionStore = store  // Assign to global variable

    // Create Fiber app
    app := fiber.New()

    // Enable CORS for frontend origin
    app.Use(cors.New(cors.Config{
        AllowCredentials: true,
        AllowOrigins:    "http://localhost:8080,http://localhost:3001",
        AllowHeaders:    "Origin, Content-Type, Accept, Authorization",
        AllowMethods:    "GET,POST,HEAD,PUT,DELETE,PATCH",
        ExposeHeaders:   "Set-Cookie",
    }))

    // Setup routes
    routes.Setup(app, store)

    log.Fatal(app.Listen(":3000"))
}
