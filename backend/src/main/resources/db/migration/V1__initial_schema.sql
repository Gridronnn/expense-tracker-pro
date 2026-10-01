-- ==========================================================
-- Flyway Database Migration: V1 Initial Schema (Hardened)
-- Expense Tracker Pro (Aura Finance)
-- ==========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    profile_image_url TEXT,
    currency VARCHAR(10) DEFAULT 'USD',
    timezone VARCHAR(50) DEFAULT 'UTC',
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_login_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 2. REFRESH TOKENS TABLE (Stores SHA-256 token_hash, not raw tokens)
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(64) NOT NULL UNIQUE,
    expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
    revoked BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_hash ON refresh_tokens(token_hash);

-- 3. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(100),
    color VARCHAR(50),
    type VARCHAR(20) DEFAULT 'EXPENSE' NOT NULL, -- EXPENSE or INCOME
    is_system BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_categories_user ON categories(user_id);

-- 4. EXPENSES TABLE
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    payment_method VARCHAR(50) DEFAULT 'CREDIT_CARD',
    notes TEXT,
    tags TEXT,
    recurring BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_expenses_user_date ON expenses(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_user_category ON expenses(user_id, category_id);

-- 5. INCOME TABLE
CREATE TABLE IF NOT EXISTS income (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    source VARCHAR(255) NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_income_user_date ON income(user_id, date DESC);

-- 6. BUDGETS TABLE
CREATE TABLE IF NOT EXISTS budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    amount NUMERIC(15, 2) NOT NULL,
    period VARCHAR(20) DEFAULT 'MONTHLY' NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    alert_threshold NUMERIC(5, 2) DEFAULT 80.00 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uq_user_category_period UNIQUE (user_id, category_id, period, start_date)
);

CREATE INDEX IF NOT EXISTS idx_budgets_user ON budgets(user_id);

-- 7. SAVINGS GOALS TABLE
CREATE TABLE IF NOT EXISTS goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    target_amount NUMERIC(15, 2) NOT NULL,
    current_amount NUMERIC(15, 2) DEFAULT 0.00 NOT NULL,
    deadline DATE,
    color VARCHAR(50),
    icon VARCHAR(100),
    is_completed BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_goals_user ON goals(user_id);

-- 8. SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    billing_cycle VARCHAR(20) DEFAULT 'MONTHLY' NOT NULL, -- MONTHLY, YEARLY, QUARTERLY
    renewal_date DATE NOT NULL,
    color VARCHAR(50),
    icon VARCHAR(100),
    status VARCHAR(20) DEFAULT 'ACTIVE' NOT NULL, -- ACTIVE, PAUSED, CANCELLED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);

-- SEED SYSTEM DEFAULT CATEGORIES
INSERT INTO categories (id, user_id, name, icon, color, type, is_system)
VALUES 
    (uuid_generate_v4(), NULL, 'Food & Dining', 'Utensils', '#F8DADD', 'EXPENSE', TRUE),
    (uuid_generate_v4(), NULL, 'Transportation', 'Car', '#D9CEFF', 'EXPENSE', TRUE),
    (uuid_generate_v4(), NULL, 'Shopping & Lifestyle', 'ShoppingBag', '#5B9E7C', 'EXPENSE', TRUE),
    (uuid_generate_v4(), NULL, 'Entertainment', 'Film', '#EAF56D', 'EXPENSE', TRUE),
    (uuid_generate_v4(), NULL, 'Healthcare', 'Activity', '#F8DADD', 'EXPENSE', TRUE),
    (uuid_generate_v4(), NULL, 'Bills & Utilities', 'Zap', '#D9CEFF', 'EXPENSE', TRUE),
    (uuid_generate_v4(), NULL, 'Education', 'BookOpen', '#5B9E7C', 'EXPENSE', TRUE),
    (uuid_generate_v4(), NULL, 'Travel', 'Plane', '#EAF56D', 'EXPENSE', TRUE),
    (uuid_generate_v4(), NULL, 'Rent & Housing', 'Home', '#F8DADD', 'EXPENSE', TRUE),
    (uuid_generate_v4(), NULL, 'Subscriptions', 'Repeat', '#D9CEFF', 'EXPENSE', TRUE),
    (uuid_generate_v4(), NULL, 'Salary & Wages', 'Briefcase', '#5B9E7C', 'INCOME', TRUE),
    (uuid_generate_v4(), NULL, 'Investments & Dividends', 'TrendingUp', '#EAF56D', 'INCOME', TRUE),
    (uuid_generate_v4(), NULL, 'Freelance & Consulting', 'Laptop', '#D9CEFF', 'INCOME', TRUE),
    (uuid_generate_v4(), NULL, 'Other', 'MoreHorizontal', '#E6E2D8', 'EXPENSE', TRUE)
ON CONFLICT DO NOTHING;
