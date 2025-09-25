# DevFolio Backend

## Architecture

This project follows Clean Architecture principles with the following structure:

```
backend/
├── controller/          # HTTP handlers and 
routing
│   ├── routes/         # Route definitions
├── delivery/       # HTTP request/response handlers
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
│   └── middleware/    # auth_middleware service
└── config/            # Configuration files
```

## Features

- **Clean Architecture**: Separation of concerns with clear dependency boundaries
- **JWT Authentication**: Secure authentication with access and refresh tokens
- **HTTP-Only Cookies**: Refresh tokens stored securely in HTTP-only cookies
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
go mod tidy
```

3. Set up environment variables:
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
```bash
go run delivery/main.go
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout user (requires auth)
- `GET /api/v1/auth/profile` - Get user profile (requires auth)
- `PUT /api/v1/auth/profile` - Update user profile (requires auth)
- `PUT /api/v1/auth/change-password` - Change password (requires auth)

### Portfolios
- `POST /api/v1/portfolios` - Create a new portfolio (requires auth)
- `GET /api/v1/portfolios/user` - Get user's portfolios (requires auth)
- `GET /api/v1/portfolios/public` - Get public portfolios
- `GET /api/v1/portfolios/search` - Search portfolios
- `GET /api/v1/portfolios/:id` - Get portfolio by ID
- `PUT /api/v1/portfolios/:id` - Update portfolio (requires auth)
- `DELETE /api/v1/portfolios/:id` - Delete portfolio (requires auth)
- `POST /api/v1/portfolios/enhance` - Enhance portfolio with AI (requires auth)

## Database Setup


### MongoDB Atlas
Set your MongoDB Atlas connection string in the `MONGODB_URI` environment variable.

## Project Structure Details

### Domain Layer
- **Entities**: Core business models (Portfolio, Experience, Education, Project)
- **Repositories**: Interfaces for data access

### Use Case Layer
- **Portfolio Use Case**: Business logic for portfolio operations
- **Auth Use Case**: Authentication and user management logic
- **AI Enhancement**: Logic for AI-powered content generation

### Infrastructure Layer
- **Database**: MongoDB connection and operations
- **Auth**: JWT token management and password hashing
- **AI**: OpenAI client integration
- **Config**: Configuration management with Viper

### Controller Layer
- **Delivery**: HTTP handlers for API endpoints
- **Middleware**: Authentication middleware for protected routes
- **Routes**: Route definitions and middleware setup

## AI Features

The backend integrates with OpenAI to provide:

1. **Portfolio Content Enhancement**: Improve bio and descriptions
2. **Project Description Generation**: Generate compelling project descriptions
3. **Content Suggestions**: AI-powered suggestions for portfolio improvement

## Authentication Flow

1. **Registration/Login**: User provides credentials
2. **Token Generation**: Server generates access token (15min) and refresh token (7 days)
3. **Token Storage**: 
   - Access token sent in response body
   - Refresh token stored in HTTP-only cookie
4. **API Requests**: Client sends access token in Authorization header
5. **Token Refresh**: When access token expires, client uses refresh endpoint
6. **Logout**: Server clears refresh token cookie

## Security Features

- **Password Hashing**: bcrypt with cost factor 12
- **JWT Tokens**: Signed with HMAC-SHA256
- **HTTP-Only Cookies**: Refresh tokens not accessible via JavaScript
- **CORS Protection**: Configured for specific frontend origin
- **Input Validation**: Request validation with Gin binding
- **Soft Delete**: Users are deactivated, not permanently deleted
