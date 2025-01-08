package controllers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strings"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/github"
	"Co-Founder-bac/database"
	"Co-Founder-bac/models"
)

var (
	oauthConfig  *oauth2.Config
	SessionStore *session.Store // Global session store
)

func InitOAuth() {
	oauthConfig = &oauth2.Config{
		ClientID:     os.Getenv("GITHUB_CLIENT_ID"),
		ClientSecret: os.Getenv("GITHUB_CLIENT_SECRET"),
		Endpoint:     github.Endpoint,
		// RedirectURL:  os.Getenv("CALLBACK_URL"), // Ensure this is set in your .env file
		Scopes:       []string{"user:email"},
	}
}

func GitHubLogin(c *fiber.Ctx) error {
	role := c.Query("role") // Get the role from the query parameter
	log.Print("Role in GitHubLogin:", role) // Debug statement
	if role == "" {
		return c.Status(fiber.StatusBadRequest).SendString("Role is required")
	}

	// Encode the role in the state parameter
	state := "role:" + role
	url := oauthConfig.AuthCodeURL(state, oauth2.AccessTypeOnline)
	return c.Redirect(url, http.StatusTemporaryRedirect)
}

func GitHubCallback(c *fiber.Ctx) error {
	code := c.Query("code")
	state := c.Query("state") // Extract the state parameter
	log.Print("State in GitHubCallback:", state) // Debug statement

	// Decode the role from the state parameter
	role := ""
	if strings.HasPrefix(state, "role:") {
		role = strings.TrimPrefix(state, "role:")
	}
	log.Print("Role in GitHubCallback:", role) // Debug statement

	if code == "" {
		return c.Status(fiber.StatusBadRequest).SendString("Code not found")
	}

	token, err := oauthConfig.Exchange(context.Background(), code)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Failed to exchange token")
	}

	client := oauthConfig.Client(context.Background(), token)
	resp, err := client.Get("https://api.github.com/user")
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Failed to get user info")
	}
	defer resp.Body.Close()

	var ghUser struct {
		ID        int    `json:"id"`
		Login     string `json:"login"`
		AvatarURL string `json:"avatar_url"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&ghUser); err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Failed to parse user info")
	}

	// Check if user exists, else create
	var user models.User
	result := database.DB.Where("git_hub_id = ?", strconv.Itoa(ghUser.ID)).First(&user)
	if result.Error != nil {
		user = models.User{
			GitHubID:  strconv.Itoa(ghUser.ID),
			Username:  ghUser.Login,
			Role:      role,
			AvatarURL: ghUser.AvatarURL,
		}
		database.DB.Create(&user)
	} else {
		// Update the user's role and avatar if they have changed
		user.Role = role
		user.AvatarURL = ghUser.AvatarURL
		database.DB.Save(&user)
	}

	// Retrieve session using the global session store
	sess, err := SessionStore.Get(c)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Session error")
	}

	sess.Set("user_id", user.ID)
	if err := sess.Save(); err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Failed to save session")
	}

	// Redirect based on the role
	if role == "founder" {
		return c.Redirect("http://localhost:3001/founder/dashboard")
	} else if role == "developer" {
		return c.Redirect("http://localhost:3001/developer/dashboard")
	}

	return c.Redirect("http://localhost:3001")
}

func Logout(c *fiber.Ctx) error {
	sess, err := SessionStore.Get(c)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Session error")
	}

	err = sess.Destroy()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Failed to destroy session")
	}

	return c.Redirect("http://localhost:3001/")
}