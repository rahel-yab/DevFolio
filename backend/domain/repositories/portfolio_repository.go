package repositories

import (
	"context"
	"devfolio-backend/domain/entities"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type PortfolioRepository interface {
	Create(ctx context.Context, portfolio *entities.Portfolio) error
	GetByID(ctx context.Context, id primitive.ObjectID) (*entities.Portfolio, error)
	GetByUserID(ctx context.Context, userID string) ([]*entities.Portfolio, error)
	Update(ctx context.Context, id primitive.ObjectID, portfolio *entities.Portfolio) error
	Delete(ctx context.Context, id primitive.ObjectID) error
	GetPublicPortfolios(ctx context.Context, limit, offset int) ([]*entities.Portfolio, error)
	Search(ctx context.Context, query string, limit, offset int) ([]*entities.Portfolio, error)
}