# 🚀 DevFolio – AI-Powered Developer Portfolio Builder

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Go-1.21-00ADD8?style=for-the-badge&logo=go" alt="Go" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white" alt="OpenAI" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
</div>

<div align="center">
  <h3>✨ Create stunning developer portfolios in minutes with AI-powered content enhancement ✨</h3>
  <p>A modern, full-stack application that empowers developers to build professional portfolios with ease. Features beautiful templates, real-time preview, and intelligent content suggestions.</p>
</div>

---

## 🌟 Why DevFolio?

DevFolio transforms the tedious process of portfolio creation into an enjoyable, streamlined experience. Built with modern technologies and clean architecture principles, it offers:

- **🎨 Professional Templates** - Choose from carefully crafted, responsive designs
- **⚡ Real-time Preview** - See your changes instantly as you build
- **🤖 AI Enhancement** - Leverage OpenAI to improve your content
- **📱 Mobile-First Design** - Looks perfect on all devices
- **🔒 Secure Authentication** - Complete user management system
- **📊 Portfolio Management** - Dashboard to organize all your portfolios

## 📸 Application Screenshots

### 🏠 Landing Page
Beautiful, modern landing page with clear call-to-action and feature highlights.

### 🎨 Template Selection
Choose from multiple professionally designed templates, each optimized for different developer profiles.

### ✏️ Portfolio Editor
Intuitive form-based editor with real-time preview. Add your personal information, work experience, education, projects, and skills with ease.

### 📊 Dashboard
Comprehensive dashboard to manage all your portfolios, track progress, and access quick actions.

### 👤 Profile Management
Complete user profile system with avatar upload and personal information management.

## ✨ Key Features

### 🎯 Core Functionality
- **Portfolio Builder** - Step-by-step guided portfolio creation
- **Live Preview** - Real-time preview as you edit
- **Multiple Templates** - Professional, responsive designs
- **Export Options** - Download or share your portfolio
- **Portfolio Management** - Create, edit, delete multiple portfolios

### 🤖 AI-Powered Features
- **Content Enhancement** - Improve descriptions with AI
- **Smart Suggestions** - Get recommendations for better content
- **Auto-formatting** - Intelligent text formatting and structure

### 🔐 User Experience
- **Secure Authentication** - JWT-based user sessions
- **Profile Management** - Upload avatar, manage personal info
- **Responsive Design** - Works perfectly on all devices
- **Fast Performance** - Optimized for speed and efficiency

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

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **Go** 1.21+
- **MongoDB** (local or cloud instance)
- **OpenAI API Key** for AI features

### 🔧 Installation & Setup

#### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/devfolio.git
cd devfolio
```

#### 2️⃣ Backend Setup
```bash
cd backend

# Install dependencies
make deps

# Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB URI and OpenAI API key

# Start MongoDB (if running locally)
make db-up

# Run the backend with hot reload
make dev
```
🌐 Backend will be available at **http://localhost:8080**

#### 3️⃣ Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
🌐 Frontend will be available at **http://localhost:3000**

### 🎉 You're Ready!
Open your browser and navigate to `http://localhost:3000` to start building your portfolio!

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

## 🤖 AI-Powered Features

DevFolio leverages OpenAI's advanced language models to enhance your portfolio content:

### ✨ Content Enhancement
- **Bio Optimization** - Transform basic descriptions into compelling professional summaries
- **Project Descriptions** - Generate engaging project narratives that highlight your skills
- **Experience Details** - Enhance job descriptions with impactful achievements
- **Skill Recommendations** - Get suggestions for relevant skills to add

### 🎯 Smart Suggestions
- **Content Improvement** - Real-time suggestions for better wording and structure
- **Missing Information** - Identify gaps in your portfolio content
- **Industry Standards** - Align your portfolio with current industry expectations

## 🛠️ Development & Deployment

### 🔄 Development Workflow
```bash
# Frontend development
cd frontend
npm run dev     # Start development server
npm run build   # Build for production
npm run lint    # Run linting

# Backend development  
cd backend
make dev        # Start with hot reload
make test       # Run tests
make fmt        # Format code
make lint       # Run linting
```

### 🐳 Docker Support
```bash
cd backend
make docker-build
make docker-run
```

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Follow** the existing code style and architecture patterns
4. **Add** tests for new features
5. **Commit** your changes (`git commit -m 'Add amazing feature'`)
6. **Push** to the branch (`git push origin feature/amazing-feature`)
7. **Open** a Pull Request

### 📋 Development Guidelines
- Follow Go best practices for backend development
- Use TypeScript and React best practices for frontend
- Maintain clean architecture principles
- Write comprehensive tests
- Update documentation for new features

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Community

### 🐛 Issues & Bug Reports
- [Create an issue](https://github.com/yourusername/devfolio/issues) on GitHub
- Provide detailed reproduction steps
- Include system information and error logs

### 📚 Documentation
- Check the `/docs` directory for detailed guides
- Review API documentation at `/health` endpoint
- Browse code comments for implementation details

### 💬 Community
- Join our discussions in GitHub Discussions
- Follow the project for updates
- Star ⭐ the repository if you find it useful!

---

<div align="center">
  <p><strong>Built with ❤️ by developers, for developers</strong></p>
  <p>DevFolio - Empowering developers to showcase their best work</p>
</div>