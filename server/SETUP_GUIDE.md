# MySQL Setup Guide for Windows

## Option 1: Install MySQL (Recommended for Production)

### Step 1: Download MySQL Installer
1. Go to: https://dev.mysql.com/downloads/installer/
2. Download **MySQL Installer for Windows** (mysql-installer-community)
3. Choose the **mysql-installer-web-community** version (smaller download)

### Step 2: Install MySQL
1. Run the installer
2. Choose **Custom** installation
3. Select **MySQL Server 8.0**
4. Click **Next** through the setup
5. **IMPORTANT**: Set a root password (remember this!)
6. Keep default port: **3306**
7. Configure MySQL as a Windows Service (start automatically)
8. Complete installation

### Step 3: Configure the API
1. Open `D:\Project\Timetable\server\.env`
2. Update the password:
   ```env
   DB_PASSWORD=YOUR_MYSQL_PASSWORD
   ```
3. Run:
   ```cmd
   cd D:\Project\Timetable\server
   npm run db:init
   npm run dev
   ```

---

## Option 2: Use SQLite (Easier Setup)

If you don't want to install MySQL, I can switch to SQLite which requires no server installation.

Let me know if you want me to implement SQLite instead!

---

## Option 3: Use XAMPP (All-in-One Solution)

XAMPP includes MySQL and is easier to set up:

1. Download XAMPP: https://www.apachefriends.org/
2. Install XAMPP
3. Start **MySQL** from XAMPP Control Panel
4. Default password is **empty** (blank)
5. Update `.env`:
   ```env
   DB_PASSWORD=
   ```
6. Run:
   ```cmd
   npm run db:init
   ```

---

## Verify MySQL is Running

### Check if MySQL Service is Running:
```cmd
services.msc
```
Look for **MySQL80** or similar - it should show "Running"

### Test Connection:
```cmd
mysql -u root -p
```
Enter your password. If you see `mysql>` prompt, it's working!

---

## Current Status

✅ **Backend API code is ready**
✅ **Database schema is defined**
⚠️ **MySQL server needs to be installed/configured**

### What Works Now:
- Frontend authentication with localStorage (fallback mode)
- All UI components are functional
- JWT token management is implemented

### What Needs MySQL:
- Persistent user database
- Multi-user support
- Production-ready authentication

---

## Quick Test Without MySQL

The frontend will still work with localStorage authentication. Users can:
- Login with default admin credentials
- Manage timetable
- Use all features

The only limitation is that user data won't sync across devices/browsers.

Would you like me to:
1. **Wait for you to install MySQL** and then test?
2. **Switch to SQLite** (easier, no server needed)?
3. **Keep localStorage mode** for now (works immediately)?
