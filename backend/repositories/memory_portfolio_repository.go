package repositories

import (
	"context"
	"fmt"
	"sort"
	"strings"
	"time"

	"devfolio-backend/domain/entities"
	domainrepo "devfolio-backend/domain/repositories"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type memoryPortfolioRepository struct {
	store *memoryStore
}

func NewMemoryPortfolioRepository(store *memoryStore) domainrepo.PortfolioRepository {
	return &memoryPortfolioRepository{store: store}
}

func (r *memoryPortfolioRepository) Create(_ context.Context, portfolio *entities.Portfolio) error {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	portfolio.ID = primitive.NewObjectID()
	portfolio.CreatedAt = time.Now()
	portfolio.UpdatedAt = portfolio.CreatedAt

	r.store.portfolios[portfolio.ID] = clonePortfolio(portfolio)
	return nil
}

func (r *memoryPortfolioRepository) GetByID(_ context.Context, id primitive.ObjectID) (*entities.Portfolio, error) {
	r.store.mu.RLock()
	defer r.store.mu.RUnlock()

	portfolio, ok := r.store.portfolios[id]
	if !ok {
		return nil, fmt.Errorf("portfolio not found")
	}

	return clonePortfolio(portfolio), nil
}

func (r *memoryPortfolioRepository) GetByUserID(_ context.Context, userID string) ([]*entities.Portfolio, error) {
	r.store.mu.RLock()
	defer r.store.mu.RUnlock()

	var portfolios []*entities.Portfolio
	for _, portfolio := range r.store.portfolios {
		if portfolio.UserID == userID {
			portfolios = append(portfolios, clonePortfolio(portfolio))
		}
	}

	sortPortfolios(portfolios)
	return portfolios, nil
}

func (r *memoryPortfolioRepository) Update(_ context.Context, id primitive.ObjectID, portfolio *entities.Portfolio) error {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	existing, ok := r.store.portfolios[id]
	if !ok {
		return fmt.Errorf("portfolio not found")
	}

	portfolio.ID = id
	portfolio.CreatedAt = existing.CreatedAt
	portfolio.UpdatedAt = time.Now()

	r.store.portfolios[id] = clonePortfolio(portfolio)
	return nil
}

func (r *memoryPortfolioRepository) Delete(_ context.Context, id primitive.ObjectID) error {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	if _, ok := r.store.portfolios[id]; !ok {
		return fmt.Errorf("portfolio not found")
	}

	delete(r.store.portfolios, id)
	return nil
}

func (r *memoryPortfolioRepository) GetPublicPortfolios(_ context.Context, limit, offset int) ([]*entities.Portfolio, error) {
	r.store.mu.RLock()
	defer r.store.mu.RUnlock()

	var portfolios []*entities.Portfolio
	for _, portfolio := range r.store.portfolios {
		if portfolio.IsPublic {
			portfolios = append(portfolios, clonePortfolio(portfolio))
		}
	}

	sortPortfolios(portfolios)
	return paginatePortfolios(portfolios, limit, offset), nil
}

func (r *memoryPortfolioRepository) Search(_ context.Context, query string, limit, offset int) ([]*entities.Portfolio, error) {
	r.store.mu.RLock()
	defer r.store.mu.RUnlock()

	query = strings.ToLower(query)
	var portfolios []*entities.Portfolio

	for _, portfolio := range r.store.portfolios {
		if !portfolio.IsPublic {
			continue
		}
		if matchesPortfolioQuery(portfolio, query) {
			portfolios = append(portfolios, clonePortfolio(portfolio))
		}
	}

	sortPortfolios(portfolios)
	return paginatePortfolios(portfolios, limit, offset), nil
}

func matchesPortfolioQuery(portfolio *entities.Portfolio, query string) bool {
	if strings.Contains(strings.ToLower(portfolio.Name), query) ||
		strings.Contains(strings.ToLower(portfolio.Title), query) ||
		strings.Contains(strings.ToLower(portfolio.Bio), query) {
		return true
	}

	for _, skill := range portfolio.Skills {
		if strings.Contains(strings.ToLower(skill), query) {
			return true
		}
	}

	return false
}

func paginatePortfolios(portfolios []*entities.Portfolio, limit, offset int) []*entities.Portfolio {
	if offset < 0 {
		offset = 0
	}
	if limit <= 0 {
		limit = 10
	}
	if offset >= len(portfolios) {
		return []*entities.Portfolio{}
	}

	end := offset + limit
	if end > len(portfolios) {
		end = len(portfolios)
	}

	return portfolios[offset:end]
}

func sortPortfolios(portfolios []*entities.Portfolio) {
	sort.Slice(portfolios, func(i, j int) bool {
		return portfolios[i].CreatedAt.After(portfolios[j].CreatedAt)
	})
}

func clonePortfolio(portfolio *entities.Portfolio) *entities.Portfolio {
	copyValue := *portfolio
	copyValue.Experience = append([]entities.Experience(nil), portfolio.Experience...)
	copyValue.Education = append([]entities.Education(nil), portfolio.Education...)
	copyValue.Projects = append([]entities.Project(nil), portfolio.Projects...)
	copyValue.Skills = append([]string(nil), portfolio.Skills...)
	return &copyValue
}
