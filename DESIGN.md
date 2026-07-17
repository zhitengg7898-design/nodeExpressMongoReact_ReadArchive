# 📐 ReadArchive — Design Document

**CS5610 Web Development · Northeastern University**
Authors: Smitkumar Jayendrakumar Velani · Zhiteng Guo

---

## 1. Project Description

ReadArchive is a community-driven archive for books and articles where users can search by title, view descriptions, and access useful resource links such as legally available PDFs or websites to purchase physical copies. The database begins with a seed of entries and grows over time as registered users contribute new books and articles, each with a description and relevant links. Registered users can also save entries to a personal favorites list and organize them into named collections.

We built ReadArchive because information about books and research papers is often scattered across multiple websites. Our goal is a single, centralized platform where users can **contribute, search, and organize** reading resources, powered by the community.

**Tech Stack**

| Layer          | Technology                                             |
| -------------- | ----------------------------------------------------- |
| Backend        | Node.js, Express                                       |
| Frontend       | React with Hooks, Vite (client-side rendered)          |
| Database       | MongoDB (native Node.js driver — no Mongoose)          |
| Authentication | Passport.js (passport-local), express-session, bcrypt  |
| Deployment     | Render                                                  |

---

## 2. User Personas

**Zhang — Student Reader**
A college student who wants a convenient way to search for books and articles for coursework and personal learning.

**Michael — Community Contributor**
A user who enjoys recommending books and articles and wants to add useful resources so other users can discover them.

**Tom — Organized Reader**
A reader who likes to save interesting books and articles into personal favorites and collections.

**David — Content Maintainer**
An active user who contributes accurate entries with clear descriptions and working resource links, and removes entries that are no longer useful.

---

## 3. User Stories

1. **As Zhang**, I want to search for a book or article by title, author, or keyword so that I can quickly find its information and useful resources.
2. **As Michael**, I want to submit books and articles that I recommend so that other users can discover them.
3. **As Tom**, I want to save entries to my favorites and organize them into named collections so that I can manage my reading list.
4. **As David**, I want to delete an entry I submitted so that I can keep my contributions accurate and relevant.

---

## 4. Database Schema

The application uses **two MongoDB collections**, both supporting full CRUD operations.

### `books` Collection

```json
{
  "_id": "ObjectId",
  "title": "Thinking, Fast and Slow",
  "author": "Daniel Kahneman",
  "type": "book",
  "description": "An exploration of the two systems that drive the way we think.",
  "coverImage": "https://...",
  "links": [{ "label": "Buy on Amazon", "url": "https://..." }],
  "submittedBy": "ObjectId",
  "createdAt": "2026-07-17T00:00:00Z",
  "updatedAt": "2026-07-17T00:00:00Z"
}
```

### `users` Collection

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
  "createdAt": "2026-07-17T00:00:00Z",
  "updatedAt": "2026-07-17T00:00:00Z"
}
```

### CRUD Coverage

| Operation | Actions                                                                        |
| --------- | ----------------------------------------------------------------------------- |
| Create    | Register / Log in · Submit a new entry · Add to favorites · Create collection |
| Read      | Search & list entries · View entry details · View favorites & collections     |
| Update    | Rename a collection · Add or remove books within a collection                 |
| Delete    | Delete a submitted entry · Remove from favorites · Delete a collection        |

---

## 5. Design Mockups

### 5.1 Home / Search Page

```
+----------------------------------------------------------+
|  ReadArchive          Home   Log In   [ Register ]       |
+----------------------------------------------------------+
|                     ReadArchive                          |
|         Search, save, and share books and articles       |
|                                                          |
|   [ Search by title, author, or keyword... ]  [ Search ] |
|                 ( All )  ( Books )  ( Articles )         |
|                                                          |
|   +----------+  +----------+  +----------+  +----------+  |
|   | [ cover ]|  | [ cover ]|  | [ cover ]|  | [ cover ]|  |
|   |  Title   |  |  Title   |  |  Title   |  |  Title   |  |
|   |  Author  |  |  Author  |  |  Author  |  |  Author  |  |
|   +----------+  +----------+  +----------+  +----------+  |
|                                                          |
|                      [ Load More ]                       |
+----------------------------------------------------------+
```

### 5.2 Book / Article Detail Page

```
+----------------------------------------------------------+
|  < Back to search                                        |
|                                                          |
|  +-----------+    BOOK                                   |
|  |           |    Title of the Book                      |
|  |  [ cover ]|    by Author Name                         |
|  |           |    Description text...                    |
|  +-----------+                                           |
|                  Resources                               |
|                  [ Free PDF ]   [ Buy on Amazon ]        |
|                                                          |
|                  [ Add to Favorites ]  [ Delete Entry ]  |
+----------------------------------------------------------+
```

### 5.3 Register / Login Page

```
+----------------------------------------------------------+
|                    Create Account                        |
|                  Join ReadArchive today                  |
|                                                          |
|    Username   [______________________________]          |
|    Email      [______________________________]          |
|    Password   [______________________________]          |
|                                                          |
|                    [    Register    ]                    |
|            Already have an account?  Log in              |
+----------------------------------------------------------+
```

### 5.4 Submit a New Entry

```
+----------------------------------------------------------+
|  Submit a New Entry                                      |
|                                                          |
|    Title *       [______________________________]        |
|    Author        [______________________________]        |
|    Type *        [ Book                     v ]          |
|    Description    [______________________________]       |
|                   [______________________________]       |
|    Cover Image    [______________________________]       |
|    Link Label     [______________________________]       |
|    Link URL       [______________________________]       |
|                                                          |
|                    [   Submit Entry   ]                  |
+----------------------------------------------------------+
```

### 5.5 Favorites Page

```
+----------------------------------------------------------+
|  My Favorites                                            |
|                                                          |
|   +----------+  +----------+  +----------+                |
|   | [ cover ]|  | [ cover ]|  | [ cover ]|                |
|   |  Title   |  |  Title   |  |  Title   |                |
|   |  Author  |  |  Author  |  |  Author  |                |
|   +----------+  +----------+  +----------+                |
+----------------------------------------------------------+
```

### 5.6 Collections Page

```
+----------------------------------------------------------+
|  My Collections                                          |
|                                                          |
|   [ New collection name... ]              [ Create ]     |
|                                                          |
|   +--------------------------------------------------+   |
|   |  ML Reading List           [ Rename ] [ Delete ] |   |
|   |  3 book(s)                                        |   |
|   |   - Deep Learning                                 |   |
|   |   - Clean Code                                    |   |
|   |   - The Pragmatic Programmer                      |   |
|   +--------------------------------------------------+   |
+----------------------------------------------------------+
```

---

## 6. Navigation Flow

```
                 +-------------------+
                 |   Home / Search   |
                 +-------------------+
                    |            |
          view entry|            | search / filter
                    v            v
          +------------------+   (results update in place)
          |  Book Detail     |
          |  favorite/delete |
          +------------------+

   Register / Login  --->  Authenticated Session
        |                        |
        v                        v
   +-----------+   +-------------+   +---------------+
   |  Submit   |   |  Favorites  |   |  Collections  |
   +-----------+   +-------------+   +---------------+
```

---

*ReadArchive · CS5610 Web Development · Northeastern University · July 2026*