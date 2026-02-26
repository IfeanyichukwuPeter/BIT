# 🚀 Quick Start Guide

**Get the BIT Children Ministry website running in 5 minutes!**

---

## ⚡ Super Quick Setup (For Developers)

```bash
# 1. Clone the repo
git clone <repository-url>
cd BIT

# 2. Install dependencies
pnpm install

# 3. Copy environment file
cp .env.example .env

# 4. Start the server
pnpm dev

# 5. Open your browser
# Visit: http://localhost:3000
```

✅ **Done!** Your website is running.

---

## 📝 For Complete Beginners

### Step 1: Install Node.js

1. Go to [nodejs.org](https://nodejs.org/)
2. Download the **LTS version** (recommended)
3. Run the installer
4. Follow the installation wizard

**Verify installation:**
Open terminal/command prompt and type:
```bash
node --version
# Should show: v20.x.x or similar
```

### Step 2: Install pnpm (Package Manager)

In your terminal, run:
```bash
npm install -g pnpm
```

**Verify:**
```bash
pnpm --version
# Should show: 10.x.x or similar
```

### Step 3: Get the Code

**Option A: Download ZIP**
1. Go to the repository page
2. Click green "Code" button
3. Click "Download ZIP"
4. Extract the ZIP file to a folder

**Option B: Use Git (if installed)**
```bash
git clone <repository-url>
```

### Step 4: Open Terminal in Project Folder

**Windows:**
- Right-click in the BIT folder
- Select "Open in Terminal" or "Open PowerShell here"

**Mac:**
- Right-click the BIT folder
- Services → New Terminal at Folder

**Linux:**
- Right-click in BIT folder
- "Open in Terminal"

### Step 5: Install Project Dependencies

In the terminal, type:
```bash
pnpm install
```

Wait for it to complete (may take 1-2 minutes).

### Step 6: Set Up Configuration

1. Find the file `.env.example`
2. Make a copy and rename it to `.env`
3. (Optional) Edit `.env` to change the admin password

### Step 7: Start the Website

In terminal, run:
```bash
pnpm dev
```

You should see:
```
Server running on http://localhost:3000
```

### Step 8: View the Website

1. Open your web browser
2. Go to: `http://localhost:3000`
3. 🎉 Your website is live!

---

## 🔐 Admin Access

### Login to Admin Dashboard

1. Go to: `http://localhost:3000/admin.html`
2. Default credentials:
   - Username: `admin`
   - Password: `BITadmin123`

⚠️ **Important:** Change these credentials in production!

### What Can Admin Do?

- View all submitted questions
- Answer questions (they appear on the Contact page)
- Delete questions

---

## 📄 Pages Overview

| URL | Page | Purpose |
|-----|------|---------|
| `/` or `/index.html` | Home | Main landing page |
| `/about.html` | About | Ministry information |
| `/programs.html` | Programs | Events listing |
| `/contact.html` | Contact | Q&A page |
| `/admin.html` | Admin | Dashboard (requires login) |

---

## 🧪 Testing Your Setup

### Test 1: Submit a Question

1. Go to Contact page
2. Fill in the form
3. Click "Submit Question"
4. Should see success message

### Test 2: Admin Login

1. Go to Admin page
2. Enter credentials
3. Should see dashboard

### Test 3: Answer a Question

1. In admin dashboard
2. Find pending question
3. Type an answer
4. Click "Send Reply"
5. Go to Contact page (public view)
6. Should see answered question

---

## 🛑 Stopping the Server

In the terminal where the server is running:
- Press `Ctrl + C` (Windows/Linux)
- Press `Cmd + C` (Mac)

To start again: `pnpm dev`

---

## 📝 Common Commands

```bash
# Start development server
pnpm dev

# Run tests
pnpm test

# Start production server
pnpm start

# Install new package
pnpm add package-name
```

---

## ❓ Troubleshooting

### "Port 3000 already in use"

**Solution 1:** Stop other apps using port 3000

**Solution 2:** Change port in `.env`:
```env
PORT=3001
```

### "Command not found: pnpm"

**Solution:** Install pnpm:
```bash
npm install -g pnpm
```

### "Cannot find module"

**Solution:** Reinstall dependencies:
```bash
rm -rf node_modules
pnpm install
```

### Website shows blank page

**Solution:** Check terminal for errors and ensure server is running

---

## 🎯 Next Steps

Once your site is running:

1. ✅ Explore all pages
2. ✅ Test the Q&A system
3. ✅ Try admin features
4. ✅ Customize content
5. ✅ Read [README.md](README.md) for more details
6. ✅ Check [CONTRIBUTING.md](CONTRIBUTING.md) to learn how to contribute

---

## 💡 Tips

- Keep the terminal window open while developing
- The server auto-reloads when you save changes
- Check the terminal for error messages
- Use browser DevTools (F12) to debug

---

## 📞 Need Help?

1. Check the [README.md](README.md)
2. Look at [DEPLOYMENT.md](DEPLOYMENT.md) for production setup
3. Review error messages in terminal
4. Contact the development team

---

**Happy coding! 🎉**
