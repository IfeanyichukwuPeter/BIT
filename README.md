# 🌟 BIT Children Ministry Website

<div align="center">

**Where Kids & Teens Grow in Faith and Confidence**

A modern, interactive website for Blast In Tongues (BIT) Children Ministry - helping children and teenagers know God, build strong values, and grow with purpose.

[Visit Website](#) • [Report Bug](#) • [Request Feature](#)

</div>

---

## 📖 About the Project

BIT Children Ministry is a Bible-based ministry focused on guiding children and teenagers (ages 5-15) in their spiritual growth and character development. This website serves as the digital presence for the ministry, providing information about programs, events, and enabling interactive communication between parents/guardians and ministry leadership.

### ✨ Key Features

- 🏠 **Dynamic Landing Page** - Engaging hero section with ministry mission and vision
- 👥 **Leadership Team** - Meet the convener and coordinators
- 📅 **Events Showcase** - Past, ongoing, and upcoming ministry events
- ❓ **Q&A System** - Interactive question submission and answers display
- 🔐 **Admin Dashboard** - Secure admin panel for managing questions
- 📱 **Responsive Design** - Mobile-friendly interface
- 🔒 **Token-Based Authentication** - Secure admin access with JWT-like tokens

---

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Custom styling with responsive design
- **Vanilla JavaScript** - Client-side interactivity
- **Font Awesome** - Icon library
- **Google Fonts** - Typography (Source Sans 3, Poppins, Inter)

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **File-based Storage** - JSON data persistence
- **Token-based Auth** - Secure admin authentication

### Development & Testing
- **Jest** - Testing framework
- **Supertest** - HTTP testing
- **pnpm** - Package manager
- **Node --watch** - Development hot-reload

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **pnpm** (recommended) or npm - [Install pnpm](https://pnpm.io/installation)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BIT
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` to customize:
   ```env
   PORT=3000
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your-secure-password
   NODE_ENV=development
   ```

4. **Start the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:3000`

---

## 📂 Project Structure

```
BIT/
├── server/                    # Backend server code
│   ├── controllers/          # Business logic controllers
│   │   ├── authController.js
│   │   └── questionController.js
│   ├── routes/               # API route definitions
│   │   ├── auth.js
│   │   └── questions.js
│   ├── middleware/           # Custom middleware
│   │   └── auth.js
│   ├── utils/                # Utility functions
│   │   ├── fileStore.js
│   │   └── tokenManager.js
│   ├── app.js               # Express app setup
│   ├── server.js            # Server entry point
│   └── config.js            # Configuration
│
├── tests/                    # Test suites
│   ├── auth.test.js
│   ├── questions.test.js
│   └── server.test.js
│
├── data/                     # Data storage
│   └── questions.json       # Questions database
│
├── components/              # Reusable HTML components
│   ├── nav.html
│   └── footer.html
│
├── bitimg/                  # Images and assets
│
├── index.html              # Landing page
├── about.html              # About page
├── programs.html           # Events page
├── contact.html            # Contact & Q&A page
├── admin.html              # Admin dashboard
├── bit.css                 # Global styles
├── bit.js                  # Client-side JavaScript
│
└── package.json            # Dependencies & scripts
```

---

## 🔌 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication

#### Login
```http
POST /api/admin/login
Content-Type: application/json

{
  "username": "admin",
  "password": "BITadmin123"
}
```

**Response:**
```json
{
  "token": "abc123...",
  "message": "Login successful."
}
```

---

### Questions

#### Get All Questions
```http
GET /api/questions
GET /api/questions?status=answered
GET /api/questions?status=pending
```

#### Create Question (Public)
```http
POST /api/questions
Content-Type: application/json

{
  "name": "John Doe",
  "question": "What time do programs start?"
}
```

#### Update Question (Admin Only)
```http
PATCH /api/questions/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "answer": "Programs start at 9:00 AM."
}
```

#### Delete Question (Admin Only)
```http
DELETE /api/questions/:id
Authorization: Bearer <token>
```

---

## 🧪 Testing

### Run Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm run test:watch

# Run tests with coverage
pnpm run test:coverage
```

### Test Coverage

The project maintains **97.89%** test coverage:

- ✅ Authentication tests (6 tests)
- ✅ Questions CRUD tests (19 tests)
- ✅ Server health tests (2 tests)
- ✅ Full integration workflow

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm start` | Start production server |
| `pnpm dev` | Start development server with hot-reload |
| `pnpm test` | Run test suite |
| `pnpm run test:watch` | Run tests in watch mode |
| `pnpm run test:coverage` | Run tests with coverage report |

---

## 🎨 Pages Overview

### Public Pages

1. **Home (`index.html`)** - Landing page with hero, mission, leadership, and events
2. **About (`about.html`)** - Detailed information about the ministry's mission and vision
3. **Programs (`programs.html`)** - Past, ongoing, and upcoming events
4. **Contact (`contact.html`)** - Q&A submission form and answered questions

### Admin Pages

5. **Admin Dashboard (`admin.html`)** - Secure panel for answering and managing questions

---

## 👥 For Non-Developers

### What This Website Does

This is the official website for BIT Children Ministry. It helps:

- **Parents & Guardians**: Learn about the ministry, view upcoming events, and ask questions
- **Children & Teens**: See what programs are available and when they happen
- **Ministry Leaders**: Manage questions and communicate with the community

### How to Use the Website

1. **Browse Information**: Visit the Home, About, and Programs pages to learn about BIT
2. **Ask Questions**: Go to the Contact page to submit questions (answers appear once provided)
3. **View Events**: Check the Programs page for past and upcoming events
4. **Contact Coordinators**: Direct messaging links available on the Contact page

### Admin Access

Ministry leaders can log into the admin dashboard to:
- View all submitted questions
- Answer questions (answers appear publicly on the Contact page)
- Delete inappropriate or resolved questions

---

## 🔒 Security Notes

- Admin credentials should be changed from defaults in production
- Tokens are stored in browser localStorage
- All admin operations require authentication
- Use HTTPS in production
- Consider implementing rate limiting for public endpoints

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow existing code style and structure
- Write tests for new features
- Update documentation as needed
- Test responsiveness on mobile devices
- Ensure accessibility standards are met

---

## 🐛 Troubleshooting

### Common Issues

**Port already in use**
```bash
# Change PORT in .env file
PORT=3001
```

**Tests failing**
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**Questions not saving**
```bash
# Ensure data directory exists
mkdir -p data
echo "[]" > data/questions.json
```

---

## 📞 Contact & Support

- **Website**: [Your website URL]
- **Email**: childrenbit855@gmail.com
- **Phone**: +234 816 062 1567
- **Instagram**: [@bit38036](https://www.instagram.com/bit38036)
- **Facebook**: [BIT Children](https://www.facebook.com/share/1N2WmKBPV7/)
- **TikTok**: [@bit.children](https://www.tiktok.com/@bit.children)

---

## 📄 License

This project is proprietary software for BIT Children Ministry.

---

## 🙏 Acknowledgments

- Ministry leadership and volunteers
- Parents and guardians who support the ministry
- All the children and teenagers who participate in BIT programs

---

<div align="center">

**Built with ❤️ for BIT Children Ministry**

*Raising a generation that knows Christ, lives with purpose, and reflects God's love*

</div>
