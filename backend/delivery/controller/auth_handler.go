package controller

import (
	"net/http"
	"strings"
	"time"

	"devfolio-backend/domain/entities"
	"devfolio-backend/infrastructure/auth"
	"devfolio-backend/infrastructure/config"
	"devfolio-backend/usecase"
	
	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	authUsecase usecase.AuthUsecase
	config      *config.Config
	googleAuth  *auth.GoogleOAuthManager
}

func NewAuthHandler(authUsecase usecase.AuthUsecase, config *config.Config) *AuthHandler {
	return &AuthHandler{
		authUsecase: authUsecase,
		config:      config,
		googleAuth:  auth.NewGoogleOAuthManager(config),
	}
}

func (h *AuthHandler) Register(c *gin.Context) {
	var req entities.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, tokens, err := h.authUsecase.Register(c.Request.Context(), &req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Set refresh token as HTTP-only cookie
	h.setRefreshTokenCookie(c, tokens.RefreshToken)

	response := entities.LoginResponse{
		User:        user,
		AccessToken: tokens.AccessToken,
	}

	c.JSON(http.StatusCreated, gin.H{"data": response})
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req entities.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, tokens, err := h.authUsecase.Login(c.Request.Context(), &req)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	// Set refresh token as HTTP-only cookie
	h.setRefreshTokenCookie(c, tokens.RefreshToken)

	response := entities.LoginResponse{
		User:        user,
		AccessToken: tokens.AccessToken,
	}

	c.JSON(http.StatusOK, gin.H{"data": response})
}

func (h *AuthHandler) RefreshToken(c *gin.Context) {
	refreshToken, err := c.Cookie("refresh_token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "refresh token not found"})
		return
	}

	accessToken, err := h.authUsecase.RefreshToken(c.Request.Context(), refreshToken)
	if err != nil {
		// Clear invalid refresh token cookie
		h.clearRefreshTokenCookie(c)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid refresh token"})
		return
	}

	response := entities.RefreshTokenResponse{
		AccessToken: accessToken,
	}

	c.JSON(http.StatusOK, gin.H{"data": response})
}

func (h *AuthHandler) GoogleLogin(c *gin.Context) {
	if !h.googleAuth.IsConfigured() {
		c.Redirect(http.StatusTemporaryRedirect, h.googleAuth.FrontendCallbackURL(false, "Google login is not configured yet."))
		return
	}

	state, err := h.googleAuth.RandomState()
	if err != nil {
		c.Redirect(http.StatusTemporaryRedirect, h.googleAuth.FrontendCallbackURL(false, "Failed to initialize Google login."))
		return
	}

	h.applySameSite(c)
	c.SetCookie("google_oauth_state", state, 600, "/", h.config.Cookie.Domain, h.config.Cookie.Secure, true)
	c.Redirect(http.StatusTemporaryRedirect, h.googleAuth.BuildAuthorizationURL(state))
}

func (h *AuthHandler) GoogleCallback(c *gin.Context) {
	if !h.googleAuth.IsConfigured() {
		c.Redirect(http.StatusTemporaryRedirect, h.googleAuth.FrontendCallbackURL(false, "Google login is not configured yet."))
		return
	}

	if callbackError := c.Query("error"); callbackError != "" {
		c.Redirect(http.StatusTemporaryRedirect, h.googleAuth.FrontendCallbackURL(false, "Google authentication was canceled."))
		return
	}

	code := c.Query("code")
	state := c.Query("state")
	if code == "" || state == "" {
		c.Redirect(http.StatusTemporaryRedirect, h.googleAuth.FrontendCallbackURL(false, "Missing Google callback parameters."))
		return
	}

	cookieState, err := c.Cookie("google_oauth_state")
	if err != nil || cookieState == "" || cookieState != state {
		c.Redirect(http.StatusTemporaryRedirect, h.googleAuth.FrontendCallbackURL(false, "Google login state could not be verified."))
		return
	}

	profile, err := h.googleAuth.ExchangeCode(c.Request.Context(), code)
	if err != nil {
		c.Redirect(http.StatusTemporaryRedirect, h.googleAuth.FrontendCallbackURL(false, "Failed to complete Google login."))
		return
	}

	user, tokens, err := h.authUsecase.LoginWithGoogle(c.Request.Context(), profile)
	if err != nil {
		c.Redirect(http.StatusTemporaryRedirect, h.googleAuth.FrontendCallbackURL(false, "Failed to create or load your account."))
		return
	}

	h.clearGoogleStateCookie(c)
	h.setRefreshTokenCookie(c, tokens.RefreshToken)
	_ = user

	c.Redirect(http.StatusTemporaryRedirect, h.googleAuth.FrontendCallbackURL(true, ""))
}

func (h *AuthHandler) Logout(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	if err := h.authUsecase.Logout(c.Request.Context(), userID.(string)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Clear refresh token cookie
	h.clearRefreshTokenCookie(c)

	c.JSON(http.StatusOK, gin.H{"message": "logged out successfully"})
}

func (h *AuthHandler) GetProfile(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	user, err := h.authUsecase.GetProfile(c.Request.Context(), userID.(string))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": user.ToResponse()})
}

func (h *AuthHandler) UpdateProfile(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var req entities.UpdateProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := h.authUsecase.UpdateProfile(c.Request.Context(), userID.(string), &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": user.ToResponse()})
}

func (h *AuthHandler) ChangePassword(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var req entities.ChangePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.authUsecase.ChangePassword(c.Request.Context(), userID.(string), &req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "password changed successfully"})
}

func (h *AuthHandler) setRefreshTokenCookie(c *gin.Context, refreshToken string) {
	// Parse refresh token TTL
	refreshTTL, _ := time.ParseDuration(h.config.JWT.RefreshExpiry)
	h.applySameSite(c)

	c.SetCookie(
		"refresh_token",           // name
		refreshToken,              // value
		int(refreshTTL.Seconds()), // maxAge in seconds
		"/",                       // path
		h.config.Cookie.Domain,    // domain
		h.config.Cookie.Secure,    // secure
		true,                      // httpOnly
	)
}

func (h *AuthHandler) clearRefreshTokenCookie(c *gin.Context) {
	h.applySameSite(c)
	c.SetCookie(
		"refresh_token",        // name
		"",                     // value
		-1,                     // maxAge (expired)
		"/",                    // path
		h.config.Cookie.Domain, // domain
		h.config.Cookie.Secure, // secure
		true,                   // httpOnly
	)
}

func (h *AuthHandler) clearGoogleStateCookie(c *gin.Context) {
	h.applySameSite(c)
	c.SetCookie(
		"google_oauth_state",
		"",
		-1,
		"/",
		h.config.Cookie.Domain,
		h.config.Cookie.Secure,
		true,
	)
}

func (h *AuthHandler) applySameSite(c *gin.Context) {
	switch strings.ToLower(h.config.Cookie.SameSite) {
	case "strict":
		c.SetSameSite(http.SameSiteStrictMode)
	case "none":
		c.SetSameSite(http.SameSiteNoneMode)
	default:
		c.SetSameSite(http.SameSiteLaxMode)
	}
}
