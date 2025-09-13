package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/spf13/viper"
)

type Config struct {
	Database DatabaseConfig `mapstructure:"database"`
	Server   ServerConfig   `mapstructure:"server"`
	AI       AIConfig       `mapstructure:"ai"`
	CORS     CORSConfig     `mapstructure:"cors"`
	JWT      JWTConfig      `mapstructure:"jwt"`
	Cookie   CookieConfig   `mapstructure:"cookie"`
}

type DatabaseConfig struct {
	URI  string `mapstructure:"uri"`
	Name string `mapstructure:"name"`
}

type ServerConfig struct {
	Port    string `mapstructure:"port"`
	GinMode string `mapstructure:"gin_mode"`
}

type AIConfig struct {
	OpenAIAPIKey string `mapstructure:"openai_api_key"`
	OpenAIModel  string `mapstructure:"openai_model"`
}

type CORSConfig struct {
	FrontendURL string `mapstructure:"frontend_url"`
}

type JWTConfig struct {
	Secret        string `mapstructure:"secret"`
	AccessExpiry  string `mapstructure:"access_expiry"`
	RefreshExpiry string `mapstructure:"refresh_expiry"`
}

type CookieConfig struct {
	Domain   string `mapstructure:"domain"`
	Secure   bool   `mapstructure:"secure"`
	SameSite string `mapstructure:"same_site"`
}

func LoadConfig() (*Config, error) {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	// Configure Viper
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath("./config")
	viper.AddConfigPath(".")

	// Set environment variable bindings
	viper.SetEnvPrefix("DEVFOLIO")
	viper.AutomaticEnv()

	// Set defaults
	setDefaults()

	// Read config file (optional)
	if err := viper.ReadInConfig(); err != nil {
		log.Println("No config file found, using environment variables and defaults")
	}

	// Override with environment variables
	overrideWithEnvVars()

	var config Config
	if err := viper.Unmarshal(&config); err != nil {
		return nil, err
	}

	return &config, nil
}

func setDefaults() {
	viper.SetDefault("database.uri", "mongodb://localhost:27017")
	viper.SetDefault("database.name", "devfolio")
	viper.SetDefault("server.port", "8080")
	viper.SetDefault("server.gin_mode", "release")
	viper.SetDefault("ai.openai_model", "gpt-3.5-turbo")
	viper.SetDefault("cors.frontend_url", "http://localhost:3000")
	viper.SetDefault("jwt.secret", "devfolio-default-secret-key-change-in-production")
	viper.SetDefault("jwt.access_expiry", "15m")
	viper.SetDefault("jwt.refresh_expiry", "168h")
	viper.SetDefault("cookie.domain", "localhost")
	viper.SetDefault("cookie.secure", false)
	viper.SetDefault("cookie.same_site", "lax")
}

func overrideWithEnvVars() {
	if uri := os.Getenv("MONGODB_URI"); uri != "" {
		viper.Set("database.uri", uri)
	}
	if name := os.Getenv("DATABASE_NAME"); name != "" {
		viper.Set("database.name", name)
	}
	if port := os.Getenv("PORT"); port != "" {
		viper.Set("server.port", port)
	}
	if mode := os.Getenv("GIN_MODE"); mode != "" {
		viper.Set("server.gin_mode", mode)
	}
	if key := os.Getenv("OPENAI_API_KEY"); key != "" {
		viper.Set("ai.openai_api_key", key)
	}
	if model := os.Getenv("OPENAI_MODEL"); model != "" {
		viper.Set("ai.openai_model", model)
	}
	if url := os.Getenv("FRONTEND_URL"); url != "" {
		viper.Set("cors.frontend_url", url)
	}
	if secret := os.Getenv("JWT_SECRET"); secret != "" {
		viper.Set("jwt.secret", secret)
	}
	if expiry := os.Getenv("JWT_ACCESS_EXPIRY"); expiry != "" {
		viper.Set("jwt.access_expiry", expiry)
	}
	if expiry := os.Getenv("JWT_REFRESH_EXPIRY"); expiry != "" {
		viper.Set("jwt.refresh_expiry", expiry)
	}
	if domain := os.Getenv("COOKIE_DOMAIN"); domain != "" {
		viper.Set("cookie.domain", domain)
	}
	if secure := os.Getenv("COOKIE_SECURE"); secure != "" {
		viper.Set("cookie.secure", secure == "true")
	}
	if sameSite := os.Getenv("COOKIE_SAME_SITE"); sameSite != "" {
		viper.Set("cookie.same_site", sameSite)
	}
}