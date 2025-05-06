package middleware

import (
    "github.com/gofiber/fiber/v2"
    "github.com/gofiber/fiber/v2/middleware/session"
)

func RequireAuth(store *session.Store) fiber.Handler {
    return func(c *fiber.Ctx) error {
        sess, err := store.Get(c)
        if err != nil {
            return err
        }
        if sess.Get("user_id") == nil {
            // Redirect or return unauthorized if no user_id found
            return c.Redirect("/auth/github")
        }
        return c.Next()
    }
}
