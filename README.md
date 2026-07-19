# 📚 ReadArchive — Community Reading Archive

> A community-driven archive for books and articles where users can search by title, view descriptions, and access useful resource links. Registered users can contribute entries, save favorites, and organize them into collections.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-2563EB?style=for-the-badge)](https://nodeexpressmongoreact-readarchive.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/zhitengg7898-design/nodeExpressMongoReact_ReadArchive)


---

## 👤 Authors

| Field         | Student 1                                     | Student 2                                                     |
| ------------- | --------------------------------------------- | ------------------------------------------------------------  |
| **Name**      | Smitkumar Jayendrakumar Velani                | Zhiteng Guo                                                   |
| **Email**     | velanismitkumar@gmail.com                     | guo.zhit@northeastern.edu                                     |
| **GitHub**    | [Smit-Velani](https://github.com/Smit-Velani) | [zhitengg7898-design](https://github.com/zhitengg7898-design) |
| **Published** | July 2026                                     | July 2026                                                     |

---

## 🎓 Class

**CS5610 — Web Development**
Khoury College of Computer Sciences, Northeastern University
🔗 [Course Page](https://johnguerra.co/classes/webDevelopment_online_summer_2026/)

---

## 🎯 Project Objective

ReadArchive is a full-stack reading archive platform built with Node.js, Express, MongoDB (native driver), and React with Hooks (client-side rendered). Users can search for books and articles, view resource links (free PDFs, purchase pages), and contribute new entries. Registered users can save favorites and organize them into named collections.

**The problem we solve:** Information about books and research papers is often scattered across multiple websites. ReadArchive centralizes it — one place to find, contribute, and organize reading resources, powered by the community.

---

## 📸 Screenshot

![ReadArchive Screenshot](./screenshot.png)

> Live at: **https://nodeexpressmongoreact-readarchive.onrender.com**

> Note: Hosted on Render's free tier — the first request after inactivity may take ~50 seconds to wake.

---

## ✨ Features

**Book & Article Catalog (Smitkumar Velani)**

- Search books and articles by title, author, or keyword
- Filter by type (books / articles) with paginated "Load More"
- View entry details and resource links (free PDFs, purchase pages)
- Submit new entries via a form
- Delete entries you submitted
- Text-based fallback covers for entries without images

**Favorites & Collections (Zhiteng Guo)**

- Save entries to a personal favorites list
- Create, rename, and delete named collections
- Session-based authentication with Passport.js

**Technical**

- 2 MongoDB collections: `books` and `users`
- RESTful API with full CRUD on both collections
- React with Hooks, client-side rendered via Vite
- ES6 modules throughout — no CommonJS require
- CSS organized in per-component module files
- No Mongoose, no CORS, no template engines

---

## 🛠️ Instructions to Build

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/) (Atlas or local)

### Installation

```bash
# Clone the repository
git clone https://github.com/zhitengg7898-design/nodeExpressMongoReact_ReadArchive.git

# Navigate into the project
cd nodeExpressMongoReact_ReadArchive

# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### Environment Setup

```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your values
# PORT=3000
# MONGO_URI=your_mongodb_connection_string
# SESSION_SECRET=your_secret_here
```

### Seed Database

```bash
# Add 1000+ book and article records to the database
npm run seed
```

### Running Locally

```bash
# Terminal 1 — backend (auto-reload with nodemon)
npm run dev

# Terminal 2 — frontend (Vite dev server)
cd frontend && npm run dev
```

### Production Build

```bash
cd frontend && npm run build && cd ..
npm start
```

Open your browser at: `http://localhost:3000`

### Linting and Formatting

```bash
# Run ESLint
npx eslint .

# Format with Prettier
npm run format
```

---

## 🔌 API Endpoints

### Auth — `/api/auth`

| Method | Endpoint    | Description          |
| ------ | ----------- | -------------------- |
| POST   | `/register` | Create a new account |
| POST   | `/login`    | Log in               |
| POST   | `/logout`   | Log out              |

### Books & Articles — `/api/books`

| Method | Endpoint | Description                       |
| ------ | -------- | --------------------------------- |
| GET    | `/`      | Search / list entries (paginated) |
| GET    | `/:id`   | Get single entry details          |
| POST   | `/`      | Submit a new entry _(auth)_       |
| PUT    | `/:id`   | Update an entry _(auth)_          |
| DELETE | `/:id`   | Delete an entry _(auth)_          |

### Users — `/api/users`

| Method | Endpoint              | Description              |
| ------ | --------------------- | ------------------------ |
| GET    | `/me`                 | Get current session user |
| GET    | `/favorites`          | Get favorites            |
| POST   | `/favorites`          | Add to favorites         |
| DELETE | `/favorites/:bookId`  | Remove from favorites    |
| GET    | `/collections`        | Get collections          |
| POST   | `/collections`        | Create a collection      |
| PUT    | `/collections/:colId` | Update a collection      |
| DELETE | `/collections/:colId` | Delete a collection      |

---

## 🗄️ Database

**MongoDB with 2 collections:**

**`books` collection:**

```json
{
  "_id": "ObjectId",
  "title": "Thinking, Fast and Slow",
  "author": "Daniel Kahneman",
  "type": "book",
  "description": "...",
  "coverImage": "https://...",
  "links": [{ "label": "Buy on Amazon", "url": "https://..." }],
  "submittedBy": "ObjectId",
  "createdAt": "2026-07-17T00:00:00Z"
}
```

**`users` collection:**

```json
{
  "_id": "ObjectId",
  "username": "smit",
  "email": "smit@example.com",
  "password": "<bcrypt hash>",
  "favorites": ["ObjectId", "..."],
  "collections": [
    { "_id": "ObjectId", "name": "ML Reading List", "books": ["ObjectId"] }
  ],
  "createdAt": "2026-07-17T00:00:00Z"
}
```

The database is seeded with 1000+ synthetic records.

---

## 🔒 Security

- MongoDB credentials stored in `.env` (gitignored, never committed)
- `.env.example` provided as a template with no real credentials
- Passwords hashed with bcryptjs before storage
- Session secret stored in an environment variable
- Auth middleware guards all write operations

---

## 🤖 GenAI Tools

| Tool   | Provider  | Usage                                                      |
| ------ | --------- | --------------------------------------------------------- |
| Claude | Anthropic | Frontend development assistance, documentation, deployment |

**How it was used:**

- **Frontend (React)** — Claude assisted in building the React components (Home, BookDetail, BookCard, Navbar, Login, Register, Favorites, Collections, SubmitEntry), the API client, and the auth context, with explanation of each file
- **README & Design Document** — Claude helped structure the documentation and wireframes
- **Debugging & Deployment** — Claude assisted troubleshooting the MongoDB Atlas connection and Render deployment configuration

**What was NOT AI generated:**

- MongoDB connection module and native-driver collection setup
- Express REST API routes (auth, books, users)
- Passport.js session authentication
- Seed script for 1000+ records

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 📋 Design Document

The full design document including project description, user personas, user stories, and design mockups is available here:

📄 [DESIGN.md](DESIGN.md)

---

## 🎤 Presentation

📊 [View the project slides](https://docs.google.com/presentation/d/1ZNfEQ9SBFo-LG8-YNbBElUfMsbKZkHrk/edit?usp=sharing)


---

<p align="center">
  Built by <strong>Smitkumar Jayendrakumar Velani</strong> and <strong>Zhiteng Guo</strong> &middot; CS5610 Web Development &middot; Northeastern University &middot; July 2026
</p>
