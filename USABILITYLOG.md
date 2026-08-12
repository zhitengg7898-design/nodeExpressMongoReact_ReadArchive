# Changelog - 2026-08-12

## Feature 1: Fuzzy Search Implementation

**Issue:**
Users cannot find books with partial vocabulary (e.g., searching "Algor" should return "Introduction to Algorithms").

**Change:**
Implement case-insensitive substring matching for book search across title, author, and description fields.

**Priority:** Must

**Was it implemented? How?**
Yes. Modified `routes/books.js` to use MongoDB `$regex` operator with case-insensitive flag (`$options: "i"`). Now supports partial vocabulary matching:

- Search query: "Algor" → Returns: "Introduction to Algorithms"
- Search query: "Clean" → Returns: "Clean Code"

## Feature 2: ISBN Support

**Issue:**
Books lack ISBN identifiers for cataloging and international identification.

**Change:**
Add ISBN field to all books and enable ISBN-based search functionality.

**Priority:** Must

**Was it implemented? How?**
Yes. Made changes across 4 files:

1. `config/seed.js`: Added real ISBN-13 numbers to all 20 seed books
2. `routes/books.js`: Added ISBN detection and search (detects "978" prefix pattern)
3. `frontend/src/components/BookCard.jsx`: Display ISBN when available
4. `frontend/src/components/BookCard.css`: Styled ISBN display (small gray text)

## Feature 3: Navigation Label Update

**Issue:**
The navigation menu displays generic "Post" label which is unclear.

**Change:**
Change "Post" to "My Posts" in navigation and page titles for clarity.

**Priority:** Should

**Was it implemented? How?**
Yes. Modified 2 files:

1. `frontend/src/components/Navbar.jsx`: Link text changed to "My Posts"
2. `frontend/src/pages/SubmitEntry.jsx`: Page title changed to "My Posts"

## Feature 4: Delete Button Style Standardization

**Issue:**
Delete buttons display inconsistent × symbol instead of clear text labels.

**Change:**
Replace × with "Delete" text on all delete buttons across Favorites, Collections, and My Posts pages.

**Priority:** Should

**Was it implemented? How?**
Yes. Modified 5 files:

1. `frontend/src/pages/Favorites.jsx`: Changed delete button text from × to "Delete"
2. `frontend/src/pages/Favorites.css`: Updated button styling (padding: 0.25rem 0.5rem, font-size: 0.9rem)
3. `frontend/src/pages/Collections.jsx`: Changed delete button text from × to "Delete"
4. `frontend/src/pages/SubmitEntry.jsx`: Changed delete button text from × to "Delete"
5. `frontend/src/pages/SubmitEntry.css`: Updated button styling to match other pages

## Feature 5: Duplicate Book Detection

**Issue:**
Users can submit the same book multiple times without warning, creating duplicate entries.

**Change:**
Detect duplicate books when user submits and provide warning with link to existing entry.

**Priority:** Must

**Was it implemented? How?**
Yes. Made changes across 3 files:

1. `routes/books.js` (POST /api/books):
   - Query checks if user already submitted same book (case-insensitive title+author match)
   - Returns 409 status with `existingId` when duplicate detected
   - Book data only saved if unique
2. `frontend/src/api/client.js`:
   - Enhanced error object to include `error.status` and `error.data` properties
   - Enables frontend to access detailed error information
3. `frontend/src/pages/SubmitEntry.jsx` + `SubmitEntry.css`:
   - Displays duplicate warning popup with yellow theme
   - Provides "View Existing Book" link
   - Prevents form submission when duplicate detected

## Feature 6: Delete Confirmation Popups - Favorites

**Issue:**
Users can accidentally delete favorites without confirmation, leading to data loss.

**Change:**
Add confirmation popup before removing favorite books.

**Priority:** Should

**Was it implemented? How?**
Yes. Modified 2 files:

1. `frontend/src/pages/Favorites.jsx`:
   - Added `deletingId` state to track which item needs deletion
   - Added `confirmUnfavorite(bookId)` function to show confirmation
   - Modified `unfavorite()` to check confirmation before executing
   - Popup displays with overlay background and confirmation dialog
2. `frontend/src/pages/Favorites.css`:
   - Added `.fav-delete-overlay` (fixed overlay with semi-transparent background)
   - Added `.fav-delete-confirmation` (white dialog box with animation)
   - Added `.fav-delete-buttons` with confirm/cancel styling
   - Red confirm button, gray cancel button

## Feature 7: Delete Confirmation Popups - My Posts

**Issue:**
Users can accidentally delete their posts without confirmation.

**Change:**
Add confirmation popup before deleting posts.

**Priority:** Should

**Was it implemented? How?**
Yes. Modified 2 files:

1. `frontend/src/pages/SubmitEntry.jsx`:
   - Added `deletingPostId` state
   - Added `confirmDeletePost(postId)` function to show confirmation
   - Modified `deletePost()` to check confirmation before executing
   - Popup displays "Delete Post?" with confirmation dialog
2. `frontend/src/pages/SubmitEntry.css`:
   - Added `.submit-delete-overlay` (fixed overlay)
   - Added `.submit-delete-confirmation` (white dialog)
   - Added `.submit-delete-buttons` with styling
   - Includes `slideUp` animation

## Feature 8: Delete Confirmation Popups - Collections

**Issue:**
Users can accidentally delete books from collections or delete collections themselves without confirmation.

**Change:**
Add separate confirmation popups for removing books from collections and deleting collections.

**Priority:** Should

**Was it implemented? How?**
Yes. Modified 1 file:

1. `frontend/src/pages/Collections.jsx`:
   - Added `deletingBookData` state for book removal confirmation
   - Added `confirmRemoveBook(colId, bookId, bookTitle)` function
   - Popup displays "Remove from Collection?" with book title
   - Existing `deletingColId` state handles collection deletion
   - Both operations require user confirmation before executing

## Feature 9: Resource Links Accessibility for Unauthorized Users

**Issue:**
Unauthorized users cannot access resource links; they are hidden behind login requirement.

**Change:**
Allow users to access and view resource links without requiring login.

**Priority:** Must

**Was it implemented? How?**
Yes. Modified 1 file:

1. `frontend/src/pages/BookDetail.jsx`:
   - Moved resource links section outside user authentication check
   - Resource links (`book.links` and `book.supplementLinks`) now visible to all users
   - User action buttons (Favorite, Add Resource, Add to Collection, Delete) remain behind login
   - Delete resource buttons only shown to resource contributors
   - Backend endpoint `GET /api/books/:id` already supports public access

---

## Summary

**Total Files Modified:** 16
**Lines Added:** ~700+
**Lines Removed:** ~200+
**Features Implemented:** 9
**Commits:** 3

### Files Changed:

1. `routes/books.js` - Search, ISBN, duplicate detection
2. `config/seed.js` - ISBN data
3. `frontend/src/api/client.js` - Error handling
4. `frontend/src/components/Navbar.jsx` - Label update
5. `frontend/src/components/BookCard.jsx` - ISBN display
6. `frontend/src/components/BookCard.css` - ISBN styling
7. `frontend/src/pages/Favorites.jsx` - Delete confirmation
8. `frontend/src/pages/Favorites.css` - Popup styling
9. `frontend/src/pages/Collections.jsx` - Delete confirmations
10. `frontend/src/pages/Collections.css` - Popup styling
11. `frontend/src/pages/SubmitEntry.jsx` - Title, delete confirmation, duplicate warning
12. `frontend/src/pages/SubmitEntry.css` - Button and popup styling
13. `frontend/src/pages/BookDetail.jsx` - Resource link accessibility

### Git Commits:

1. `c5bb101` - Add delete confirmation popups and update delete button styles
2. `5dbc575` - Fix: Allow unauthorized users to access resource links
