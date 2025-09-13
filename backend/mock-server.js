const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8080;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Mock data
let users = [];
let portfolios = [];
let currentUserId = 1;

// Auth endpoints
app.post('/api/v1/auth/register', (req, res) => {
  const { email, password, first_name, last_name } = req.body;
  
  // Check if user already exists
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'User already exists' });
  }
  
  const user = {
    id: currentUserId.toString(),
    email,
    first_name,
    last_name,
    avatar: '',
    is_verified: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  users.push({ ...user, password });
  currentUserId++;
  
  const accessToken = `mock-token-${user.id}`;
  
  res.json({
    data: {
      user,
      access_token: accessToken
    }
  });
});

app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const { password: _, ...userWithoutPassword } = user;
  const accessToken = `mock-token-${user.id}`;
  
  res.json({
    data: {
      user: userWithoutPassword,
      access_token: accessToken
    }
  });
});

app.post('/api/v1/auth/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

app.get('/api/v1/auth/profile', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const token = authHeader.split(' ')[1];
  const userId = token.replace('mock-token-', '');
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  const { password: _, ...userWithoutPassword } = user;
  res.json({ data: userWithoutPassword });
});

// Portfolio endpoints
app.get('/api/v1/portfolios', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const token = authHeader.split(' ')[1];
  const userId = token.replace('mock-token-', '');
  
  const userPortfolios = portfolios.filter(p => p.user_id === userId);
  res.json({ data: userPortfolios });
});

app.post('/api/v1/portfolios', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const token = authHeader.split(' ')[1];
  const userId = token.replace('mock-token-', '');
  
  const portfolio = {
    id: (portfolios.length + 1).toString(),
    user_id: userId,
    title: req.body.title || 'New Portfolio',
    description: req.body.description || '',
    is_published: false,
    template_id: req.body.template_id || 'template1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...req.body
  };
  
  portfolios.push(portfolio);
  res.json({ data: portfolio });
});

app.delete('/api/v1/portfolios/:id', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const token = authHeader.split(' ')[1];
  const userId = token.replace('mock-token-', '');
  const portfolioId = req.params.id;
  
  const portfolioIndex = portfolios.findIndex(p => p.id === portfolioId && p.user_id === userId);
  if (portfolioIndex === -1) {
    return res.status(404).json({ error: 'Portfolio not found' });
  }
  
  portfolios.splice(portfolioIndex, 1);
  res.json({ message: 'Portfolio deleted successfully' });
});

// Health check
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'OK', message: 'Mock server is running' });
});

app.listen(PORT, () => {
  console.log(`Mock server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('- POST /api/v1/auth/register');
  console.log('- POST /api/v1/auth/login');
  console.log('- POST /api/v1/auth/logout');
  console.log('- GET /api/v1/auth/profile');
  console.log('- GET /api/v1/portfolios');
  console.log('- POST /api/v1/portfolios');
  console.log('- DELETE /api/v1/portfolios/:id');
  console.log('- GET /api/v1/health');
});
