# Finance Data Processing and Access Control Backend

Backend assignment project for a finance dashboard system with role-based access control, financial records management, dashboard analytics, and PostgreSQL persistence.

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- JWT authentication
- `express-validator` for request validation
- `express-rate-limit` for login protection

## Features

- User registration and login
- Role-based access control with `viewer`, `analyst`, and `admin`
- User status management with `active` and `inactive`
- Admin-only user management APIs
- Financial record CRUD APIs
- Filtering records by type, category, and date range
- Dashboard summary APIs for totals, breakdowns, trends, and recent activity
- Automatic table creation on server startup
- Request validation and consistent JSON error responses

## Role Access

- `viewer`
  - Can access dashboard endpoints
  - Cannot access record management or user management routes
- `analyst`
  - Can access dashboard endpoints
  - Can view records
  - Cannot create, update, or delete records
- `admin`
  - Full access to dashboard, records, and users

## Project Structure

```text
src/
  constants/
  controllers/
  db/
  middleware/
  routes/
  validators/
server.js
```

## Environment Variables

Create a `.env` file:

```env
PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
```

## Setup

```bash
npm install
npm run dev
```

Or run without nodemon:

```bash
npm start
```

The application initializes the required `users` and `records` tables automatically when the server starts.

## API Overview

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Users

- `GET /api/users` - admin only
- `GET /api/users/:id` - admin only
- `POST /api/users` - admin only
- `PATCH /api/users/:id` - admin only

### Records

- `GET /api/records` - analyst, admin
- `GET /api/records/:id` - analyst, admin
- `POST /api/records` - admin only
- `PUT /api/records/:id` - admin only
- `DELETE /api/records/:id` - admin only

Supported record filters:

- `type`
- `category`
- `startDate`
- `endDate`

### Dashboard

- `GET /api/dashboard/summary`
- `GET /api/dashboard/category-breakdown`
- `GET /api/dashboard/trends?period=weekly`
- `GET /api/dashboard/trends?period=monthly`
- `GET /api/dashboard/recent-activity?limit=5`

All dashboard routes require authentication. They are available to `viewer`, `analyst`, and `admin`.

## Sample Request Bodies

### Register

```json
{
  "name": "Afzal Surti",
  "email": "afzal@example.com",
  "password": "secret123"
}
```

### Create User

```json
{
  "name": "Finance Admin",
  "email": "admin@example.com",
  "password": "secret123",
  "role": "admin",
  "status": "active"
}
```

### Create Record

```json
{
  "amount": 2500,
  "type": "income",
  "category": "Salary",
  "date": "2026-04-06",
  "notes": "April salary"
}
```

## Assumptions

- A newly registered user is created with the `viewer` role and `active` status.
- Only admins can create or modify records.
- Analysts can read records and access analytics.
- Viewers can only access dashboard summary data.
- PostgreSQL is used as the persistence layer.

## Validation and Error Handling

- Invalid input returns `400`
- Missing or invalid token returns `401`
- Forbidden access returns `403`
- Missing resources return `404`
- Duplicate email returns `409`
- Unexpected server failures return `500`

## Notes

- This project focuses on clean backend structure and assignment coverage over production-level completeness.
- Numeric values from PostgreSQL aggregates may be returned as strings depending on driver behavior.
