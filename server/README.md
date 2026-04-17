# TimeTable Pro API Server

## Prerequisites

- Node.js 18+ installed
- MySQL 8.0+ installed and running

## Setup Instructions

### 1. Install MySQL

If you don't have MySQL installed:

**Windows:**
- Download from: https://dev.mysql.com/downloads/installer/
- Install MySQL Server and MySQL Workbench (optional)
- Remember your root password

**Mac:**
```bash
brew install mysql
brew services start mysql
```

**Linux (Ubuntu):**
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

### 2. Configure Database

Copy the example environment file and update it:

```bash
cd server
cp .env.example .env
```

Edit `.env` and update your MySQL credentials:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=timetable_db
```

### 3. Install Dependencies

```bash
cd server
npm install
```

### 4. Initialize Database

This will create the database, tables, and default admin user:

```bash
npm run db:init
```

You should see:
```
✓ Connected to MySQL server
✓ Database created/verified
✓ Users table created
✓ Sessions table created
✓ Audit logs table created
✓ Default admin user created
```

### 5. Start the API Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

You should see:
```
✓ Database connected successfully
╔═══════════════════════════════════════════════╗
║   TimeTable Pro API Server                    ║
╠═══════════════════════════════════════════════╣
║   Server running on port 3001                 ║
║   Environment: development                    ║
║   API: http://localhost:3001/api              ║
╚═══════════════════════════════════════════════╝
```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/register` | Create new user | Yes (Admin) |
| POST | `/api/auth/change-password` | Change password | Yes |
| POST | `/api/auth/reset-password` | Reset user password | Yes (Admin) |
| GET | `/api/auth/users` | Get all users | Yes (Admin) |
| PUT | `/api/auth/users/:id` | Update user | Yes (Admin) |
| DELETE | `/api/auth/users/:id` | Delete user | Yes (Admin) |

### Example Requests

**Login:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**Register New User (Admin only):**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"username":"teacher1","password":"pass123","name":"John Doe","role":"user"}'
```

**Get All Users (Admin only):**
```bash
curl http://localhost:3001/api/auth/users \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Default Credentials

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | Admin |

## Database Schema

### Users Table
```sql
- id (INT, AUTO_INCREMENT, PRIMARY KEY)
- username (VARCHAR(50), UNIQUE)
- password_hash (VARCHAR(255), BCRYPT)
- name (VARCHAR(100))
- role (ENUM: 'admin', 'user')
- is_active (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
- last_login (TIMESTAMP)
```

## Troubleshooting

### Cannot connect to database

1. Verify MySQL is running:
   ```bash
   # Windows
   services.msc  # Look for MySQL service
   
   # Mac
   brew services list
   
   # Linux
   sudo systemctl status mysql
   ```

2. Check your credentials in `.env`

3. Test connection:
   ```bash
   mysql -u root -p
   ```

### Port already in use

Change the port in `.env`:
```env
PORT=3002
```

### Reset database

Drop and recreate:
```bash
mysql -u root -p -e "DROP DATABASE timetable_db;"
npm run db:init
```

## Security Notes

⚠️ **This is a simple implementation for development/learning purposes**

For production:
- Use HTTPS
- Implement rate limiting
- Add input validation
- Use environment-specific JWT secrets
- Implement proper session management
- Add CORS restrictions
- Use password complexity requirements
- Implement account lockout after failed attempts
- Add email verification
- Add password reset via email
- Implement 2FA (Two-Factor Authentication)
