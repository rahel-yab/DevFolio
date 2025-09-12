package usecase

import (
	"context"
	"fmt"

	"devfolio-backend/domain/entities"
	"devfolio-backend/domain/repositories"
	"devfolio-backend/infrastructure/ai"
	
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type PortfolioUsecase interface {
	CreatePortfolio(ctx context.Context, req *entities.CreatePortfolioRequest, userID string) (*entities.Portfolio, error)
	GetPortfolio(ctx context.Context, id string) (*entities.Portfolio, error)
	GetUserPortfolios(ctx context.Context, userID string) ([]*entities.Portfolio, error)
	UpdatePortfolio(ctx context.Context, id string, req *entities.UpdatePortfolioRequest, userID string) (*entities.Portfolio, error)
	DeletePortfolio(ctx context.Context, id string, userID string) error
	GetPublicPortfolios(ctx context.Context, limit, offset int) ([]*entities.Portfolio, error)
	SearchPortfolios(ctx context.Context, query string, limit, offset int) ([]*entities.Portfolio, error)
	EnhanceWithAI(ctx context.Context, req *entities.AIEnhanceRequest, userID string) (*entities.Portfolio, error)
}

type portfolioUsecase struct {
	portfolioRepo repositories.PortfolioRepository
	aiClient      *ai.OpenAIClient
}

func NewPortfolioUsecase(portfolioRepo repositories.PortfolioRepository, aiClient *ai.OpenAIClient) PortfolioUsecase {
	return &portfolioUsecase{
		portfolioRepo: portfolioRepo,
		aiClient:      aiClient,
	}
}

func (u *portfolioUsecase) CreatePortfolio(ctx context.Context, req *entities.CreatePortfolioRequest, userID string) (*entities.Portfolio, error) {
	portfolio := &entities.Portfolio{
		UserID:     userID,
		Name:       req.Name,
		Title:      req.Title,
		Bio:        req.Bio,
		Email:      req.Email,
		Phone:      req.Phone,
		Location:   req.Location,
		Website:    req.Website,
		LinkedIn:   req.LinkedIn,
		GitHub:     req.GitHub,
		Experience: req.Experience,
		Education:  req.Education,
		Projects:   req.Projects,
		Skills:     req.Skills,
		Template:   req.Template,
		IsPublic:   false, // Default to private
	}

	if err := u.portfolioRepo.Create(ctx, portfolio); err != nil {
		return nil, fmt.Errorf("failed to create portfolio: %w", err)
	}

	return portfolio, nil
}

func (u *portfolioUsecase) GetPortfolio(ctx context.Context, id string) (*entities.Portfolio, error) {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, fmt.Errorf("invalid portfolio ID: %w", err)
	}

	portfolio, err := u.portfolioRepo.GetByID(ctx, objectID)
	if err != nil {
		return nil, fmt.Errorf("failed to get portfolio: %w", err)
	}

	return portfolio, nil
}

func (u *portfolioUsecase) GetUserPortfolios(ctx context.Context, userID string) ([]*entities.Portfolio, error) {
	portfolios, err := u.portfolioRepo.GetByUserID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get user portfolios: %w", err)
	}

	return portfolios, nil
}

func (u *portfolioUsecase) UpdatePortfolio(ctx context.Context, id string, req *entities.UpdatePortfolioRequest, userID string) (*entities.Portfolio, error) {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, fmt.Errorf("invalid portfolio ID: %w", err)
	}

	// Get existing portfolio to verify ownership
	existing, err := u.portfolioRepo.GetByID(ctx, objectID)
	if err != nil {
		return nil, fmt.Errorf("failed to get portfolio: %w", err)
	}

	if existing.UserID != userID {
		return nil, fmt.Errorf("unauthorized: portfolio belongs to different user")
	}

	// Update only provided fields
	if req.Name != nil {
		existing.Name = *req.Name
	}
	if req.Title != nil {
		existing.Title = *req.Title
	}
	if req.Bio != nil {
		existing.Bio = *req.Bio
	}
	if req.Email != nil {
		existing.Email = *req.Email
	}
	if req.Phone != nil {
		existing.Phone = *req.Phone
	}
	if req.Location != nil {
		existing.Location = *req.Location
	}
	if req.Website != nil {
		existing.Website = *req.Website
	}
	if req.LinkedIn != nil {
		existing.LinkedIn = *req.LinkedIn
	}
	if req.GitHub != nil {
		existing.GitHub = *req.GitHub
	}
	if req.Experience != nil {
		existing.Experience = *req.Experience
	}
	if req.Education != nil {
		existing.Education = *req.Education
	}
	if req.Projects != nil {
		existing.Projects = *req.Projects
	}
	if req.Skills != nil {
		existing.Skills = *req.Skills
	}
	if req.Template != nil {
		existing.Template = *req.Template
	}
	if req.IsPublic != nil {
		existing.IsPublic = *req.IsPublic
	}

	if err := u.portfolioRepo.Update(ctx, objectID, existing); err != nil {
		return nil, fmt.Errorf("failed to update portfolio: %w", err)
	}

	return existing, nil
}

func (u *portfolioUsecase) DeletePortfolio(ctx context.Context, id string, userID string) error {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return fmt.Errorf("invalid portfolio ID: %w", err)
	}

	// Verify ownership
	existing, err := u.portfolioRepo.GetByID(ctx, objectID)
	if err != nil {
		return fmt.Errorf("failed to get portfolio: %w", err)
	}

	if existing.UserID != userID {
		return fmt.Errorf("unauthorized: portfolio belongs to different user")
	}

	if err := u.portfolioRepo.Delete(ctx, objectID); err != nil {
		return fmt.Errorf("failed to delete portfolio: %w", err)
	}

	return nil
}

func (u *portfolioUsecase) GetPublicPortfolios(ctx context.Context, limit, offset int) ([]*entities.Portfolio, error) {
	if limit <= 0 {
		limit = 10
	}
	if limit > 100 {
		limit = 100
	}

	portfolios, err := u.portfolioRepo.GetPublicPortfolios(ctx, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("failed to get public portfolios: %w", err)
	}

	return portfolios, nil
}

func (u *portfolioUsecase) SearchPortfolios(ctx context.Context, query string, limit, offset int) ([]*entities.Portfolio, error) {
	if limit <= 0 {
		limit = 10
	}
	if limit > 100 {
		limit = 100
	}

	portfolios, err := u.portfolioRepo.Search(ctx, query, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("failed to search portfolios: %w", err)
	}

	return portfolios, nil
}

func (u *portfolioUsecase) EnhanceWithAI(ctx context.Context, req *entities.AIEnhanceRequest, userID string) (*entities.Portfolio, error) {
	objectID, err := primitive.ObjectIDFromHex(req.PortfolioID)
	if err != nil {
		return nil, fmt.Errorf("invalid portfolio ID: %w", err)
	}

	// Get existing portfolio
	portfolio, err := u.portfolioRepo.GetByID(ctx, objectID)
	if err != nil {
		return nil, fmt.Errorf("failed to get portfolio: %w", err)
	}

	if portfolio.UserID != userID {
		return nil, fmt.Errorf("unauthorized: portfolio belongs to different user")
	}

	// Prepare user info for AI enhancement
	userInfo := map[string]interface{}{
		"name":       portfolio.Name,
		"title":      portfolio.Title,
		"bio":        portfolio.Bio,
		"experience": portfolio.Experience,
		"education":  portfolio.Education,
		"projects":   portfolio.Projects,
		"skills":     portfolio.Skills,
	}

	// Add context if provided
	for key, value := range req.Context {
		userInfo[key] = value
	}

	// Generate enhanced content
	enhancedContent, err := u.aiClient.GeneratePortfolioContent(ctx, userInfo)
	if err != nil {
		return nil, fmt.Errorf("failed to generate AI content: %w", err)
	}

	// For now, we'll enhance the bio with AI content
	// In a more sophisticated implementation, you could parse the AI response
	// and update specific fields based on the requested fields
	if len(req.Fields) == 0 || contains(req.Fields, "bio") {
		portfolio.Bio = enhancedContent
	}

	// Enhance project descriptions if requested
	if contains(req.Fields, "projects") {
		for i, project := range portfolio.Projects {
			if project.Name != "" {
				techStack := ""
				if len(project.TechStack) > 0 {
					for j, tech := range project.TechStack {
						if j > 0 {
							techStack += ", "
						}
						techStack += tech
					}
				}
				
				enhancedDesc, err := u.aiClient.GenerateProjectDescription(ctx, project.Name, techStack)
				if err == nil {
					portfolio.Projects[i].Description = enhancedDesc
				}
			}
		}
	}

	// Update the portfolio
	if err := u.portfolioRepo.Update(ctx, objectID, portfolio); err != nil {
		return nil, fmt.Errorf("failed to update portfolio with AI enhancements: %w", err)
	}

	return portfolio, nil
}

func contains(slice []string, item string) bool {
	for _, s := range slice {
		if s == item {
			return true
		}
	}
	return false
}