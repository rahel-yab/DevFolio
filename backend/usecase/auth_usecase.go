package usecase

import (
	"context"
	"fmt"
	"strings"

	"devfolio-backend/domain/entities"
	"devfolio-backend/domain/repositories"
	"devfolio-backend/infrastructure/auth"
	
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type AuthUsecase interface {
	Register(ctx context.Context, req *entities.RegisterRequest) (*entities.User, *auth.TokenPair, error)
	Login(ctx context.Context, req *entities.LoginRequest) (*entities.User, *auth.TokenPair, error)
	RefreshToken(ctx context.Context, refreshToken string) (string, error)
	GetProfile(ctx context.Context, userID string) (*entities.User, error)
	UpdateProfile(ctx context.Context, userID string, req *entities.UpdateProfileRequest) (*entities.User, error)
	ChangePassword(ctx context.Context, userID string, req *entities.ChangePasswordRequest) error
	Logout(ctx context.Context, userID string) error
}

type authUsecase struct {
	userRepo        repositories.UserRepository
	jwtManager      *auth.JWTManager
	passwordManager *auth.PasswordManager
}

func NewAuthUsecase(
	userRepo repositories.UserRepository,
	jwtManager *auth.JWTManager,
	passwordManager *auth.PasswordManager,
) AuthUsecase {
	return &authUsecase{
		userRepo:        userRepo,
		jwtManager:      jwtManager,
		passwordManager: passwordManager,
	}
}

func (u *authUsecase) Register(ctx context.Context, req *entities.RegisterRequest) (*entities.User, *auth.TokenPair, error) {
	// Validate password
	if err := u.passwordManager.ValidatePassword(req.Password); err != nil {
		return nil, nil, fmt.Errorf("invalid password: %w", err)
	}

	// Check if email already exists
	exists, err := u.userRepo.EmailExists(ctx, strings.ToLower(req.Email))
	if err != nil {
		return nil, nil, fmt.Errorf("failed to check email existence: %w", err)
	}
	if exists {
		return nil, nil, fmt.Errorf("email already registered")
	}

	// Hash password
	hashedPassword, err := u.passwordManager.HashPassword(req.Password)
	if err != nil {
		return nil, nil, fmt.Errorf("failed to hash password: %w", err)
	}

	// Create user
	user := &entities.User{
		Email:     strings.ToLower(req.Email),
		Password:  hashedPassword,
		FirstName: req.FirstName,
		LastName:  req.LastName,
	}

	if err := u.userRepo.Create(ctx, user); err != nil {
		return nil, nil, fmt.Errorf("failed to create user: %w", err)
	}

	// Generate tokens
	tokens, err := u.jwtManager.GenerateTokenPair(user.ID.Hex(), user.Email)
	if err != nil {
		return nil, nil, fmt.Errorf("failed to generate tokens: %w", err)
	}

	return user, tokens, nil
}

func (u *authUsecase) Login(ctx context.Context, req *entities.LoginRequest) (*entities.User, *auth.TokenPair, error) {
	// Get user by email
	user, err := u.userRepo.GetByEmail(ctx, strings.ToLower(req.Email))
	if err != nil {
		return nil, nil, fmt.Errorf("invalid credentials")
	}

	// Verify password
	if err := u.passwordManager.VerifyPassword(user.Password, req.Password); err != nil {
		return nil, nil, fmt.Errorf("invalid credentials")
	}

	// Update last login
	if err := u.userRepo.UpdateLastLogin(ctx, user.ID); err != nil {
		// Log error but don't fail the login
		fmt.Printf("Failed to update last login for user %s: %v\n", user.ID.Hex(), err)
	}

	// Generate tokens
	tokens, err := u.jwtManager.GenerateTokenPair(user.ID.Hex(), user.Email)
	if err != nil {
		return nil, nil, fmt.Errorf("failed to generate tokens: %w", err)
	}

	return user, tokens, nil
}

func (u *authUsecase) RefreshToken(ctx context.Context, refreshToken string) (string, error) {
	accessToken, err := u.jwtManager.RefreshAccessToken(refreshToken)
	if err != nil {
		return "", fmt.Errorf("failed to refresh token: %w", err)
	}

	return accessToken, nil
}

func (u *authUsecase) GetProfile(ctx context.Context, userID string) (*entities.User, error) {
	objectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, fmt.Errorf("invalid user ID: %w", err)
	}

	user, err := u.userRepo.GetByID(ctx, objectID)
	if err != nil {
		return nil, fmt.Errorf("failed to get user profile: %w", err)
	}

	return user, nil
}

func (u *authUsecase) UpdateProfile(ctx context.Context, userID string, req *entities.UpdateProfileRequest) (*entities.User, error) {
	objectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, fmt.Errorf("invalid user ID: %w", err)
	}

	// Get existing user
	user, err := u.userRepo.GetByID(ctx, objectID)
	if err != nil {
		return nil, fmt.Errorf("failed to get user: %w", err)
	}

	// Update only provided fields
	if req.FirstName != nil {
		user.FirstName = *req.FirstName
	}
	if req.LastName != nil {
		user.LastName = *req.LastName
	}
	if req.Avatar != nil {
		user.Avatar = *req.Avatar
	}

	if err := u.userRepo.Update(ctx, objectID, user); err != nil {
		return nil, fmt.Errorf("failed to update profile: %w", err)
	}

	return user, nil
}

func (u *authUsecase) ChangePassword(ctx context.Context, userID string, req *entities.ChangePasswordRequest) error {
	objectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return fmt.Errorf("invalid user ID: %w", err)
	}

	// Get user
	user, err := u.userRepo.GetByID(ctx, objectID)
	if err != nil {
		return fmt.Errorf("failed to get user: %w", err)
	}

	// Verify current password
	if err := u.passwordManager.VerifyPassword(user.Password, req.CurrentPassword); err != nil {
		return fmt.Errorf("current password is incorrect")
	}

	// Validate new password
	if err := u.passwordManager.ValidatePassword(req.NewPassword); err != nil {
		return fmt.Errorf("invalid new password: %w", err)
	}

	// Hash new password
	hashedPassword, err := u.passwordManager.HashPassword(req.NewPassword)
	if err != nil {
		return fmt.Errorf("failed to hash new password: %w", err)
	}

	// Update password
	user.Password = hashedPassword
	if err := u.userRepo.Update(ctx, objectID, user); err != nil {
		return fmt.Errorf("failed to update password: %w", err)
	}

	return nil
}

func (u *authUsecase) Logout(ctx context.Context, userID string) error {
	// In a more sophisticated implementation, you might:
	// 1. Blacklist the refresh token
	// 2. Store logout timestamp
	// 3. Invalidate all sessions for the user
	
	// For now, we'll just return success
	// The client should remove the tokens
	return nil
}