package delivery

import (
	"net/http"
	"strconv"

	"devfolio-backend/domain/entities"
	"devfolio-backend/usecase"
	
	"github.com/gin-gonic/gin"
)

type PortfolioHandler struct {
	portfolioUsecase usecase.PortfolioUsecase
}

func NewPortfolioHandler(portfolioUsecase usecase.PortfolioUsecase) *PortfolioHandler {
	return &PortfolioHandler{
		portfolioUsecase: portfolioUsecase,
	}
}

func (h *PortfolioHandler) CreatePortfolio(c *gin.Context) {
	var req entities.CreatePortfolioRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	portfolio, err := h.portfolioUsecase.CreatePortfolio(c.Request.Context(), &req, userID.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": portfolio})
}

func (h *PortfolioHandler) GetPortfolio(c *gin.Context) {
	id := c.Param("id")
	
	portfolio, err := h.portfolioUsecase.GetPortfolio(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": portfolio})
}

func (h *PortfolioHandler) GetUserPortfolios(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	portfolios, err := h.portfolioUsecase.GetUserPortfolios(c.Request.Context(), userID.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": portfolios})
}

func (h *PortfolioHandler) UpdatePortfolio(c *gin.Context) {
	id := c.Param("id")
	
	var req entities.UpdatePortfolioRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	portfolio, err := h.portfolioUsecase.UpdatePortfolio(c.Request.Context(), id, &req, userID.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": portfolio})
}

func (h *PortfolioHandler) DeletePortfolio(c *gin.Context) {
	id := c.Param("id")
	
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	if err := h.portfolioUsecase.DeletePortfolio(c.Request.Context(), id, userID.(string)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Portfolio deleted successfully"})
}

func (h *PortfolioHandler) GetPublicPortfolios(c *gin.Context) {
	limitStr := c.DefaultQuery("limit", "10")
	offsetStr := c.DefaultQuery("offset", "0")

	limit, err := strconv.Atoi(limitStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid limit parameter"})
		return
	}

	offset, err := strconv.Atoi(offsetStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid offset parameter"})
		return
	}

	portfolios, err := h.portfolioUsecase.GetPublicPortfolios(c.Request.Context(), limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": portfolios})
}

func (h *PortfolioHandler) SearchPortfolios(c *gin.Context) {
	query := c.Query("q")
	if query == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Search query is required"})
		return
	}

	limitStr := c.DefaultQuery("limit", "10")
	offsetStr := c.DefaultQuery("offset", "0")

	limit, err := strconv.Atoi(limitStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid limit parameter"})
		return
	}

	offset, err := strconv.Atoi(offsetStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid offset parameter"})
		return
	}

	portfolios, err := h.portfolioUsecase.SearchPortfolios(c.Request.Context(), query, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": portfolios})
}

func (h *PortfolioHandler) EnhanceWithAI(c *gin.Context) {
	var req entities.AIEnhanceRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	portfolio, err := h.portfolioUsecase.EnhanceWithAI(c.Request.Context(), &req, userID.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": portfolio})
}