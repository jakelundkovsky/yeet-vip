# Critical API Design Decisions

## Core Stack
- Express.js + TypeORM + PostgreSQL
- RESTful API with TypeScript

### Why Express
- Simple routing and error handling
- Easy integration with TypeScript

### Why TypeORM
- Type-safe database operations
- Rich migration support
- Native TypeScript decorators
- Transaction support out of the box

## Key Tradeoffs

### REST vs GraphQL
- REST chosen for:
  - Simpler caching and security model
  - Standard CRUD operations
- Tradeoff: Multiple round trips for related data

### Critical Features
- Atomic balance operations
- Idempotent transactions
- Token-based authentication
- Basic rate limiting

## Major Limitations
- No real-time updates (poll-based only)
- Limited transaction rollback support
- Basic rate limiting without burst handling 

## Critical Future Work
- Comprehensive input validation
- Unit and integration test suite
- Error monitoring and logging
- Security auditing 