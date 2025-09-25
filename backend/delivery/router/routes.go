package router

import (
	ctrl "devfolio-backend/delivery/controller"
	"devfolio-backend/infrastructure/auth"
	"devfolio-backend/infrastructure/config"
	"devfolio-backend/infrastructure/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(
	portfolioHandler *ctrl.PortfolioHandler,
	authHandler *ctrl.AuthHandler,
	jwtManager *auth.JWTManager,
	cfg *config.Config,
) *gin.Engine {
	// Set Gin mode
	gin.SetMode(cfg.Server.GinMode)
	
	router := gin.Default()

	// CORS middleware
	corsConfig := cors.DefaultConfig()
	corsConfig.AllowOrigins = []string{cfg.CORS.FrontendURL}
	corsConfig.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	corsConfig.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization", "X-User-ID"}
	corsConfig.AllowCredentials = true
	
	router.Use(cors.New(corsConfig))

	// Health check endpoint
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok", "message": "DevFolio API is running"})
	})

	// API v1 routes
	v1 := router.Group("/api/v1")
	{
		// Auth routes (public)
		auth := v1.Group("/auth")
		{
			auth.POST("/register", authHandler.Register)
			auth.POST("/login", authHandler.Login)
			auth.POST("/refresh", authHandler.RefreshToken)
		}

		// Protected auth routes
		authProtected := v1.Group("/auth")
		authProtected.Use(middleware.AuthMiddleware(jwtManager))
		{
			authProtected.POST("/logout", authHandler.Logout)
			authProtected.GET("/profile", authHandler.GetProfile)
			authProtected.PUT("/profile", authHandler.UpdateProfile)
			authProtected.PUT("/change-password", authHandler.ChangePassword)
		}

		// Portfolio routes
		portfolios := v1.Group("/portfolios")
		portfolios.Use(middleware.OptionalAuthMiddleware(jwtManager)) // Some endpoints allow optional auth
		{
			portfolios.GET("/public", portfolioHandler.GetPublicPortfolios)
			portfolios.GET("/search", portfolioHandler.SearchPortfolios)
			portfolios.GET("/:id", portfolioHandler.GetPortfolio)
		}

		// Protected portfolio routes
		portfoliosProtected := v1.Group("/portfolios")
		portfoliosProtected.Use(middleware.AuthMiddleware(jwtManager))
		{
			portfoliosProtected.POST("", portfolioHandler.CreatePortfolio)
			portfoliosProtected.GET("/user", portfolioHandler.GetUserPortfolios)
			portfoliosProtected.PUT("/:id", portfolioHandler.UpdatePortfolio)
			portfoliosProtected.DELETE("/:id", portfolioHandler.DeletePortfolio)
			portfoliosProtected.POST("/enhance", portfolioHandler.EnhanceWithAI)
		}
	}

	return router
}