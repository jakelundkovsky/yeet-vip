# yeet-vip

MVP Yeet Admin Dashboard Take-Home

### Running the project locally

1. Clone the repository:
```bash
git clone git@github.com:jakelundkovsky/yeet-vip.git
cd yeet-vip
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend && npm i && cd ..

# Install frontend dependencies
cd frontend && npm i && cd ..
```

3. Database setup:
```bash
# Start PostgreSQL with Docker
cd backend && docker-compose up -d

# Note: If you encounter "no user with role postgres" error, you may need to:
# 1. Find processes using port 5432: sudo lsof -i :5432
# 2. Kill the process: sudo kill [pid]

# Run database migrations
npm run migration:run

# Seed the database with initial data
npm run db:seed
```

4. Start the development servers:
```bash
# Terminal 1: Start backend server
cd backend && npm run dev

# Terminal 2: Start frontend server
cd frontend && npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

### DB Considerations

We use PostgreSQL as our primary database with TypeORM as the ORM layer. This combination provides:

- Strong data consistency and ACID compliance
- Rich query capabilities
- Excellent TypeScript integration via TypeORM
- Built-in migration support

Current Schema:
- `users`: Stores user information and authentication details
- `transactions`: Records all transaction data

Future Tables (Planned):
- `action_logs`: Audit trail for all system actions
  - Will track user actions, system changes, and administrative operations
  - Important for compliance and debugging

Design Considerations:
- Normalized database design to minimize redundancy
- Indexes on frequently queried columns
- Foreign key constraints to maintain data integrity
- Soft deletes for important entities

### API Considerations

Backend Stack:
- Node.js + Express
- TypeScript for type safety
- TypeORM for database operations

API Design:
- RESTful architecture
- JWT-based authentication
- Rate limiting for security
- CORS enabled for frontend communication

Endpoints Structure:
- `/api/v1/` prefix for versioning
- Resource-based routing
- Standardized error responses
- Pagination for list endpoints

### Frontend Considerations

Tech Stack:
- Next.js 15.3
- React 19
- TypeScript
- TailwindCSS for styling
- React Hot Toast for notifications

Architecture:
- Page-based routing with Next.js
- Component-based architecture
- Custom hooks for shared logic
- Global state management with React Context

Features:
- Responsive design
- Server-side rendering where beneficial
- Client-side data caching
- Form validation
- Error boundaries

Development Tools:
- ESLint + Prettier for code quality
- TypeScript for type safety
- Hot reloading for development
- Modern build optimization