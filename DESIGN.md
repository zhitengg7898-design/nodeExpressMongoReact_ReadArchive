# 📐 ReadArchive — Design Document

**CS5610 Web Development · Northeastern University**
Authors: Smitkumar Jayendrakumar Velani · Zhiteng Guo

---

## 1. Project Description

ReadArchive is a community-driven archive for books and articles where users can search by title, author, keyword or ISBN, view descriptions, and open useful resource links such as legally available PDFs or pages where a physical copy can be bought. The database begins with a seed of entries and grows over time as registered users contribute new books and articles, each with a description and relevant links. Registered users can also save entries to a personal favorites list and organize them into named collections.

We built ReadArchive because information about books and research papers is often scattered across multiple websites. Our goal is a single, centralized platform where users can **contribute, search, and organize** reading resources, powered by the community.

**Tech Stack**

| Layer          | Technology                                            |
| -------------- | ----------------------------------------------------- |
| Backend        | Node.js, Express                                      |
| Frontend       | React with Hooks, Vite (client-side rendered)         |
| Database       | MongoDB (native Node.js driver — no Mongoose)         |
| Authentication | Passport.js (passport-local), express-session, bcrypt |
| Deployment     | Render                                                |

---

## 2. User Personas

**Zhang — Student Reader, age 18–25**
A college student who searches for books and articles for coursework. Often remembers only part of a title, so search has to be forgiving. Searches often, contributes occasionally.

**Michael — Community Contributor, age 25–40**
Reads widely and enjoys recommending books and articles. His motivation is adding resources so others can find them. Average comfort with technology, so field labels have to explain themselves.

**Tom — Organized Reader, age 20–50**
Saves reading material and wants it grouped by topic or by term. Values naming and managing his own collections, and returns regularly to add to lists he already made.

**David — Content Maintainer, age 30–60**
Contributes accurate entries with clear descriptions and working links, and removes entries that are no longer useful. Notices missing or wrong metadata such as an ISBN.

---

## 3. User Stories

1. **As Zhang**, I want to search for a book or article by title, author, keyword or ISBN so that I can quickly find its information and useful resources.
2. **As Michael**, I want to submit books and articles that I recommend, and add resource links to entries that already exist, so that other users can discover them.
3. **As Tom**, I want to save entries to my favorites and organize them into named collections so that I can manage my reading list.
4. **As David**, I want to delete an entry I submitted, with a clear confirmation, so that I can keep my contributions accurate without deleting something by mistake.

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
  "isbn": "978-0-374-53355-7",
  "coverImage": "https://...",
  "links": [{ "label": "Buy on Amazon", "url": "https://..." }],
  "supplementLinks": [
    {
      "_id": "ObjectId",
      "label": "Free PDF",
      "url": "https://...",
      "contributedBy": "ObjectId"
    }
  ],
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

| Operation | Actions                                                                                               |
| --------- | ----------------------------------------------------------------------------------------------------- |
| Create    | Register / Log in · Submit a new entry · Add a resource link · Add to favorites · Create a collection |
| Read      | Search & list entries · View entry details · View favorites & collections                             |
| Update    | Rename a collection · Add or remove books within a collection · Update an entry                       |
| Delete    | Delete a submitted entry · Remove a resource link · Remove from favorites · Delete a collection       |

---

## 5. Design System

This iteration introduced a shared design token system. All colors, fonts, spacing and shadows are declared once as CSS custom properties in `frontend/src/index.css`, and every component references those variables rather than hard-coded values.

### 5.1 Typography

| Role    | Typeface | Usage                                               |
| ------- | -------- | --------------------------------------------------- |
| Display | Fraunces | All headings, the brand mark, and card titles       |
| Body    | Inter    | Paragraphs, labels, buttons, and all interface text |

Fraunces is a serif face with a literary feel that suits a reading archive, and it contrasts clearly against Inter, a neutral sans-serif chosen for legibility at small sizes. Both are loaded from Google Fonts, so no default system font is relied on. Heading sizes use `clamp()` so they scale with the viewport.

### 5.2 Color Palette

| Token                  | Value     | Purpose                                 |
| ---------------------- | --------- | --------------------------------------- |
| `--color-primary`      | `#4338ca` | Brand indigo, links, active states      |
| `--color-primary-soft` | `#eef2ff` | Badge and hover backgrounds             |
| `--color-ink`          | `#17203a` | Headings and primary text               |
| `--color-ink-soft`     | `#3d4759` | Body copy                               |
| `--color-ink-muted`    | `#5c6472` | Hints, counts, secondary detail         |
| `--color-surface`      | `#ffffff` | Cards and panels                        |
| Background             | `#f7f5f0` | Warm paper base with soft radial washes |

The background is a warm off-white rather than pure white, with faint indigo and terracotta radial gradients, so the page reads as paper rather than a blank screen while keeping text contrast high.

### 5.3 Approve and Cancel Convention

The same three intents are used identically on every page, so a user never has to relearn what a color means:

| Intent            | Token             | Color     | Applied to                              |
| ----------------- | ----------------- | --------- | --------------------------------------- |
| Approve / confirm | `--color-approve` | `#4338ca` | Search, Create, Publish, Save, Register |
| Cancel / neutral  | `--color-cancel`  | `#4f5a6b` | Cancel buttons, Log Out                 |
| Destructive       | `--color-danger`  | `#c81e1e` | Delete and Remove actions               |

Destructive actions are outlined rather than filled in normal context, so they never compete visually with the primary action. They become filled only inside a confirmation dialog, where deletion is the expected action.

### 5.4 Spacing and Shape

Spacing uses a fixed scale from `--space-1` (0.25rem) to `--space-7` (3rem), so gaps and padding are consistent across pages. Corner radii use three steps (8px, 12px, 20px) and shadows three levels, applied by elevation rather than chosen per component.

### 5.5 Hierarchy

On every page the most important element appears first in the reading order, at the top left or centered above the fold: the brand mark in the navigation, then the page heading, then the primary action (search on Home, the create form on Collections), then supporting content. Card grids use a fixed `aspect-ratio` on covers so rows align regardless of image size.

---

## 6. Accessibility

The application scores **100 / 100 on Lighthouse Accessibility**.

| Area      | Implementation                                                                   |
| --------- | -------------------------------------------------------------------------------- |
| Landmarks | `header`, `main`, `footer`, and `article` per entry                              |
| Skip link | A visible-on-focus link jumps past the navigation to `#main-content`             |
| Headings  | Sequential order with no skipped levels on any page                              |
| Forms     | Every field has a `label`, with hint text on optional fields                     |
| Focus     | A 3px focus ring on all interactive elements, plus `focus-within` on cards       |
| State     | `aria-pressed` on toggles, `aria-expanded` on disclosures, `aria-live` on status |
| Lists     | Result grids and collection contents are real `ul` / `li` structures             |
| Images    | Decorative covers use empty `alt`, since the title sits beside them as text      |
| Dialogs   | `role="dialog"` with `aria-modal` and a labelled title                           |
| Motion    | `prefers-reduced-motion` disables transitions                                    |
| Keyboard  | The whole application can be operated without a mouse                            |

Color contrast was verified across the palette, including the generated fallback cover colors, all of which meet or exceed a 4.5:1 ratio against their text.

---

## 7. Design Mockups

### 7.1 Home / Search Page

```
+----------------------------------------------------------+
|  ReadArchive         Home    Log In    [ Register ]      |
+----------------------------------------------------------+
|                  Find your next read                     |
|      Search a shared archive of books and articles,      |
|      open the resources freely, keep the ones you like   |
|                                                          |
|  [ Search by title, author, keyword or ISBN ]  [ Search ]|
|              ( All )   ( Books )   ( Articles )          |
|                                                          |
|                 Showing 24 of 1050 entries               |
|                                                          |
|   +----------+  +----------+  +----------+  +----------+ |
|   | [ cover ]|  | [ cover ]|  | [ cover ]|  | [ cover ]| |
|   |  BOOK    |  | ARTICLE  |  |  BOOK    |  |  BOOK    | |
|   |  Title   |  |  Title   |  |  Title   |  |  Title   | |
|   |  Author  |  |  Author  |  |  Author  |  |  Author  | |
|   +----------+  +----------+  +----------+  +----------+ |
|                                                          |
|                  [ Load more entries ]                   |
+----------------------------------------------------------+
```

### 7.2 Book / Article Detail Page

```
+----------------------------------------------------------+
|  < Back to all entries                                   |
|                                                          |
|  +-----------+   BOOK                                    |
|  |           |   Title of the Book                       |
|  | [ cover ] |   by Author Name                          |
|  |           |   ISBN: 978-...                           |
|  +-----------+   Description text...                     |
|                                                          |
|                  Full Text                               |
|                  [ Free PDF                   -> ]       |
|                  [ Buy on Amazon              -> ]       |
|                                                          |
|                  Actions                                 |
|                  [ Favorite ]  [ Add a link ]            |
|                  [ Add to Collection ] [ Delete Entry ]  |
+----------------------------------------------------------+
```

### 7.3 Register / Login Page

```
+----------------------------------------------------------+
|                     Create Account                       |
|                  Join ReadArchive today                  |
|                                                          |
|    Username   [______________________________]           |
|    Email      [______________________________]           |
|    Password   [______________________________]           |
|                                                          |
|                    [    Register    ]                    |
|            Already have an account?  Log in              |
+----------------------------------------------------------+
```

### 7.4 My Posts / Submit a New Entry

```
+----------------------------------------------------------+
|  My Posts                                                |
|  Entries you have added to the archive.                  |
|                              [ Create a post ]           |
|                                                          |
|   Title  required     [___________________________]      |
|   Author              [___________________________]      |
|   ISBN                                                   |
|   Optional. The 13 digit number near the barcode.        |
|                       [___________________________]      |
|   Type   required     [ Book                    v ]      |
|   Description                                            |
|   Optional. A sentence or two about this entry.          |
|                       [___________________________]      |
|   Cover image URL                                        |
|   Optional. A direct address ending in .jpg or .png      |
|                       [___________________________]      |
|                       [ preview ]                        |
|   Resource link label                                    |
|   Optional. A short name, for example Free PDF.          |
|                       [___________________________]      |
|   Resource link URL                                      |
|                       [___________________________]      |
|                                                          |
|                   [    Publish entry    ]                |
+----------------------------------------------------------+
```

### 7.5 Favorites Page

```
+----------------------------------------------------------+
|  My Favorites                                            |
|  Favorites is one saved list. To group entries by topic, |
|  use Collections instead.                                |
|                                                          |
|  +----------------------------------------------------+  |
|  |  Title of the Book                     [ Remove ]  |  |
|  |  by Author Name                                    |  |
|  |  ISBN: 978-...                                     |  |
|  |  Description preview...                            |  |
|  +----------------------------------------------------+  |
+----------------------------------------------------------+
```

### 7.6 Collections Page

```
+----------------------------------------------------------+
|  My Collections                                          |
|  Collections are named lists you create.                 |
|                                                          |
|  [ New collection name... ]      [ Create Collection ]   |
|                                                          |
|  +----------------------------------------------------+  |
|  |  ML Reading List          [ Rename ]  [ Delete ]   |  |
|  |  3 entries                                         |  |
|  |    - Deep Learning                     [ Remove ]  |  |
|  |    - Clean Code                        [ Remove ]  |  |
|  |    - The Pragmatic Programmer          [ Remove ]  |  |
|  +----------------------------------------------------+  |
+----------------------------------------------------------+
```

### 7.7 Confirmation Dialog

Every destructive action opens the same pattern, naming the item and stating what will and will not be removed.

```
+------------------------------------------------+
|  Delete "ML Reading List"?                     |
|                                                |
|  This collection holds 3 entries. The          |
|  collection will be removed, but the entries   |
|  stay in the archive. This cannot be undone.   |
|                                                |
|          [ Cancel ]  [ Delete collection ]     |
+------------------------------------------------+
```

---

## 8. Navigation Flow

```
                 +-------------------+
                 |   Home / Search   |
                 +-------------------+
                    |            |
          view entry|            | search / filter
                    v            v
          +--------------------+    (results update in place)
          |    Book Detail     |
          |  favorite · link   |
          |  collection · del  |
          +--------------------+

   Register / Login  --->  Authenticated Session
        |                          |
        v                          v
   +-----------+   +-------------+   +---------------+
   | My Posts  |   |  Favorites  |   |  Collections  |
   +-----------+   +-------------+   +---------------+
```

---

## 9. Changes From the Usability Study

Three participants completed six tasks each. Every task was finished and only one hint was needed across all sessions, so the changes below address clarity rather than broken functionality.

| Finding                                                 | Change made                                                         |
| ------------------------------------------------------- | ------------------------------------------------------------------- |
| One participant thought the site held only twelve books | A result count now reads "Showing 24 of 1050 entries"               |
| Favorites and Collections were confused with each other | A one-line explanation was added to both pages                      |
| The resource label and link fields were mixed up        | Both fields now have visible labels, hints and example placeholders |
| A cover image URL failed silently                       | A live preview with an error message was added to the submit form   |
| An entry could be deleted with no confirmation          | Confirmation dialogs were added for every destructive action        |
| Delete buttons used an unclear "×" symbol               | All were replaced with labelled Remove and Delete buttons           |
| New users did not realise an account was needed         | A footer line explains what registering allows                      |

---

_ReadArchive · CS5610 Web Development · Northeastern University · August 2026_
