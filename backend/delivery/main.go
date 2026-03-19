package main

import (
	"log"

	ctrl "devfolio-backend/delivery/controller"
	"devfolio-backend/delivery/router"
	domainrepo "devfolio-backend/domain/repositories"
	"devfolio-backend/infrastructure/ai"
	"devfolio-backend/infrastructure/auth"
	"devfolio-backend/infrastructure/config"
	"devfolio-backend/infrastructure/database"
	"devfolio-backend/repositories"
	"devfolio-backend/usecase"
)

func main() {
	// Load configuration
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	var (
		portfolioRepo domainrepo.PortfolioRepository
		userRepo      domainrepo.UserRepository
	)

	// Initialize MongoDB, but fall back to in-memory repositories when it is unavailable.
	db, err := database.NewMongoDB(cfg)
	if err != nil {
		log.Printf("MongoDB unavailable, using in-memory repositories instead: %v", err)
		log.Printf("Development data will reset when the server restarts.")

		store := repositories.NewMemoryStore()
		portfolioRepo = repositories.NewMemoryPortfolioRepository(store)
		userRepo = repositories.NewMemoryUserRepository(store)
	} else {
		defer func() {
			if err := db.Close(); err != nil {
				log.Printf("Error closing database connection: %v", err)
			}
		}()

		portfolioRepo = repositories.NewPortfolioRepository(db)
		userRepo = repositories.NewUserRepository(db)
	}

	// Initialize AI client
	aiClient := ai.NewOpenAIClient(cfg)

	// Initialize auth managers
	jwtManager, err := auth.NewJWTManager(cfg)
	if err != nil {
		log.Fatalf("Failed to initialize JWT manager: %v", err)
	}
	passwordManager := auth.NewPasswordManager()

	// Initialize use cases
	portfolioUsecase := usecase.NewPortfolioUsecase(portfolioRepo, aiClient)
	authUsecase := usecase.NewAuthUsecase(userRepo, jwtManager, passwordManager)

	// Initialize handlers
	portfolioHandler := ctrl.NewPortfolioHandler(portfolioUsecase)
	authHandler := ctrl.NewAuthHandler(authUsecase, cfg)

	// Setup routes
	ginRouter := router.SetupRoutes(portfolioHandler, authHandler, jwtManager, cfg)

	// Start server
	log.Printf("Starting server on port %s", cfg.Server.Port)
	if err := ginRouter.Run(":" + cfg.Server.Port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
