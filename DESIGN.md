# ReadArchive — Design Document

## Project Description

ReadArchive is a community-driven archive for books, PDFs, and articles where users can search by title, view descriptions, and access useful resource links such as legally available PDFs or websites to purchase physical copies. The database starts with a small seed of entries and grows continuously as users submit books or articles they care about, along with descriptions and relevant links. Registered users can save favorites, organize them into collections, and share those collections with others.

We built ReadArchive because information about books and research papers is often scattered across multiple websites. Our goal is a centralized platform where users can contribute, search, organize, and share reading resources.

**Tech Stack**
- Backend: Node.js + Express
- Frontend: React
- Database: MongoDB (Node.js Driver)

---

## User Personas

**Zhang — Student Reader**
A college student who wants a convenient way to search for books and articles for coursework and personal learning.

**Michael — Community Contributor**
A user who enjoys recommending books and articles and wants to share useful resources with others.

**Tom — Organized Reader**
A reader who likes to save interesting books and articles into personal favorites and collections.

**David — Content Maintainer**
An active user who helps keep the database accurate by updating descriptions and resource links.

---

## User Stories

1. As Zhang, I want to search for a book or article so that I can quickly find its information and useful resources.
2. As Michael, I want to contribute books and articles that I recommend so other users can discover them.
3. As Tom, I want to save books and articles to my favorites so I can organize my reading list.
4. As David, I want to update the links for an existing book or article so the information remains accurate and useful.

---

## Database Schema (MongoDB)

**Users** — account info, encrypted password, favorites list, collections list

**Entries** — title, author, type (book/article/PDF), description, resource links, submitted by, timestamps

**Collections** — name, owner, list of entry IDs, visibility (public/private)

### CRUD Operations

| Operation | Actions |
|-----------|---------|
| Create | Register/Login · Submit new entry · Add description & links · Add to favorites |
| Read | Search entries · View entry detail & PDF links · View favorites & collections |
| Update | Edit entry description · Add/update resource links · Manage favorites & collections |
| Delete | Delete an entry · Remove from favorites or collection |

---

## Design Mockups

### 1. Home / Landing Page

```
╔══════════════════════════════════════════════════════════════════════╗
║  📚 ReadArchive                          [Log In]  [Register]        ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║          Community-Driven Archive for Books & Articles               ║
║                                                                      ║
║   ┌──────────────────────────────────────────────┐  ┌──────────┐   ║
║   │  Search by title, author, or keyword...      │  │  Search  │   ║
║   └──────────────────────────────────────────────┘  └──────────┘   ║
║                                                                      ║
║   Filter: [All ▾]  [Books]  [Articles]  [PDFs]                      ║
║                                                                      ║
║  ── Recently Added ───────────────────────────────────────────────  ║
║                                                                      ║
║  ┌─────────────────────┐  ┌─────────────────────┐                  ║
║  │ [cover]             │  │ [cover]             │                   ║
║  │ The Great Gatsby    │  │ Deep Learning       │                   ║
║  │ F. Scott Fitzgerald │  │ Goodfellow et al.   │                   ║
║  │ Book · 2 links      │  │ Article · PDF avail │                   ║
║  │ ★ 4.2  [♡ Save]     │  │ ★ 4.8  [♡ Save]     │                   ║
║  └─────────────────────┘  └─────────────────────┘                  ║
║                                                                      ║
║  ── Popular This Week ─────────────────────────────────────────────  ║
║  1. Thinking, Fast and Slow  — Kahneman      ★ 4.7  [♡ Save]       ║
║  2. The Pragmatic Programmer — Hunt & Thomas ★ 4.6  [♡ Save]       ║
║  3. Atomic Habits            — James Clear   ★ 4.5  [♡ Save]       ║
║                                                                      ║
║  ── Browse by Category ────────────────────────────────────────────  ║
║  [Science]  [Technology]  [Literature]  [Research]  [Self-Help]     ║
║                                                                      ║
╠══════════════════════════════════════════════════════════════════════╣
║  [+ Submit an Entry]   About · FAQ · GitHub                         ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

### 2. Search Results Page

```
╔══════════════════════════════════════════════════════════════════════╗
║  📚 ReadArchive                          [Zhang ▾]  [+ Submit]       ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║   ┌──────────────────────────────────────────────┐  ┌──────────┐   ║
║   │  machine learning                            │  │  Search  │   ║
║   └──────────────────────────────────────────────┘  └──────────┘   ║
║                                                                      ║
║   Showing 24 results for "machine learning"                         ║
║   Sort by: [Relevance ▾]   Filter: [All Types ▾]  [Any Year ▾]     ║
║                                                                      ║
║  ┌──────────────────────────────────────────────────────────────┐  ║
║  │ [img]  The Hundred-Page Machine Learning Book                 │  ║
║  │        Burkov, Andriy · Book · Added by michael_c            │  ║
║  │        A practical guide covering supervised and             │  ║
║  │        unsupervised learning algorithms...                   │  ║
║  │        🔗 Free PDF  🔗 Amazon   ★ 4.6             [♡ Save]   │  ║
║  └──────────────────────────────────────────────────────────────┘  ║
║  ┌──────────────────────────────────────────────────────────────┐  ║
║  │ [img]  Pattern Recognition and Machine Learning              │  ║
║  │        Bishop, Christopher · Book · Added by david_m         │  ║
║  │        Comprehensive introduction to the field of            │  ║
║  │        pattern recognition and Bayesian methods...           │  ║
║  │        🔗 Free PDF  🔗 Buy Print  ★ 4.8          [♡ Save]   │  ║
║  └──────────────────────────────────────────────────────────────┘  ║
║  ┌──────────────────────────────────────────────────────────────┐  ║
║  │ [img]  A Survey of Deep Learning Techniques (Article)        │  ║
║  │        Liu et al. · Article · Added by zhang_s               │  ║
║  │        Survey paper covering convolutional, recurrent,       │  ║
║  │        and transformer architectures...                      │  ║
║  │        🔗 arXiv PDF  🔗 DOI Link  ★ 4.3         [♡ Save]   │  ║
║  └──────────────────────────────────────────────────────────────┘  ║
║                                                                      ║
║   [← Prev]   Page 1 of 3   [Next →]                                ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

### 3. Entry Detail Page (Book / Article)

```
╔══════════════════════════════════════════════════════════════════════╗
║  📚 ReadArchive                          [Zhang ▾]  [+ Submit]       ║
╠══════════════════════════════════════════════════════════════════════╣
║  ← Back to results                                                   ║
║                                                                      ║
║  ┌────────────┐   Thinking, Fast and Slow                           ║
║  │            │   Daniel Kahneman · 2011 · Non-Fiction / Psychology ║
║  │  [cover    │                                                      ║
║  │   image]   │   ★ ★ ★ ★ ★  4.7  (312 saves)                      ║
║  │            │                                                      ║
║  │            │   [♡ Save to Favorites]  [+ Add to Collection]      ║
║  └────────────┘                                                      ║
║                                                                      ║
║  ── Description ───────────────────────────────────────────────────  ║
║  In this international bestseller, Nobel Prize-winning economist     ║
║  Daniel Kahneman explores the two systems that drive the way we      ║
║  think — System 1 (fast, intuitive) and System 2 (slow, deliberate) ║
║  — and reveals the cognitive biases that affect our decisions.       ║
║                                                                      ║
║  ── Resource Links ────────────────────────────────────────────────  ║
║  🔗 Google Books Preview    https://books.google.com/...            ║
║  🔗 Buy on Amazon           https://amazon.com/...                  ║
║  🔗 WorldCat (Library)      https://worldcat.org/...                ║
║                                                                      ║
║  ── Submitted By ──────────────────────────────────────────────────  ║
║  michael_c · Submitted Jan 12, 2025  [✎ Suggest Edit]              ║
║                                                                      ║
║  ── Related Entries ───────────────────────────────────────────────  ║
║  • Predictably Irrational – Dan Ariely                              ║
║  • Nudge – Thaler & Sunstein                                        ║
║  • The Black Swan – Nassim Taleb                                    ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

### 4. Register / Login Page

```
╔══════════════════════════════════════════════════════════════════════╗
║  📚 ReadArchive                                                      ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║              ┌──────────────────────────────────────┐               ║
║              │           Create Account             │               ║
║              │                                      │               ║
║              │  Username                            │               ║
║              │  ┌────────────────────────────────┐  │               ║
║              │  │                                │  │               ║
║              │  └────────────────────────────────┘  │               ║
║              │                                      │               ║
║              │  Email                               │               ║
║              │  ┌────────────────────────────────┐  │               ║
║              │  │                                │  │               ║
║              │  └────────────────────────────────┘  │               ║
║              │                                      │               ║
║              │  Password                            │               ║
║              │  ┌────────────────────────────────┐  │               ║
║              │  │ ••••••••                        │  │               ║
║              │  └────────────────────────────────┘  │               ║
║              │                                      │               ║
║              │  Confirm Password                    │               ║
║              │  ┌────────────────────────────────┐  │               ║
║              │  │ ••••••••                        │  │               ║
║              │  └────────────────────────────────┘  │               ║
║              │                                      │               ║
║              │        [ Create Account ]            │               ║
║              │                                      │               ║
║              │  Already have an account? [Log In]   │               ║
║              └──────────────────────────────────────┘               ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```

**Login variant** — same card, fields: Email + Password, button: `[ Log In ]`, footer link: `Don't have an account? [Register]`

---

### 5. Submit New Entry Page

```
╔══════════════════════════════════════════════════════════════════════╗
║  📚 ReadArchive                          [Zhang ▾]  [+ Submit]       ║
╠══════════════════════════════════════════════════════════════════════╣
║  Submit a New Entry                                                  ║
║                                                                      ║
║  Title *                                                             ║
║  ┌────────────────────────────────────────────────────────────────┐ ║
║  │                                                                │ ║
║  └────────────────────────────────────────────────────────────────┘ ║
║                                                                      ║
║  Author *                        Type *                             ║
║  ┌──────────────────────────┐   ┌────────────────────┐            ║
║  │                          │   │  Book            ▾ │            ║
║  └──────────────────────────┘   └────────────────────┘            ║
║                                                                      ║
║  Year Published                  Category                           ║
║  ┌──────────────────────────┐   ┌────────────────────┐            ║
║  │                          │   │  Select...       ▾ │            ║
║  └──────────────────────────┘   └────────────────────┘            ║
║                                                                      ║
║  Description *                                                       ║
║  ┌────────────────────────────────────────────────────────────────┐ ║
║  │                                                                │ ║
║  │                                                                │ ║
║  │                                                                │ ║
║  └────────────────────────────────────────────────────────────────┘ ║
║                                                                      ║
║  Resource Links  (add at least one)                                  ║
║  ┌──────────────────────────────────┐ ┌────────────────────┐       ║
║  │  Label (e.g. "Free PDF")         │ │  https://...       │       ║
║  └──────────────────────────────────┘ └────────────────────┘       ║
║  [+ Add another link]                                               ║
║                                                                      ║
║  Cover Image URL  (optional)                                         ║
║  ┌────────────────────────────────────────────────────────────────┐ ║
║  │                                                                │ ║
║  └────────────────────────────────────────────────────────────────┘ ║
║                                                                      ║
║  [ Cancel ]                               [ Submit Entry ]          ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

### 6. Edit Entry Page (David's flow)

```
╔══════════════════════════════════════════════════════════════════════╗
║  📚 ReadArchive                          [David ▾]  [+ Submit]       ║
╠══════════════════════════════════════════════════════════════════════╣
║  Edit Entry: Thinking, Fast and Slow                                 ║
║  ⚠  You are editing a community entry. Changes will be saved.       ║
║                                                                      ║
║  Description                                                         ║
║  ┌────────────────────────────────────────────────────────────────┐ ║
║  │ In this international bestseller, Nobel Prize-winning          │ ║
║  │ economist Daniel Kahneman explores the two systems that        │ ║
║  │ drive the way we think...                                      │ ║
║  └────────────────────────────────────────────────────────────────┘ ║
║                                                                      ║
║  Resource Links                                                      ║
║  ┌──────────────────────────────┐  ┌──────────────────────┐  [✕]  ║
║  │  Google Books Preview        │  │  https://books.goo…  │       ║
║  └──────────────────────────────┘  └──────────────────────┘       ║
║  ┌──────────────────────────────┐  ┌──────────────────────┐  [✕]  ║
║  │  Buy on Amazon               │  │  https://amazon.com… │       ║
║  └──────────────────────────────┘  └──────────────────────┘       ║
║  ┌──────────────────────────────┐  ┌──────────────────────┐  [✕]  ║
║  │  WorldCat (Library)          │  │  https://worldcat.o… │       ║
║  └──────────────────────────────┘  └──────────────────────┘       ║
║  [+ Add link]                                                        ║
║                                                                      ║
║  [ Cancel ]       [ Delete Entry ]            [ Save Changes ]      ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

### 7. User Profile — Favorites & Collections (Tom's flow)

```
╔══════════════════════════════════════════════════════════════════════╗
║  📚 ReadArchive                          [Tom ▾]    [+ Submit]       ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║  Tom's Library                       [Settings]                     ║
║                                                                      ║
║  ┌────────────────────────┐  ┌────────────────────────────────────┐ ║
║  │  [Favorites]           │  │                                    │ ║
║  │  [My Collections]      │  │  ♡ Favorites  (14 entries)         │ ║
║  │  [Submitted Entries]   │  │  ────────────────────────────────  │ ║
║  └────────────────────────┘  │  Thinking, Fast and Slow          │ ║
║                              │    Kahneman · Book        [✕ Remove]│ ║
║                              │  Deep Learning             [✕ Remove]│ ║
║                              │    Goodfellow et al.               │ ║
║                              │  Atomic Habits             [✕ Remove]│ ║
║                              │    James Clear · Book              │ ║
║                              │  Dune                      [✕ Remove]│ ║
║                              │    Frank Herbert · Book            │ ║
║                              │                         [View All]  │ ║
║                              │                                    │ ║
║                              │  [+ Add to Collection ▾]           │ ║
║                              └────────────────────────────────────┘ ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

### 8. Collections Page

```
╔══════════════════════════════════════════════════════════════════════╗
║  📚 ReadArchive                          [Tom ▾]    [+ Submit]       ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║  My Collections                          [+ New Collection]         ║
║                                                                      ║
║  ┌─────────────────────────────────────┐                           ║
║  │  📂 ML & AI Reading List            │                           ║
║  │  8 entries · 🌐 Public              │                           ║
║  │  Last updated: Jul 10, 2026         │                           ║
║  │  [View]  [✎ Edit]  [Share]  [🗑]    │                           ║
║  └─────────────────────────────────────┘                           ║
║  ┌─────────────────────────────────────┐                           ║
║  │  📂 Science Fiction Must-Reads      │                           ║
║  │  12 entries · 🔒 Private            │                           ║
║  │  Last updated: Jun 28, 2026         │                           ║
║  │  [View]  [✎ Edit]  [Share]  [🗑]    │                           ║
║  └─────────────────────────────────────┘                           ║
║  ┌─────────────────────────────────────┐                           ║
║  │  📂 CS5610 Course References        │                           ║
║  │  5 entries · 🌐 Public              │                           ║
║  │  Last updated: Jul 14, 2026         │                           ║
║  │  [View]  [✎ Edit]  [Share]  [🗑]    │                           ║
║  └─────────────────────────────────────┘                           ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

### 9. Collection Detail Page (Shared View)

```
╔══════════════════════════════════════════════════════════════════════╗
║  📚 ReadArchive                          [Log In]  [Register]        ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║  📂 ML & AI Reading List                                            ║
║  Curated by tom_r · 8 entries · 🌐 Public · Shared Jul 15, 2026    ║
║                                                                      ║
║  ┌────────────────────────────────────────────────────────────────┐ ║
║  │  1. Pattern Recognition and Machine Learning   — Bishop        │ ║
║  │     Book · 🔗 Free PDF  🔗 Buy Print            [♡ Save]       │ ║
║  ├────────────────────────────────────────────────────────────────┤ ║
║  │  2. The Hundred-Page Machine Learning Book    — Burkov         │ ║
║  │     Book · 🔗 Free PDF  🔗 Amazon              [♡ Save]        │ ║
║  ├────────────────────────────────────────────────────────────────┤ ║
║  │  3. A Survey of Deep Learning Techniques     — Liu et al.     │ ║
║  │     Article · 🔗 arXiv                         [♡ Save]        │ ║
║  ├────────────────────────────────────────────────────────────────┤ ║
║  │  4. Deep Learning                             — Goodfellow     │ ║
║  │     Book · 🔗 Free Online  🔗 MIT Press        [♡ Save]        │ ║
║  └────────────────────────────────────────────────────────────────┘ ║
║                                            (+ 4 more entries...)    ║
║                                                                      ║
║  [ 🔗 Copy Share Link ]                                             ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

## Page Inventory

| # | Page | Primary Persona |
|---|------|----------------|
| 1 | Home / Landing | All |
| 2 | Search Results | Zhang |
| 3 | Entry Detail | Zhang |
| 4 | Register / Login | All |
| 5 | Submit New Entry | Michael |
| 6 | Edit Entry | David |
| 7 | Profile — Favorites | Tom |
| 8 | My Collections | Tom |
| 9 | Collection Detail (Shared) | Tom / All |

---

## Navigation Flow

```
[Home]
  ├── [Search Results]
  │       └── [Entry Detail]
  │               └── [Edit Entry]  (logged in only)
  │
  ├── [Register] / [Login]
  │
  ├── [Submit Entry]  (logged in only)
  │
  └── [User Profile]  (logged in only)
          ├── [Favorites]
          └── [My Collections]
                  └── [Collection Detail]  (shareable public URL)
```
