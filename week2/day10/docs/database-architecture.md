# Database Architecture

## MongoDB
- User authentication
- Flexible documents
- Fast document queries

## PostgreSQL
- Product data
- Orders
- Customers
- ACID transactions

## Hybrid Architecture

MongoDB stores user-related documents.

PostgreSQL stores relational business data.

The backend connects to both databases simultaneously.