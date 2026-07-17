# ReadArchive — Community Reading Archive

> A community-driven archive for books, PDFs, and articles where users can search by title, view descriptions, and access useful resource links. Registered users can save favorites, organize them into collections, and share those collections with others.

---

## Authors

| Field         | Student 1                                                     | Student 2 |
| ------------- | ------------------------------------------------------------- | --------- |
| **Name**      | Zhiteng Guo                                                   | Smitkumar Jayendrakumar Velani                          |
| **Email**     | guo.zhit@northeastern.edu                                     | velanismitkumar@gmail.com                               |
| **GitHub**    | [zhitengg7898-design](https://github.com/zhitengg7898-design) | [Smit-Velani](https://github.com/Smit-Velani)          |
| **Published** | July 2026                                                     | July 2026                                               |

---

## Class

**CS5610 — Web Development**
Khoury College of Computer Sciences, Northeastern University
[Course Page](https://johnguerra.co/classes/webDevelopment_online_summer_2026/)

---

## Project Objective

ReadArchive is a full-stack reading archive platform built with Node.js, Express, MongoDB, and React. Users can search for books and articles, view resource links (free PDFs, purchase pages, library links), and contribute new entries to grow the shared database. Registered users can save favorites, organize them into named collections, and share those collections publicly.

**The problem we solve:** Information about books and research papers is often scattered across multiple websites. ReadArchive centralizes it — one place to find, contribute, and organize reading resources, powered by the community.

---

## Screenshot

> Live at: _(deploy link here)_

---

## Project Structure

```
ReadAchive/
├── backend.js                  # Express app entry point
├── routes/
│   ├── auth.js                 # Register / login / logout
│   ├── books.js                # Book & article CRUD
│   └── users.js                # Favorites & collections
├── middleware/
│   └── auth.js                 # Session auth guard
├── config/
│   └── seed.js                 # Database seed script
├── frontend/                   # React + Vite app
│   ├── index.html
│   └── src/
│       ├── App.jsx
│       └── main.jsx
├── .env.example                # Environment variables template
├── package.json                # Backend dependencies
└── README.md
```

---

## Features

- Search books and articles by title, author, or keyword
- View resource links — free PDFs, purchase pages, library links
- Submit new entries with descriptions and links
- Edit existing entries to keep information accurate
- Save entries to a personal favorites list
- Organize favorites into named collections (public or private)
- Share public collections via a link
- Session-based authentication — no account required to browse

---

## Instructions to Build

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)

### Installation

```bash
# Clone the repository
git clone https://github.com/zhitengg7898-design/nodeExpressMongoReact_ReadArchive.git

# Navigate into the project
cd ReadAchive

# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### Environment Setup

```bash
# Copy the example env file
cp .env.example .env
```

Edit `.env` with your values:

```
MONGO_URI=mongodb://localhost:27017
DB_NAME=readarchive
SESSION_SECRET=your-secret-here
PORT=3000
```

### Seed the Database (optional)

```bash
node config/seed.js
```

### Running Locally

Open two terminals:

```bash
# Terminal 1 — backend (auto-restarts with nodemon)
npm run dev

# Terminal 2 — frontend (Vite dev server on port 5000)
cd frontend && npm run dev
```

- Backend API: `http://localhost:3000`
- Frontend: `http://localhost:5000`

### Production Build

```bash
cd frontend && npm run build
cd ..
npm start
```

---

## API Endpoints

### Auth — `/api/auth`

| Method | Path        | Description              |
| ------ | ----------- | ------------------------ |
| POST   | `/register` | Create a new account     |
| POST   | `/login`    | Log in                   |
| POST   | `/logout`   | Log out                  |
| GET    | `/me`       | Get current session user |

### Books & Articles — `/api/books`

| Method | Path   | Description                                   |
| ------ | ------ | --------------------------------------------- |
| GET    | `/`    | Search / list entries                         |
| GET    | `/:id` | Get entry detail                              |
| POST   | `/`    | Submit a new entry _(auth required)_          |
| PUT    | `/:id` | Update description or links _(auth required)_ |
| DELETE | `/:id` | Delete an entry _(auth required)_             |

### Users — `/api/users`

| Method | Path                 | Description                  |
| ------ | -------------------- | ---------------------------- |
| GET    | `/favorites`         | Get current user's favorites |
| POST   | `/favorites/:bookId` | Add to favorites             |
| DELETE | `/favorites/:bookId` | Remove from favorites        |
| GET    | `/collections`       | Get user's collections       |
| POST   | `/collections`       | Create a collection          |
| PUT    | `/collections/:id`   | Update a collection          |
| DELETE | `/collections/:id`   | Delete a collection          |

---

## Database

**MongoDB with 3 collections:**

**`users` collection:**

```json
{
  "_id": "ObjectId",
  "username": "zhang_s",
  "email": "zhang@example.com",
  "password": "<bcrypt hash>",
  "favorites": ["ObjectId", "..."],
  "createdAt": "2026-07-01T00:00:00Z"
}
```

**`books` collection:**

```json
{
  "_id": "ObjectId",
  "title": "Thinking, Fast and Slow",
  "author": "Daniel Kahneman",
  "type": "book",
  "category": "Psychology",
  "year": 2011,
  "description": "...",
  "links": [
    { "label": "Google Books", "url": "https://..." },
    { "label": "Buy on Amazon", "url": "https://..." }
  ],
  "submittedBy": "ObjectId",
  "createdAt": "2026-07-01T00:00:00Z"
}
```

**`collections` collection:**

```json
{
  "_id": "ObjectId",
  "name": "ML & AI Reading List",
  "owner": "ObjectId",
  "entries": ["ObjectId", "..."],
  "visibility": "public",
  "createdAt": "2026-07-01T00:00:00Z"
}
```

---

## Security

- MongoDB credentials stored in `.env` (never committed to GitHub)
- `.env.example` provided as a template with no real credentials
- Passwords hashed with bcryptjs before storage
- Session secret stored in environment variable
- Auth middleware guards all write operations

---

## GenAI Tools

| Tool   | Version                       | Usage                                                |
| ------ | ----------------------------- | ---------------------------------------------------- |
| Claude | claude-sonnet-4-6 (Anthropic) | README structure, Design Document, wireframe mockups |

**How it was used:**

- **README** — Claude helped structure all required sections following project template
- **Design Document** — Claude assisted with ASCII wireframe mockups for all 9 pages
- **DESIGN.md** — Claude helped write user personas, user stories, and navigation flow

**What was NOT AI generated:**

- MongoDB connection and collection setup
- Express REST API routes (auth, books, users)
- Passport.js session authentication
- React frontend components and routing
- Seed script for initial database records

---

## Design Document

The full design document including project description, user personas, user stories, and design mockups is available here:

[DESIGN.md](./DESIGN.md)

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

Built by **Zhiteng Guo** and **Smitkumar Jayendrakumar Velani** · CS5610 Web Development · Northeastern University · July 2026
