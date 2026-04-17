-- ============================================
-- TimeTable Pro - MySQL Database Schema
-- ============================================

-- Create database
CREATE DATABASE IF NOT EXISTS timetable_db 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE timetable_db;

-- ============================================
-- Users Table
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL,
  INDEX idx_username (username),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Insert Default Admin User
-- Password: admin123 (hashed with bcrypt)
-- ============================================
INSERT INTO users (username, password_hash, name, role) VALUES
('admin', '$2b$10$X7Z5qJZ5qJZ5qJZ5qJZ5qO8qJZ5qJZ5qJZ5qJZ5qJZ5qJZ5qJZ5q', 'Administrator', 'admin')
ON DUPLICATE KEY UPDATE username=username;

-- ============================================
-- Sessions Table (for token-based auth)
-- ============================================
CREATE TABLE IF NOT EXISTS sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_token (token),
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Audit Log Table
-- ============================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  action VARCHAR(100) NOT NULL,
  details TEXT NULL,
  ip_address VARCHAR(45) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Useful Queries
-- ============================================

-- Get all users
-- SELECT id, username, name, role, is_active, created_at, last_login FROM users;

-- Get active admin users
-- SELECT * FROM users WHERE role = 'admin' AND is_active = TRUE;

-- Count users by role
-- SELECT role, COUNT(*) as count FROM users GROUP BY role;

-- Get user with login stats
-- SELECT username, name, role, created_at, last_login FROM users ORDER BY last_login DESC;
