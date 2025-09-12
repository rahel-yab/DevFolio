# DevFolio Backend Makefile

.PHONY: build run dev test clean deps docker-build docker-run

# Variables
BINARY_NAME=devfolio-backend
MAIN_PATH=./controller/main.go

# Build the application
build:
	go build -o bin/$(BINARY_NAME) $(MAIN_PATH)

# Run the application
run: build
	./bin/$(BINARY_NAME)

# Run in development mode with hot reload (requires air)
dev:
	air

# Run tests
test:
	go test -v ./...

# Clean build artifacts
clean:
	rm -rf bin/
	go clean

# Download dependencies
deps:
	go mod download
	go mod tidy

# Install development tools
install-tools:
	go install github.com/cosmtrek/air@latest

# Docker commands
docker-build:
	docker build -t devfolio-backend .

docker-run:
	docker run -p 8080:8080 --env-file .env devfolio-backend

# Database commands
db-up:
	docker run -d --name devfolio-mongo -p 27017:27017 mongo:latest

db-down:
	docker stop devfolio-mongo && docker rm devfolio-mongo

# Format code
fmt:
	go fmt ./...

# Lint code (requires golangci-lint)
lint:
	golangci-lint run

# Generate swagger docs (requires swag)
swagger:
	swag init -g controller/main.go