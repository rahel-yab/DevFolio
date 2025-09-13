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

<div align="center">
  <img src="./screenshots/landing-page.png" alt="DevFolio Landing Page" width="800"/>
  <p><em>Modern landing page with clear call-to-action</em></p>
</div>

<div align="center">
  <img src="./screenshots/template-selection.png" alt="Template Selection" width="800"/>
  <p><em>Professional template selection with live previews</em></p>
</div>

<div align="center">
  <img src="./screenshots/portfolio-editor.png" alt="Portfolio Editor" width="800"/>
  <p><em>Intuitive editor with real-time preview</em></p>
</div>

<div align="center">
  <img src="./screenshots/dashboard.png" alt="User Dashboard" width="800"/>
  <p><em>Comprehensive portfolio management dashboard</em></p>
</div>

## ✨ Key Features

- **🎨 Portfolio Builder** - Create professional portfolios with guided forms
- **⚡ Live Preview** - Real-time preview as you edit
- **🤖 AI Enhancement** - OpenAI-powered content optimization
- **🔒 User Management** - Secure authentication and profile system
- **📊 Dashboard** - Manage multiple portfolios from one place
- **📱 Responsive Design** - Perfect on all devices

## 🛠️ Tech Stack

**Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS  
**Backend:** Go 1.21, Gin, MongoDB, OpenAI GPT  
**Architecture:** Clean Architecture with separation of concerns

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

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p><strong>Built with ❤️ by developers, for developers</strong></p>
  <p>DevFolio - Empowering developers to showcase their best work</p>
</div>
