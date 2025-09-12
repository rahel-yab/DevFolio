package entities

import (
	"time"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Portfolio struct {
	ID          primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	UserID      string            `json:"user_id" bson:"user_id"`
	Name        string            `json:"name" bson:"name"`
	Title       string            `json:"title" bson:"title"`
	Bio         string            `json:"bio" bson:"bio"`
	Email       string            `json:"email" bson:"email"`
	Phone       string            `json:"phone" bson:"phone"`
	Location    string            `json:"location" bson:"location"`
	Website     string            `json:"website" bson:"website"`
	LinkedIn    string            `json:"linkedin" bson:"linkedin"`
	GitHub      string            `json:"github" bson:"github"`
	Experience  []Experience      `json:"experience" bson:"experience"`
	Education   []Education       `json:"education" bson:"education"`
	Projects    []Project         `json:"projects" bson:"projects"`
	Skills      []string          `json:"skills" bson:"skills"`
	Template    string            `json:"template" bson:"template"`
	IsPublic    bool              `json:"is_public" bson:"is_public"`
	CreatedAt   time.Time         `json:"created_at" bson:"created_at"`
	UpdatedAt   time.Time         `json:"updated_at" bson:"updated_at"`
}

type Experience struct {
	Company     string    `json:"company" bson:"company"`
	Role        string    `json:"role" bson:"role"`
	StartDate   time.Time `json:"start_date" bson:"start_date"`
	EndDate     *time.Time `json:"end_date,omitempty" bson:"end_date,omitempty"`
	Description string    `json:"description" bson:"description"`
	Location    string    `json:"location" bson:"location"`
	IsCurrent   bool      `json:"is_current" bson:"is_current"`
}

type Education struct {
	School      string    `json:"school" bson:"school"`
	Degree      string    `json:"degree" bson:"degree"`
	Field       string    `json:"field" bson:"field"`
	StartDate   time.Time `json:"start_date" bson:"start_date"`
	EndDate     *time.Time `json:"end_date,omitempty" bson:"end_date,omitempty"`
	GPA         string    `json:"gpa,omitempty" bson:"gpa,omitempty"`
	Description string    `json:"description" bson:"description"`
}

type Project struct {
	Name        string   `json:"name" bson:"name"`
	Description string   `json:"description" bson:"description"`
	TechStack   []string `json:"tech_stack" bson:"tech_stack"`
	Link        string   `json:"link" bson:"link"`
	GitHubLink  string   `json:"github_link" bson:"github_link"`
	ImageURL    string   `json:"image_url" bson:"image_url"`
	StartDate   time.Time `json:"start_date" bson:"start_date"`
	EndDate     *time.Time `json:"end_date,omitempty" bson:"end_date,omitempty"`
	Featured    bool     `json:"featured" bson:"featured"`
}

type CreatePortfolioRequest struct {
	Name       string       `json:"name" binding:"required"`
	Title      string       `json:"title" binding:"required"`
	Bio        string       `json:"bio"`
	Email      string       `json:"email"`
	Phone      string       `json:"phone"`
	Location   string       `json:"location"`
	Website    string       `json:"website"`
	LinkedIn   string       `json:"linkedin"`
	GitHub     string       `json:"github"`
	Experience []Experience `json:"experience"`
	Education  []Education  `json:"education"`
	Projects   []Project    `json:"projects"`
	Skills     []string     `json:"skills"`
	Template   string       `json:"template"`
}

type UpdatePortfolioRequest struct {
	Name       *string       `json:"name,omitempty"`
	Title      *string       `json:"title,omitempty"`
	Bio        *string       `json:"bio,omitempty"`
	Email      *string       `json:"email,omitempty"`
	Phone      *string       `json:"phone,omitempty"`
	Location   *string       `json:"location,omitempty"`
	Website    *string       `json:"website,omitempty"`
	LinkedIn   *string       `json:"linkedin,omitempty"`
	GitHub     *string       `json:"github,omitempty"`
	Experience *[]Experience `json:"experience,omitempty"`
	Education  *[]Education  `json:"education,omitempty"`
	Projects   *[]Project    `json:"projects,omitempty"`
	Skills     *[]string     `json:"skills,omitempty"`
	Template   *string       `json:"template,omitempty"`
	IsPublic   *bool         `json:"is_public,omitempty"`
}

type AIEnhanceRequest struct {
	PortfolioID string                 `json:"portfolio_id" binding:"required"`
	Fields      []string               `json:"fields"` // Fields to enhance: ["bio", "experience", "projects"]
	Context     map[string]interface{} `json:"context"` // Additional context for AI
}