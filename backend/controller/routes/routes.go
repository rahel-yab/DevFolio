package routes

import (
	"devfolio-backend/controller/delivery"
	"devfolio-backend/infrastructure/config"
	
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(
	portfolioHandler *delivery.PortfolioHandler,
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
		// Portfolio routes
		portfolios := v1.Group("/portfolios")
		{
			portfolios.POST("", portfolioHandler.CreatePortfolio)
			portfolios.GET("/user", portfolioHandler.GetUserPortfolios)
			portfolios.GET("/public", portfolioHandler.GetPublicPortfolios)
			portfolios.GET("/search", portfolioHandler.SearchPortfolios)
			portfolios.GET("/:id", portfolioHandler.GetPortfolio)
			portfolios.PUT("/:id", portfolioHandler.UpdatePortfolio)
			portfolios.DELETE("/:id", portfolioHandler.DeletePortfolio)
			portfolios.POST("/enhance", portfolioHandler.EnhanceWithAI)
		}
	}

	return router
}