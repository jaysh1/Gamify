# Learning Hub - Full Stack Educational Platform

A modern, accessible full-stack learning platform built with React + TypeScript (Vite), Node.js/Express backend, and PostgreSQL. Features JWT-based authentication, WCAG AA compliance, and responsive design.

## 🎯 Features

- **Full-Stack Monorepo**: TurboRepo for unified package management
- **Frontend**: React 18 + TypeScript + Vite with Chakra UI
- **Backend**: Express.js + TypeScript with PostgreSQL
- **Authentication**: JWT-based sessions with bcrypt password hashing
- **Accessibility**: WCAG AA compliant color tokens and responsive design
- **Developer Experience**: ESLint, Prettier, Husky pre-commit hooks
- **Containerization**: Docker Compose setup for PostgreSQL + services
- **Type Safety**: Full TypeScript across frontend and backend

## 🏗️ Project Structure

```
.
├── apps/
│   ├── backend/          # Express.js + TypeScript backend
│   │   ├── src/
│   │   │   ├── routes/   # API endpoints (auth, users)
│   │   │   ├── db/       # Database initialization
│   │   │   ├── middleware/
│   │   │   ├── types/    # TypeScript types
│   │   │   └── index.ts
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── Dockerfile
│   └── frontend/         # React + Vite frontend
│       ├── src/
│       │   ├── pages/    # Page components
│       │   ├── components/
│       │   ├── context/  # Auth context
│       │   ├── api/      # API client
│       │   ├── types/
│       │   ├── theme/    # Chakra UI theme
│       │   └── App.tsx
│       ├── index.html
│       ├── vite.config.ts
│       └── Dockerfile
├── .eslintrc.json        # Shared ESLint config
├── .prettierrc            # Prettier config
├── .lintstagedrc.json     # Lint-staged config
├── turbo.json            # TurboRepo config
├── docker-compose.yml    # Docker Compose setup
└── package.json          # Root package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker & Docker Compose (for database)

### Environment Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd learning-hub
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:

   Backend (`.env` in `apps/backend/`):
   ```env
   NODE_ENV=development
   PORT=5000
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/learning_app
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_EXPIRY=7d
   CORS_ORIGIN=http://localhost:5173
   ```

   Frontend (`.env` in `apps/frontend/`):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

### Local Development

#### Option 1: Using Docker Compose (Recommended)

```bash
# Start all services with PostgreSQL
docker-compose up

# In another terminal, install dependencies
npm install

# Run development servers
npm run dev
```

#### Option 2: Local Setup

1. **Start PostgreSQL**:
   ```bash
   docker-compose up postgres
   ```

2. **Start backend** (in `apps/backend/`):
   ```bash
   npm install
   npm run dev
   ```

3. **Start frontend** (in `apps/frontend/`):
   ```bash
   npm install
   npm run dev
   ```

### Accessing the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 📚 API Endpoints

### Authentication

- `POST /api/auth/register` - Create new account
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe",
    "class": "Class 10A"
  }
  ```

- `POST /api/auth/login` - Login
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

- `POST /api/auth/logout` - Logout (requires auth token)

- `POST /api/auth/verify` - Verify token (requires auth token)

### Users

- `GET /api/users/me` - Get current user profile (requires auth token)

- `PATCH /api/users/me` - Update user profile (requires auth token)
  ```json
  {
    "name": "Jane Doe",
    "class": "Class 11B",
    "avatar_url": "https://...",
    "accessibility_prefs": {
      "fontSize": "large",
      "highContrast": false,
      "reduceMotion": false
    }
  }
  ```

## 🎨 Frontend Routes

- `/` - Home page
- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - User dashboard (protected)
- `/modules` - Learning modules (protected)
- `/gamification` - Gamification & leaderboards (protected)
- `/tutor` - AI tutor interface (protected)
- `/profile` - User profile (protected) *placeholder
- `/settings` - Settings (protected) *placeholder

## 📋 Available Scripts

### Root Level

```bash
npm run dev          # Start all development servers
npm run build        # Build all packages
npm run lint         # Lint all packages
npm run lint:fix     # Fix linting issues
npm run type-check   # Check TypeScript types
npm run test         # Run tests (placeholder)
npm run format       # Format all code with Prettier
npm run format:check # Check formatting
```

### Backend (`apps/backend/`)

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm run start        # Start production server
npm run lint         # Lint code
npm run type-check   # Check TypeScript types
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database
```

### Frontend (`apps/frontend/`)

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Lint code
npm run type-check   # Check TypeScript types
```

## 🔐 Authentication Flow

1. User registers or logs in via form
2. Backend validates credentials and generates JWT token
3. Token stored in localStorage and sent with all subsequent requests
4. Protected routes check for valid token
5. User session persists across page reloads
6. Logout clears token and session

## ♿ Accessibility Features

- **WCAG AA Color Tokens**: All colors meet contrast requirements
- **Semantic HTML**: Proper heading hierarchy and ARIA labels
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Visible focus indicators
- **Responsive Design**: Mobile-first approach
- **Reduced Motion**: Respects `prefers-reduced-motion` media query
- **Chakra UI**: Built on accessible components

## 🔧 Development Workflow

### Code Quality

- **ESLint**: Catches code errors and style issues
- **Prettier**: Automatic code formatting
- **TypeScript**: Static type checking
- **Husky**: Pre-commit hooks prevent bad commits

### Pre-commit Hooks

Husky automatically runs:
- ESLint (with auto-fix)
- Prettier formatting

To bypass hooks (not recommended):
```bash
git commit --no-verify
```

## 📦 Database Schema

### Students Table

```sql
CREATE TABLE students (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  class VARCHAR(100),
  avatar_url VARCHAR(500),
  accessibility_prefs JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Sessions Table

```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY,
  student_id UUID REFERENCES students(id),
  token VARCHAR(500) UNIQUE NOT NULL,
  created_at TIMESTAMP,
  expires_at TIMESTAMP,
  created_ip VARCHAR(50)
);
```

## 🧪 Testing

Currently, test suites are placeholders. To add tests:

### Backend
```bash
# Install testing dependencies
npm install --save-dev jest ts-jest @types/jest

# Create test files in __tests__/ directories
# Run: npm run test
```

### Frontend
```bash
# Install testing dependencies
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom

# Create test files with .test.tsx extension
# Run: npm run test
```

## 🐛 Troubleshooting

### Database Connection Errors
- Ensure PostgreSQL is running: `docker-compose up postgres`
- Check DATABASE_URL in `.env`
- Verify port 5432 is not in use

### Port Already in Use
```bash
# Find process on port
lsof -i :5000  # Backend
lsof -i :5173  # Frontend

# Kill process
kill -9 <PID>
```

### Token Expired/Invalid
- Clear localStorage: `localStorage.clear()`
- Re-login with credentials
- Check JWT_SECRET matches between frontend and backend

### Hot Reload Not Working
- Restart development server
- Check file permissions
- Clear node_modules and reinstall

## 📝 Git Workflow

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes (pre-commit hooks will run)
3. Commit: `git commit -m "feat: your feature description"`
4. Push: `git push origin feature/your-feature`
5. Create Pull Request

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

### Docker Deployment

```bash
# Build and push images (update registry)
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml push

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

## 📄 Environment Variables Reference

### Backend

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` | Environment mode |
| `PORT` | `5000` | Backend port |
| `DATABASE_URL` | Required | PostgreSQL connection string |
| `JWT_SECRET` | Required | Secret key for JWT signing |
| `JWT_EXPIRY` | `7d` | Token expiration time |
| `CORS_ORIGIN` | `http://localhost:5173` | Frontend origin for CORS |

### Frontend

| Variable | Default | Description |
| `VITE_API_URL` | `http://localhost:5000/api` | Backend API URL |

## 🛠️ Technologies

### Frontend Stack
- React 18
- TypeScript 5
- Vite 5
- Chakra UI 2
- React Router 6
- Axios
- Framer Motion

### Backend Stack
- Express.js
- TypeScript 5
- PostgreSQL 16
- JWT (jsonwebtoken)
- bcrypt
- UUID

### DevOps & Tooling
- TurboRepo (monorepo management)
- ESLint (linting)
- Prettier (formatting)
- Husky (git hooks)
- lint-staged (pre-commit)
- Docker & Docker Compose

## 📞 Support

For issues or questions:
1. Check the Troubleshooting section
2. Review logs: `docker-compose logs -f`
3. Check GitHub Issues

## 📄 License

[Add your license here]

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure tests and lint pass: `npm run lint && npm run type-check`
5. Submit a pull request

---

**Happy coding! 🚀**
