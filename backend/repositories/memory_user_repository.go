package repositories

import (
	"context"
	"fmt"
	"strings"
	"time"

	"devfolio-backend/domain/entities"
	domainrepo "devfolio-backend/domain/repositories"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type memoryUserRepository struct {
	store *memoryStore
}

func NewMemoryUserRepository(store *memoryStore) domainrepo.UserRepository {
	return &memoryUserRepository{store: store}
}

func (r *memoryUserRepository) Create(_ context.Context, user *entities.User) error {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	user.ID = primitive.NewObjectID()
	user.Email = strings.ToLower(user.Email)
	user.CreatedAt = time.Now()
	user.UpdatedAt = user.CreatedAt
	user.IsActive = true

	clone := *user
	r.store.users[user.ID] = &clone
	r.store.usersByKey[clone.Email] = clone.ID
	return nil
}

func (r *memoryUserRepository) GetByID(_ context.Context, id primitive.ObjectID) (*entities.User, error) {
	r.store.mu.RLock()
	defer r.store.mu.RUnlock()

	user, ok := r.store.users[id]
	if !ok || !user.IsActive {
		return nil, fmt.Errorf("user not found")
	}

	clone := *user
	return &clone, nil
}

func (r *memoryUserRepository) GetByEmail(_ context.Context, email string) (*entities.User, error) {
	r.store.mu.RLock()
	defer r.store.mu.RUnlock()

	id, ok := r.store.usersByKey[strings.ToLower(email)]
	if !ok {
		return nil, fmt.Errorf("user not found")
	}

	user, ok := r.store.users[id]
	if !ok || !user.IsActive {
		return nil, fmt.Errorf("user not found")
	}

	clone := *user
	return &clone, nil
}

func (r *memoryUserRepository) Update(_ context.Context, id primitive.ObjectID, user *entities.User) error {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	existing, ok := r.store.users[id]
	if !ok || !existing.IsActive {
		return fmt.Errorf("user not found")
	}

	user.ID = id
	user.Email = strings.ToLower(user.Email)
	user.CreatedAt = existing.CreatedAt
	user.UpdatedAt = time.Now()

	clone := *user
	r.store.users[id] = &clone
	r.store.usersByKey[clone.Email] = clone.ID
	return nil
}

func (r *memoryUserRepository) UpdateLastLogin(_ context.Context, id primitive.ObjectID) error {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	user, ok := r.store.users[id]
	if !ok || !user.IsActive {
		return fmt.Errorf("user not found")
	}

	now := time.Now()
	user.LastLoginAt = &now
	user.UpdatedAt = now
	return nil
}

func (r *memoryUserRepository) Delete(_ context.Context, id primitive.ObjectID) error {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	user, ok := r.store.users[id]
	if !ok {
		return fmt.Errorf("user not found")
	}

	user.IsActive = false
	user.UpdatedAt = time.Now()
	return nil
}

func (r *memoryUserRepository) EmailExists(_ context.Context, email string) (bool, error) {
	r.store.mu.RLock()
	defer r.store.mu.RUnlock()

	id, ok := r.store.usersByKey[strings.ToLower(email)]
	if !ok {
		return false, nil
	}

	user, ok := r.store.users[id]
	return ok && user.IsActive, nil
}
