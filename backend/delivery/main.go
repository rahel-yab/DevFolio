package main

import (
	"log"

	ctrl "devfolio-backend/delivery/controller"
	"devfolio-backend/delivery/router"
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

	// Initialize MongoDB
	db, err := database.NewMongoDB(cfg)
	if err != nil {
		log.Fatalf("Failed to connect to MongoDB: %v", err)
	}
	defer func() {
		if err := db.Close(); err != nil {
			log.Printf("Error closing database connection: %v", err)
		}
	}()

	// Initialize AI client
	aiClient := ai.NewOpenAIClient(cfg)

	// Initialize auth managers
	jwtManager, err := auth.NewJWTManager(cfg)
	if err != nil {
		log.Fatalf("Failed to initialize JWT manager: %v", err)
	}
	passwordManager := auth.NewPasswordManager()

	// Initialize repositories
	portfolioRepo := repositories.NewPortfolioRepository(db)
	userRepo := repositories.NewUserRepository(db)

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