# yeet-vip

## Prerequisites
- Node.js (v16 or higher)
- Docker Desktop

## Setup Instructions

1. Clone the repository:
```bash
git clone git@github.com:jakelundkovsky/yeet-vip.git
cd yeet-vip
```

2. Install dependencies:
```bash
# Backend dependencies
cd backend && npm install && cd ..

# Frontend dependencies
cd frontend && npm install
```

3. Database setup:
```bash
cd backend
docker-compose up -d
```

4. Run migrations and seed data:
```bash
# Still in backend directory
npm run migration:run
npm run db:seed
```

5. Start the development servers:
```bash
# Terminal 1 - Backend (from backend directory)
npm run dev

# Terminal 2 - Frontend (from frontend directory)
cd ../frontend && npm run dev
```

6. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Troubleshooting

Common issues and solutions:
- If port 5432 is in use, you might need to stop any existing PostgreSQL service
- Make sure Docker Desktop is running before starting the containers

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