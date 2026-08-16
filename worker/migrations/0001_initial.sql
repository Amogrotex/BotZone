PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL CHECK (length(title) BETWEEN 2 AND 100),
  subtitle TEXT NOT NULL DEFAULT '' CHECK (length(subtitle) <= 240),
  type TEXT NOT NULL CHECK (type IN ('bot', 'item')),
  category TEXT NOT NULL CHECK (length(category) BETWEEN 2 AND 80),
  price INTEGER NOT NULL CHECK (price >= 0),
  old_price INTEGER CHECK (old_price IS NULL OR old_price >= price),
  badge TEXT CHECK (badge IS NULL OR length(badge) <= 30),
  tone TEXT NOT NULL DEFAULT 'violet' CHECK (tone IN ('violet', 'blue', 'orange', 'pink', 'green', 'cyan')),
  rating REAL NOT NULL DEFAULT 5.0 CHECK (rating BETWEEN 0 AND 5),
  reviews INTEGER NOT NULL DEFAULT 0 CHECK (reviews >= 0),
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS products_active_created_idx
ON products (active, created_at DESC);

CREATE TABLE IF NOT EXISTS login_attempts (
  key TEXT PRIMARY KEY,
  attempts INTEGER NOT NULL DEFAULT 0,
  window_start INTEGER NOT NULL,
  blocked_until INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS login_attempts_blocked_idx
ON login_attempts (blocked_until);
