# 🚀 Expense Tracker Pro — Java 21 Spring Boot Backend

Production REST API backend engineered for **Expense Tracker Pro (Aura Finance)**, deployed on **Render** and backed by **Supabase PostgreSQL**.

---

## 🏛️ Architecture Overview

```
                         USER
                           │
                           ↓
                    ┌─────────────┐
                    │   VERCEL    │
                    │  FRONTEND   │
                    │ React/Vite  │
                    │ TypeScript  │
                    └──────┬──────┘
                           │
                           │ HTTPS REST API (/api/v1)
                           ↓
                    ┌─────────────┐
                    │   RENDER    │
                    │   BACKEND   │
                    │ Java 21 LTS │
                    │ Spring Boot │
                    └──────┬──────┘
                           │
                           │ JDBC (HikariCP) / TLS
                           ↓
                    ┌─────────────┐
                    │  SUPABASE   │
                    │ PostgreSQL  │
                    │  DATABASE   │
                    └─────────────┘
```

### Key Architectural Invariants:
1. **Frontend Isolation**: The React frontend **never communicates directly with Supabase**. It communicates exclusively with Spring Boot via `/api/v1` REST endpoints with JWT Bearer tokens.
2. **Database Gateway**: Spring Boot is the single gateway connecting to Supabase PostgreSQL over encrypted JDBC.
3. **Stateless Security**: Spring Security with JWT access/refresh tokens, BCrypt password hashing, and user context derived strictly from authenticated claims.

---

## 🛠️ Technology Stack

- **Language & Framework**: Java 21 LTS, Spring Boot 3.3.4
- **Database & Migrations**: PostgreSQL 16 (Hosted on Supabase), Flyway
- **Security**: Spring Security 6, JWT (`io.jsonwebtoken:jjwt`), BCrypt (strength 12), Strict CORS
- **ORM & Data**: Spring Data JPA, Hibernate 6, HikariCP Connection Pool
- **API Documentation**: OpenAPI 3.0 / Swagger UI (`springdoc-openapi-starter-webmvc-ui`)
- **Validation**: Jakarta Bean Validation (`@NotBlank`, `@Positive`, `@Email`)
- **Containerization**: Multi-stage Dockerfile, Docker Compose
- **Testing**: JUnit 5, Mockito, Spring Security Test

---

## 📋 Database Schema & Migrations

Flyway automatically initializes and manages the database schema via `src/main/resources/db/migration/V1__initial_schema.sql`:

- `users` (UUID primary key, email, BCrypt password hash, currency, timezone, timestamps)
- `refresh_tokens` (UUID primary key, user_id foreign key, token, expiry, revoked status)
- `categories` (UUID primary key, system defaults + custom user categories)
- `expenses` (UUID primary key, user_id, category_id, title, amount NUMERIC(15,2), date, tags, recurring)
- `income` (UUID primary key, user_id, category_id, source, amount NUMERIC(15,2), date)
- `budgets` (UUID primary key, user_id, category_id, amount NUMERIC(15,2), period, start/end dates, alert threshold)

---

## 🔌 API Endpoints Summary

### Public & Health
- `GET /api/v1/health` ➔ `{ "status": "UP", "service": "expense-tracker-api" }`
- `GET /swagger-ui/index.html` ➔ Interactive Swagger Documentation

### Authentication (`/api/v1/auth`)
- `POST /api/v1/auth/register` ➔ Create user account with name, email, password
- `POST /api/v1/auth/login` ➔ Authenticate user and return JWT access + refresh tokens
- `POST /api/v1/auth/refresh` ➔ Issue new access token from valid refresh token
- `POST /api/v1/auth/logout` ➔ Invalidate refresh token session
- `GET /api/v1/auth/me` ➔ Get current authenticated user profile

### User Profile (`/api/v1/users`)
- `GET /api/v1/users/profile` ➔ Fetch profile
- `PUT /api/v1/users/profile` ➔ Update name, currency, timezone, avatar

### Categories (`/api/v1/categories`)
- `GET /api/v1/categories` ➔ Get all system and custom categories
- `POST /api/v1/categories` ➔ Create custom category
- `PUT /api/v1/categories/{id}` ➔ Update category
- `DELETE /api/v1/categories/{id}` ➔ Delete custom category

### Expenses (`/api/v1/expenses`)
- `GET /api/v1/expenses` ➔ Paginated list with filtering (search, category, date range, amount range, sorting)
- `GET /api/v1/expenses/{id}` ➔ Get expense details
- `POST /api/v1/expenses` ➔ Create expense
- `PUT /api/v1/expenses/{id}` ➔ Update expense
- `DELETE /api/v1/expenses/{id}` ➔ Delete expense

### Income (`/api/v1/income`)
- `GET /api/v1/income` ➔ Paginated list of income streams
- `GET /api/v1/income/{id}` ➔ Get income details
- `POST /api/v1/income` ➔ Create income
- `PUT /api/v1/income/{id}` ➔ Update income
- `DELETE /api/v1/income/{id}` ➔ Delete income

### Budgets (`/api/v1/budgets`)
- `GET /api/v1/budgets` ➔ Get all budgets with live calculated spent amount, remaining amount, percentage, and breach status
- `GET /api/v1/budgets/{id}` ➔ Get specific budget
- `POST /api/v1/budgets` ➔ Create category budget
- `PUT /api/v1/budgets/{id}` ➔ Update budget limit/dates
- `DELETE /api/v1/budgets/{id}` ➔ Delete budget

### Dashboard & Analytics (`/api/v1/dashboard`)
- `GET /api/v1/dashboard/summary` ➔ Aggregated balance, income, expenses, monthly changes, top category
- `GET /api/v1/dashboard/category-breakdown` ➔ Spending percentage and volume per category
- `GET /api/v1/dashboard/monthly-trends` ➔ Multi-month cash flow and savings trajectories

### Reports (`/api/v1/reports`)
- `GET /api/v1/reports/summary` ➔ Comprehensive financial report over custom date ranges

---

## ⚙️ Environment Variables

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `SPRING_DATASOURCE_URL` | Supabase PostgreSQL JDBC connection string | `jdbc:postgresql://db.YOUR_PROJECT.supabase.co:5432/postgres?sslmode=require` |
| `SPRING_DATASOURCE_USERNAME` | Database username | `postgres` |
| `SPRING_DATASOURCE_PASSWORD` | Database password | `your-supabase-db-password` |
| `JWT_SECRET` | 256-bit Base64-encoded HMAC secret | `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970` |
| `JWT_ACCESS_EXPIRATION` | Access token lifetime (ms) | `3600000` (1 hour) |
| `JWT_REFRESH_EXPIRATION` | Refresh token lifetime (ms) | `604800000` (7 days) |
| `FRONTEND_URL` | Allowed CORS frontend origins | `https://expense-tracker-pro-sigma-sage.vercel.app,http://localhost:5173` |
| `PORT` | HTTP listener port | `8080` (auto-set by Render) |

---

## 🚀 Deployment Instructions

### 1. Supabase Setup
1. Log in to [Supabase](https://supabase.com/dashboard) and create/select your project.
2. Go to **Project Settings** ➔ **Database**.
3. Under **Connection String**, select **JDBC** (or URI).
   - Format: `jdbc:postgresql://db.[YOUR-PROJECT-REF].supabase.co:5432/postgres?sslmode=require`
4. Note your database password.

### 2. Render Deployment (Web Service)
1. Log in to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** ➔ **Web Service**.
3. Connect your repository: `https://github.com/Gridronnn/expense-tracker-pro`.
4. Configure:
   - **Language**: `Docker`
   - **Dockerfile Path**: `backend/Dockerfile`
   - **Docker Context**: `backend`
   - **Instance Type**: `Free`
5. In **Environment Variables**, add:
   - `SPRING_DATASOURCE_URL`: `jdbc:postgresql://db.YOUR_ID.supabase.co:5432/postgres?sslmode=require`
   - `SPRING_DATASOURCE_USERNAME`: `postgres`
   - `SPRING_DATASOURCE_PASSWORD`: `your-supabase-password`
   - `JWT_SECRET`: `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970`
   - `FRONTEND_URL`: `https://expense-tracker-pro-sigma-sage.vercel.app`
6. Click **Create Web Service**. Render will automatically build the Docker container, run Flyway migrations, and start the Spring Boot API!

### 3. Vercel Frontend Configuration
1. In your Vercel Project Settings for Expense Tracker Pro:
2. Add Environment Variable:
   - **`VITE_API_URL`**: `https://your-render-service.onrender.com/api/v1`
3. Redeploy the frontend.
