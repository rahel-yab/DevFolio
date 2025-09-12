package repositories

import (
	"context"
	"fmt"
	"time"

	"devfolio-backend/domain/entities"
	"devfolio-backend/domain/repositories"
	"devfolio-backend/infrastructure/database"
	
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type portfolioRepository struct {
	collection *mongo.Collection
}

func NewPortfolioRepository(db *database.MongoDB) repositories.PortfolioRepository {
	return &portfolioRepository{
		collection: db.GetCollection("portfolios"),
	}
}

func (r *portfolioRepository) Create(ctx context.Context, portfolio *entities.Portfolio) error {
	portfolio.ID = primitive.NewObjectID()
	portfolio.CreatedAt = time.Now()
	portfolio.UpdatedAt = time.Now()

	_, err := r.collection.InsertOne(ctx, portfolio)
	if err != nil {
		return fmt.Errorf("failed to create portfolio: %w", err)
	}

	return nil
}

func (r *portfolioRepository) GetByID(ctx context.Context, id primitive.ObjectID) (*entities.Portfolio, error) {
	var portfolio entities.Portfolio
	err := r.collection.FindOne(ctx, bson.M{"_id": id}).Decode(&portfolio)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, fmt.Errorf("portfolio not found")
		}
		return nil, fmt.Errorf("failed to get portfolio: %w", err)
	}

	return &portfolio, nil
}

func (r *portfolioRepository) GetByUserID(ctx context.Context, userID string) ([]*entities.Portfolio, error) {
	cursor, err := r.collection.Find(ctx, bson.M{"user_id": userID})
	if err != nil {
		return nil, fmt.Errorf("failed to get portfolios: %w", err)
	}
	defer cursor.Close(ctx)

	var portfolios []*entities.Portfolio
	if err := cursor.All(ctx, &portfolios); err != nil {
		return nil, fmt.Errorf("failed to decode portfolios: %w", err)
	}

	return portfolios, nil
}

func (r *portfolioRepository) Update(ctx context.Context, id primitive.ObjectID, portfolio *entities.Portfolio) error {
	portfolio.UpdatedAt = time.Now()
	
	update := bson.M{"$set": portfolio}
	result, err := r.collection.UpdateOne(ctx, bson.M{"_id": id}, update)
	if err != nil {
		return fmt.Errorf("failed to update portfolio: %w", err)
	}

	if result.MatchedCount == 0 {
		return fmt.Errorf("portfolio not found")
	}

	return nil
}

func (r *portfolioRepository) Delete(ctx context.Context, id primitive.ObjectID) error {
	result, err := r.collection.DeleteOne(ctx, bson.M{"_id": id})
	if err != nil {
		return fmt.Errorf("failed to delete portfolio: %w", err)
	}

	if result.DeletedCount == 0 {
		return fmt.Errorf("portfolio not found")
	}

	return nil
}

func (r *portfolioRepository) GetPublicPortfolios(ctx context.Context, limit, offset int) ([]*entities.Portfolio, error) {
	opts := options.Find().
		SetLimit(int64(limit)).
		SetSkip(int64(offset)).
		SetSort(bson.D{{Key: "created_at", Value: -1}})

	cursor, err := r.collection.Find(ctx, bson.M{"is_public": true}, opts)
	if err != nil {
		return nil, fmt.Errorf("failed to get public portfolios: %w", err)
	}
	defer cursor.Close(ctx)

	var portfolios []*entities.Portfolio
	if err := cursor.All(ctx, &portfolios); err != nil {
		return nil, fmt.Errorf("failed to decode portfolios: %w", err)
	}

	return portfolios, nil
}

func (r *portfolioRepository) Search(ctx context.Context, query string, limit, offset int) ([]*entities.Portfolio, error) {
	filter := bson.M{
		"is_public": true,
		"$or": []bson.M{
			{"name": bson.M{"$regex": query, "$options": "i"}},
			{"title": bson.M{"$regex": query, "$options": "i"}},
			{"bio": bson.M{"$regex": query, "$options": "i"}},
			{"skills": bson.M{"$regex": query, "$options": "i"}},
		},
	}

	opts := options.Find().
		SetLimit(int64(limit)).
		SetSkip(int64(offset)).
		SetSort(bson.D{{Key: "created_at", Value: -1}})

	cursor, err := r.collection.Find(ctx, filter, opts)
	if err != nil {
		return nil, fmt.Errorf("failed to search portfolios: %w", err)
	}
	defer cursor.Close(ctx)

	var portfolios []*entities.Portfolio
	if err := cursor.All(ctx, &portfolios); err != nil {
		return nil, fmt.Errorf("failed to decode portfolios: %w", err)
	}

	return portfolios, nil
}