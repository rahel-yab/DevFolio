package main

import (
	"log"

	"devfolio-backend/controller/routes"
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
	portfolioHandler := delivery.NewPortfolioHandler(portfolioUsecase)
	authHandler := delivery.NewAuthHandler(authUsecase, cfg)

	// Setup routes
	router := routes.SetupRoutes(portfolioHandler, authHandler, jwtManager, cfg)

	// Start server
	log.Printf("Starting server on port %s", cfg.Server.Port)
	if err := router.Run(":" + cfg.Server.Port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}