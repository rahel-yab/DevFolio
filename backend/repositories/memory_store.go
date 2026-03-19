package repositories

import (
	"sync"

	"devfolio-backend/domain/entities"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type memoryStore struct {
	mu sync.RWMutex

	users      map[primitive.ObjectID]*entities.User
	usersByKey map[string]primitive.ObjectID

	portfolios map[primitive.ObjectID]*entities.Portfolio
}

func NewMemoryStore() *memoryStore {
	return &memoryStore{
		users:      make(map[primitive.ObjectID]*entities.User),
		usersByKey: make(map[string]primitive.ObjectID),
		portfolios: make(map[primitive.ObjectID]*entities.Portfolio),
	}
}
