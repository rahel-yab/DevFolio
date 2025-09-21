# 🚀 DevFolio – AI-Powered Developer Portfolio Builder

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Go-1.24-00ADD8?style=for-the-badge&logo=go" alt="Go" />
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
- **🔒 Secure Authentication** - Complete user management system
- **📊 Portfolio Management** - Dashboard to organize all your portfolios


## 🛠️ Tech Stack

**Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS  
**Backend:** Go 1.21, Gin, MongoDB, OpenAI GPT  
**Architecture:** Clean Architecture with separation of concerns

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **Go** 1.24
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
make deps                    # Install dependencies
cp .env.example .env         # Create environment file
# Configure .env with your MongoDB URI and OpenAI API key
make db-up                   # Start MongoDB (if local)
make dev                     # Run with hot reload
```
🌐 Backend: **http://localhost:8080**

#### 3️⃣ Frontend Setup
```bash
cd frontend
npm install                  # Install dependencies
npm run dev                  # Start development server
```
🌐 Frontend: **http://localhost:3000**

### 🎉 You're Ready!
Open `http://localhost:3000` to start building your portfolio!

## 🤝 Contributing

contributions are welcome! If you discover a bug or have a feature request, feel free to open an issue or submit a pull request.

<div align="center">
  <p>DevFolio - Ready.set.portfolio! </p>
</div>
