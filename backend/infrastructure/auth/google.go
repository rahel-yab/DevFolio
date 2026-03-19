package auth

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strings"

	"devfolio-backend/domain/entities"
	"devfolio-backend/infrastructure/config"
)

const googleScope = "openid email profile"

type GoogleOAuthManager struct {
	clientID     string
	clientSecret string
	redirectURL  string
	frontendURL  string
	httpClient   *http.Client
}

type googleTokenResponse struct {
	AccessToken string `json:"access_token"`
}

type googleUserInfo struct {
	ID         string `json:"id"`
	Email      string `json:"email"`
	GivenName  string `json:"given_name"`
	FamilyName string `json:"family_name"`
	Picture    string `json:"picture"`
}

func NewGoogleOAuthManager(cfg *config.Config) *GoogleOAuthManager {
	return &GoogleOAuthManager{
		clientID:     cfg.Google.ClientID,
		clientSecret: cfg.Google.ClientSecret,
		redirectURL:  cfg.Google.RedirectURL,
		frontendURL:  cfg.CORS.FrontendURL,
		httpClient:   http.DefaultClient,
	}
}

func (g *GoogleOAuthManager) IsConfigured() bool {
	return g.clientID != "" && g.clientSecret != "" && g.redirectURL != ""
}

func (g *GoogleOAuthManager) BuildAuthorizationURL(state string) string {
	values := url.Values{}
	values.Set("client_id", g.clientID)
	values.Set("redirect_uri", g.redirectURL)
	values.Set("response_type", "code")
	values.Set("scope", googleScope)
	values.Set("access_type", "offline")
	values.Set("prompt", "consent")
	values.Set("state", state)
	return "https://accounts.google.com/o/oauth2/v2/auth?" + values.Encode()
}

func (g *GoogleOAuthManager) ExchangeCode(ctx context.Context, code string) (*entities.GoogleProfile, error) {
	if !g.IsConfigured() {
		return nil, fmt.Errorf("google login is not configured")
	}

	form := url.Values{}
	form.Set("code", code)
	form.Set("client_id", g.clientID)
	form.Set("client_secret", g.clientSecret)
	form.Set("redirect_uri", g.redirectURL)
	form.Set("grant_type", "authorization_code")

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, "https://oauth2.googleapis.com/token", strings.NewReader(form.Encode()))
	if err != nil {
		return nil, fmt.Errorf("failed to build token request: %w", err)
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	resp, err := g.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to exchange google code: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode >= http.StatusBadRequest {
		return nil, fmt.Errorf("google token exchange failed with status %d", resp.StatusCode)
	}

	var token googleTokenResponse
	if err := json.NewDecoder(resp.Body).Decode(&token); err != nil {
		return nil, fmt.Errorf("failed to decode google token response: %w", err)
	}
	if token.AccessToken == "" {
		return nil, fmt.Errorf("google did not return an access token")
	}

	userInfoURL := "https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + url.QueryEscape(token.AccessToken)
	userReq, err := http.NewRequestWithContext(ctx, http.MethodGet, userInfoURL, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to build google user request: %w", err)
	}

	userResp, err := g.httpClient.Do(userReq)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch google user profile: %w", err)
	}
	defer userResp.Body.Close()

	if userResp.StatusCode >= http.StatusBadRequest {
		return nil, fmt.Errorf("google user profile request failed with status %d", userResp.StatusCode)
	}

	var info googleUserInfo
	if err := json.NewDecoder(userResp.Body).Decode(&info); err != nil {
		return nil, fmt.Errorf("failed to decode google user profile: %w", err)
	}

	return &entities.GoogleProfile{
		GoogleID:  info.ID,
		Email:     strings.ToLower(info.Email),
		FirstName: info.GivenName,
		LastName:  info.FamilyName,
		Avatar:    info.Picture,
	}, nil
}

func (g *GoogleOAuthManager) RandomState() (string, error) {
	bytes := make([]byte, 32)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}

	return base64.RawURLEncoding.EncodeToString(bytes), nil
}

func (g *GoogleOAuthManager) FrontendCallbackURL(success bool, message string) string {
	values := url.Values{}
	if success {
		values.Set("status", "success")
	} else {
		values.Set("status", "error")
		values.Set("message", message)
	}
	return g.frontendURL + "/auth/google/callback?" + values.Encode()
}
