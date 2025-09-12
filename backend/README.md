# DevFolio Backend

A Go-based backend service for the DevFolio AI-powered developer portfolio builder, following clean architecture principles.

## Architecture

This project follows Clean Architecture principles with the following structure:

```
backend/
├── controller/          # HTTP handlers and routing
│   ├── delivery/       # HTTP request/response handlers
│   ├── routes/         # Route definitions
│   └── main.go         # Application entry point
├── usecase/            # Business logic layer
├── domain/             # Core business entities and interfaces
│   ├── entities/       # Domain models
│   └── repositories/   # Repository interfaces
├── repositories/       # Repository implementations
├── infrastructure/     # External dependencies
│   ├── config/         # Configuration management
│   ├── database/       # Database connections
│   └── ai/            # AI service integrations
└── config/            # Configuration files
```

## Features

- **Clean Architecture**: Separation of concerns with clear dependency boundaries
- **MongoDB Integration**: Document-based storage for portfolio data
- **AI Enhancement**: OpenAI integration for portfolio content generation
- **RESTful API**: Well-structured HTTP endpoints
- **Configuration Management**: Viper-based config with environment variable support
- **CORS Support**: Cross-origin resource sharing for frontend integration
- **Hot Reload**: Air integration for development

## Prerequisites

- Go 1.21 or higher
- MongoDB (local or cloud instance)
- OpenAI API key (for AI features)

## Installation

1. Clone the repository and navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
make deps
```

3. Install development tools (optional):
```bash
make install-tools
```

4. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

## Configuration

The application uses Viper for configuration management. You can configure the application using:

1. Environment variables
2. `.env` file
3. `config.yaml` file (optional)

### Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `DATABASE_NAME`: Database name
- `PORT`: Server port (default: 8080)
- `GIN_MODE`: Gin framework mode (debug/release)
- `OPENAI_API_KEY`: OpenAI API key for AI features
- `OPENAI_MODEL`: OpenAI model to use (default: gpt-3.5-turbo)
- `FRONTEND_URL`: Frontend URL for CORS (default: http://localhost:3000)

## Running the Application

### Development Mode (with hot reload)
```bash
make dev
```

### Production Mode
```bash
make build
make run
```

### Using Docker
```bash
make docker-build
make docker-run
```

## API Endpoints

### Health Check
- `GET /health` - Health check endpoint

### Portfolios
- `POST /api/v1/portfolios` - Create a new portfolio
- `GET /api/v1/portfolios/user` - Get user's portfolios
- `GET /api/v1/portfolios/public` - Get public portfolios
- `GET /api/v1/portfolios/search` - Search portfolios
- `GET /api/v1/portfolios/:id` - Get portfolio by ID
- `PUT /api/v1/portfolios/:id` - Update portfolio
- `DELETE /api/v1/portfolios/:id` - Delete portfolio
- `POST /api/v1/portfolios/enhance` - Enhance portfolio with AI

## Database Setup

### Local MongoDB
```bash
make db-up
```

### MongoDB Atlas
Set your MongoDB Atlas connection string in the `MONGODB_URI` environment variable.

## Development

### Code Formatting
```bash
make fmt
```

### Running Tests
```bash
make test
```

### Linting (requires golangci-lint)
```bash
make lint
```

### Generating Swagger Documentation (requires swag)
```bash
make swagger
```

## Project Structure Details

### Domain Layer
- **Entities**: Core business models (Portfolio, Experience, Education, Project)
- **Repositories**: Interfaces for data access

### Use Case Layer
- **Portfolio Use Case**: Business logic for portfolio operations
- **AI Enhancement**: Logic for AI-powered content generation

### Infrastructure Layer
- **Database**: MongoDB connection and operations
- **AI**: OpenAI client integration
- **Config**: Configuration management with Viper

### Controller Layer
- **Delivery**: HTTP handlers for API endpoints
- **Routes**: Route definitions and middleware setup

## AI Features

The backend integrates with OpenAI to provide:

1. **Portfolio Content Enhancement**: Improve bio and descriptions
2. **Project Description Generation**: Generate compelling project descriptions
3. **Content Suggestions**: AI-powered suggestions for portfolio improvement

## Contributing

1. Follow Go best practices and conventions
2. Maintain clean architecture principles
3. Add tests for new features
4. Update documentation as needed

## License

This project is licensed under the MIT License.