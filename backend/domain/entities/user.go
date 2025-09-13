package entities

import (
	"time"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID           primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Email        string            `json:"email" bson:"email"`
	Password     string            `json:"-" bson:"password"` // Never include in JSON responses
	FirstName    string            `json:"first_name" bson:"first_name"`
	LastName     string            `json:"last_name" bson:"last_name"`
	Avatar       string            `json:"avatar" bson:"avatar"`
	Bio          string            `json:"bio" bson:"bio"`
	Phone        string            `json:"phone" bson:"phone"`
	Location     string            `json:"location" bson:"location"`
	Website      string            `json:"website" bson:"website"`
	LinkedIn     string            `json:"linkedin" bson:"linkedin"`
	GitHub       string            `json:"github" bson:"github"`
	IsVerified   bool              `json:"is_verified" bson:"is_verified"`
	IsActive     bool              `json:"is_active" bson:"is_active"`
	LastLoginAt  *time.Time        `json:"last_login_at,omitempty" bson:"last_login_at,omitempty"`
	CreatedAt    time.Time         `json:"created_at" bson:"created_at"`
	UpdatedAt    time.Time         `json:"updated_at" bson:"updated_at"`
}

type RegisterRequest struct {
	Email     string `json:"email" binding:"required,email"`
	Password  string `json:"password" binding:"required,min=8"`
	FirstName string `json:"first_name" binding:"required"`
	LastName  string `json:"last_name" binding:"required"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type LoginResponse struct {
	User        *User  `json:"user"`
	AccessToken string `json:"access_token"`
}

type RefreshTokenRequest struct {
	// Refresh token will be read from HTTP-only cookie
}

type RefreshTokenResponse struct {
	AccessToken string `json:"access_token"`
}

type UpdateProfileRequest struct {
	FirstName *string `json:"first_name,omitempty"`
	LastName  *string `json:"last_name,omitempty"`
	Avatar    *string `json:"avatar,omitempty"`
	Bio       *string `json:"bio,omitempty"`
	Phone     *string `json:"phone,omitempty"`
	Location  *string `json:"location,omitempty"`
	Website   *string `json:"website,omitempty"`
	LinkedIn  *string `json:"linkedin,omitempty"`
	GitHub    *string `json:"github,omitempty"`
}

type ChangePasswordRequest struct {
	CurrentPassword string `json:"current_password" binding:"required"`
	NewPassword     string `json:"new_password" binding:"required,min=8"`
}

// UserResponse represents user data for API responses (without sensitive fields)
type UserResponse struct {
	ID          primitive.ObjectID `json:"id"`
	Email       string            `json:"email"`
	FirstName   string            `json:"first_name"`
	LastName    string            `json:"last_name"`
	Avatar      string            `json:"avatar"`
	Bio         string            `json:"bio"`
	Phone       string            `json:"phone"`
	Location    string            `json:"location"`
	Website     string            `json:"website"`
	LinkedIn    string            `json:"linkedin"`
	GitHub      string            `json:"github"`
	IsVerified  bool              `json:"is_verified"`
	LastLoginAt *time.Time        `json:"last_login_at,omitempty"`
	CreatedAt   time.Time         `json:"created_at"`
	UpdatedAt   time.Time         `json:"updated_at"`
}

func (u *User) ToResponse() *UserResponse {
	return &UserResponse{
		ID:          u.ID,
		Email:       u.Email,
		FirstName:   u.FirstName,
		LastName:    u.LastName,
		Avatar:      u.Avatar,
		Bio:         u.Bio,
		Phone:       u.Phone,
		Location:    u.Location,
		Website:     u.Website,
		LinkedIn:    u.LinkedIn,
		GitHub:      u.GitHub,
		IsVerified:  u.IsVerified,
		LastLoginAt: u.LastLoginAt,
		CreatedAt:   u.CreatedAt,
		UpdatedAt:   u.UpdatedAt,
	}
}