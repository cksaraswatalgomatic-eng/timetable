# Quick Start Guide - MySQL Database Setup

## Step-by-Step Instructions

### Step 1: Install MySQL (if not already installed)

**Download MySQL Installer:**
https://dev.mysql.com/downloads/installer/

**During installation:**
- Choose "Server only" or "Developer Default"
- Set root password (remember this!)
- Keep default port: 3306
- Start MySQL as a Windows Service

### Step 2: Configure Database

1. Open the `.env` file in the `server` folder:
   ```
   D:\Project\Timetable\server\.env
   ```

2. Update the database password:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=YOUR_MYSQL_PASSWORD_HERE  # ← Change this!
   DB_NAME=timetable_db
   ```

### Step 3: Initialize Database

Open Command Prompt and run:

```cmd
cd D:\Project\Timetable\server
npm run db:init
```

You should see:
```
✓ Connected to MySQL server
✓ Database created/verified
✓ Users table created
✓ Default admin user created
```

### Step 4: Start API Server

```cmd
cd D:\Project\Timetable\server
npm run dev
```

You should see:
```
✓ Database connected successfully
Server running on port 3001
```

### Step 5: Test the API

Open another Command Prompt and test login:

```cmd
curl -X POST http://localhost:3001/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```

You should get a response like:
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "admin",
    "name": "Administrator",
    "role": "admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Step 6: Add More Users

**Via API:**
```cmd
curl -X POST http://localhost:3001/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"teacher1\",\"password\":\"pass123\",\"name\":\"John Doe\",\"role\":\"user\"}"
```

**Via MySQL Command Line:**
```cmd
mysql -u root -p
USE timetable_db;

-- Add a new user
INSERT INTO users (username, password_hash, name, role) 
VALUES ('teacher1', '$2b$10$...', 'John Doe', 'user');

-- View all users
SELECT id, username, name, role, created_at FROM users;
```

## File Structure

```
D:\Project\Timetable\
├── server/
│   ├── config/
│   │   └── database.js       # MySQL connection config
│   ├── database/
│   │   └── init.js           # Database initialization script
│   ├── routes/
│   │   └── auth.js           # Authentication API endpoints
│   ├── .env                  # Database credentials (DO NOT COMMIT!)
│   ├── .env.example          # Example env file
│   ├── server.js             # Express server
│   └── package.json          # Dependencies
└── database/
    └── schema.sql            # SQL schema (for reference)
```

## Default Login

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | Admin |

## Common Commands

```bash
# Initialize database
npm run db:init

# Start server (development)
npm run dev

# Start server (production)
npm start

# View MySQL logs
mysql -u root -p
```

## Troubleshooting

### "Access denied for user 'root'@'localhost'"
- Check your MySQL password in `.env`
- Make sure MySQL service is running

### "Port 3306 already in use"
- MySQL is already running
- Check if another application is using port 3306

### "Cannot connect to database"
1. Verify MySQL is running: `services.msc` (Windows)
2. Check credentials in `.env`
3. Test connection: `mysql -u root -p`

## Next Steps

After the API server is running, you'll need to update the frontend to use the API instead of localStorage. This involves:

1. Updating `useAuthStore.js` to make API calls
2. Storing JWT token instead of user data
3. Adding token to API requests

Would you like me to implement the frontend integration now?
