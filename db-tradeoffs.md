# Key Database Design Decisions

## Core Schema
- Users: UUID, email (unique), decimal balance(10,2), timestamps
- Transactions: UUID, user_id (FK), amount, type (enum), timestamps

## Critical Design Decisions

### Balance Management
- Balance in user table for quick access
- Tradeoff: Need strong consistency checks between balance and transaction log
- Risk: Race conditions during high-frequency updates

### Money Handling
- Decimal(10,2) for exact financial calculations
- No floating point to avoid rounding errors
- Transaction log as source of truth

### Security & Compliance
- UUIDs prevent ID guessing/enumeration
- All financial changes tracked in transaction log
- Timestamps on everything for audit trail

## Future Must-Haves
1. User safety:
   - `status` for account freezing
   - `daily_limit` for responsible gaming
   - `2fa_enabled` for security

2. Transaction integrity:
   - `status` (pending/completed/failed)
   - `previous_balance` for validation
   - `transaction_hash` for tampering detection

## Known Risks
- Concurrent transaction handling needs improvement
- No automatic balance-to-transaction reconciliation
- High-volume periods could create hot spots on user balance updates 