# Homework - Full Stack Application

A modern full-stack application built with Next.js, Express.js, and MongoDB featuring authentication, Swagger documentation, and Docker support.

## 🛠️ Technology Stack

### Frontend (Client)
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI components

### Backend (Server)
- **Express.js** - Web framework
- **MongoDB** with **Mongoose** - Database
- **TypeScript** - Type safety
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Swagger** - API documentation

### DevOps
- **Docker** & **Docker Compose** - Containerization
- **Yarn** - Package management

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Yarn
- MongoDB (if running locally)
- Docker & Docker Compose (optional)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd homework
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   yarn install
   cd ..
   
   # Install client dependencies
   cd client
   yarn install
   cd ..
   ```

3. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

4. **Start the server**
   ```bash
   cd server
   yarn dev
   ```

5. **Start the client** (in a new terminal)
   ```bash
   cd client
   yarn dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Documentation: http://localhost:5000/api-docs

### Docker Development

1. **Start all services**
   ```bash
   docker-compose up --build
   ```

2. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Documentation: http://localhost:5000/api-docs

## 📁 Project Structure

```
homework/
├── client/                 # Next.js frontend
│   ├── src/
│   │   ├── app/           # App router pages
│   │   └── components/    # React components
│   ├── Dockerfile
│   └── package.json
├── server/                # Express.js backend
│   ├── src/
│   │   ├── controllers/   # Route handlers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   └── config/        # Configuration files
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 🔐 Authentication

The application includes JWT-based authentication with the following endpoints:

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/signin` - Sign in an existing user

## 📚 API Documentation

Swagger documentation is available at `http://localhost:5000/api-docs` when the server is running.

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up

# Start with build
docker-compose up --build

# Stop services
docker-compose down

# View logs
docker-compose logs [service-name]

# Rebuild a specific service
docker-compose build [service-name]
```

## 🔧 Environment Variables

### Server (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/homework
JWT_SECRET=your-super-secret-jwt-key-change-in-production
CLIENT_URL=http://localhost:3000
API_URL=http://localhost:5000
```

### Client (next.config.js)
```javascript
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 🧪 Available Scripts

### Server
- `yarn dev` - Start development server with nodemon
- `yarn build` - Build TypeScript to JavaScript
- `yarn start` - Start production server

### Client
- `yarn dev` - Start Next.js development server
- `yarn build` - Build for production
- `yarn start` - Start production server

## 🎯 Features

- ✅ User registration and authentication
- ✅ JWT token-based sessions
- ✅ Password hashing with bcrypt
- ✅ MongoDB database integration
- ✅ Swagger API documentation
- ✅ Docker containerization
- ✅ TypeScript for type safety
- ✅ Modern React with Next.js 15
- ✅ Responsive UI with Tailwind CSS
- ✅ Component library with shadcn/ui

## 📝 License

This project is licensed under the ISC License.
