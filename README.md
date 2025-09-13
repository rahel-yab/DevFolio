# DevFolio – Full-Stack AI-powered Developer Portfolio Builder

DevFolio is a modern full-stack application that helps developers quickly build and showcase their portfolios. The frontend is built with Next.js and React, while the backend uses Go with MongoDB, following clean architecture principles. The application features AI-powered content enhancement using OpenAI.

## Architecture

```
devfolio/
├── frontend/           # Next.js React application
│   ├── src/
│   │   ├── app/       # Next.js app router pages
│   │   └── components/ # Reusable React components
│   └── public/        # Static assets
└── backend/           # Go backend service
    ├── controller/    # HTTP handlers and routing
    ├── usecase/       # Business logic layer
    ├── domain/        # Core entities and interfaces
    ├── repositories/  # Data access implementations
    └── infrastructure/ # External dependencies (DB, AI, config)
```

## Features

### Frontend
- ✨ Modern React UI with Tailwind CSS
- ⚡ Fast navigation using Next.js App Router
- 🗂️ Dashboard to manage portfolios
- 📝 Interactive portfolio editor with live preview
- 🎨 Multiple portfolio templates
- 📱 Responsive design

### Backend
- 🏗️ Clean Architecture with clear separation of concerns
- 🗄️ MongoDB integration for data persistence
- 🤖 OpenAI integration for AI-powered content enhancement
- 🔄 RESTful API with comprehensive endpoints
- ⚙️ Viper-based configuration management
- 🚀 Hot reload support for development

## Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript

### Backend
- **Language**: Go 1.21
- **Framework**: Gin (HTTP router)
- **Database**: MongoDB
- **AI**: OpenAI GPT
- **Config**: Viper
- **Development**: Air (hot reload)

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Go 1.21+
- MongoDB (local or cloud)
- OpenAI API key

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The frontend will be available at [http://localhost:3000](http://localhost:3000).

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
make deps
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start MongoDB (if running locally):
```bash
make db-up
```

5. Run the backend:
```bash
make dev  # Development mode with hot reload
# or
make run  # Production mode
```

The backend API will be available at [http://localhost:8080](http://localhost:8080).

## Configuration

### Backend Environment Variables

Create a `.env` file in the backend directory:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017
DATABASE_NAME=devfolio

# Server Configuration
PORT=8080
GIN_MODE=release

# AI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-3.5-turbo

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

## API Endpoints

### Health Check
- `GET /health` - API health status

### Portfolios
- `POST /api/v1/portfolios` - Create portfolio
- `GET /api/v1/portfolios/user` - Get user portfolios
- `GET /api/v1/portfolios/public` - Get public portfolios
- `GET /api/v1/portfolios/search?q=query` - Search portfolios
- `GET /api/v1/portfolios/:id` - Get portfolio by ID
- `PUT /api/v1/portfolios/:id` - Update portfolio
- `DELETE /api/v1/portfolios/:id` - Delete portfolio
- `POST /api/v1/portfolios/enhance` - AI-enhance portfolio

## Development

### Frontend Development
```bash
cd frontend
npm run dev     # Start development server
npm run build   # Build for production
npm run lint    # Run linting
```

### Backend Development
```bash
cd backend
make dev        # Start with hot reload
make test       # Run tests
make fmt        # Format code
make lint       # Run linting
```

## Docker Support

### Backend Docker
```bash
cd backend
make docker-build
make docker-run
```

## Project Structure

### Frontend Structure
```
frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Home page
│   │   ├── dashboard/        # Dashboard pages
│   │   ├── editor/           # Portfolio editor
│   │   ├── templates/        # Template selection
│   │   └── layout.tsx        # Root layout
│   └── components/
│       ├── Header.tsx        # Navigation header
│       └── Footer.tsx        # Site footer
└── public/                   # Static assets
```

### Backend Structure
```
backend/
├── controller/
│   ├── delivery/             # HTTP handlers
│   ├── routes/               # Route definitions
│   └── main.go              # Application entry point
├── usecase/                 # Business logic
├── domain/
│   ├── entities/            # Domain models
│   └── repositories/        # Repository interfaces
├── repositories/            # Repository implementations
└── infrastructure/
    ├── config/              # Configuration management
    ├── database/            # Database connections
    └── ai/                  # AI service integration
```

## AI Features

The application includes AI-powered features:

1. **Portfolio Enhancement**: Improve bio and descriptions using AI
2. **Project Description Generation**: Generate compelling project descriptions
3. **Content Suggestions**: AI-powered recommendations for portfolio improvement

## Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the existing code style and architecture
4. Add tests for new features
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
