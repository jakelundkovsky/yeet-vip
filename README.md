# yeet-vip

## Prerequisites
- Node.js (v20 or higher)
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

![Database Schema](db-schema.png)

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

### User Endpoints

#### Get Users List
```http
GET /api/v1/users
```

Query Parameters:
- `page` (number, optional): Page number for pagination (default: 1)
- `limit` (number, optional): Items per page (default: 10)
- `sortBy` (string, optional): Field to sort by (default: 'createdAt')
  - Allowed values: 'name', 'email', 'balance', 'createdAt'
- `sortOrder` (string, optional): Sort direction (default: 'DESC')
  - Allowed values: 'ASC', 'DESC'

Example Request:
```http
GET /api/v1/users?page=1&limit=10&sortBy=balance&sortOrder=DESC
```

Response:
```json
{
  "users": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "balance": 1000.50,
      "createdAt": "2024-03-20T15:30:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10
  }
}
```

#### Get Single User
```http
GET /api/v1/users/:userId
```

Parameters:
- `userId` (uuid, required): The unique identifier of the user

Example Request:
```http
GET /api/v1/users/123e4567-e89b-12d3-a456-426614174000
```

Response:
```json
{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "John Doe",
    "email": "john@example.com",
    "balance": 1000.50,
    "createdAt": "2024-03-20T15:30:00Z"
  }
}
```

#### Credit/Debit User Balance
```http
POST /api/v1/users/:userId/credit
```

Parameters:
- `userId` (uuid, required): The unique identifier of the user

Request Body:
```typescript
{
  amount: number; // Positive for credit, negative for debit
}
```

Example Request:
```http
POST /api/v1/users/123e4567-e89b-12d3-a456-426614174000/credit
Content-Type: application/json

{
  "amount": 50.25  // Credit $50.25
}
```

Example Debit Request:
```http
POST /api/v1/users/123e4567-e89b-12d3-a456-426614174000/credit
Content-Type: application/json

{
  "amount": -25.50  // Debit $25.50
}
```

Response:
```json
{
  "message": "Credited $50.25 to user 123e4567-e89b-12d3-a456-426614174000",
  "newBalance": 1050.75,
  "transaction": {
    "id": "987fcdeb-51a2-3e4b-9876-543210987654",
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "amount": 50.25,
    "type": "ADMIN_ADJUST",
    "createdAt": "2024-03-20T15:35:00Z"
  }
}
```

Error Responses:
- 400: Invalid amount or insufficient funds
  ```json
  {
    "error": "Insufficient funds",
    "currentBalance": 100.00,
    "requestedDebit": 150.00
  }
  ```
- 404: User not found
  ```json
  {
    "error": "User not found"
  }
  ```
- 500: Internal server error
  ```json
  {
    "error": "Internal server error"
  }
  ```

#### Get User Transactions
```http
GET /api/v1/users/:userId/transactions
```

Parameters:
- `userId` (uuid, required): The unique identifier of the user

Example Request:
```http
GET /api/v1/users/123e4567-e89b-12d3-a456-426614174000/transactions
```

Response:
```json
{
  "transactions": [
    {
      "id": "987fcdeb-51a2-3e4b-9876-543210987654",
      "userId": "123e4567-e89b-12d3-a456-426614174000",
      "amount": 50.25,
      "type": "ADMIN_ADJUST",
      "createdAt": "2024-03-20T15:35:00Z"
    },
    {
      "id": "456abcde-12f3-4g5h-ijkl-987654321012",
      "userId": "123e4567-e89b-12d3-a456-426614174000",
      "amount": -25.50,
      "type": "ADMIN_ADJUST",
      "createdAt": "2024-03-20T14:30:00Z"
    }
  ]
}
```

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