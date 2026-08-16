import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import "./Collections.css";

function Collections() {
  const { user } = useAuth();
  const [collections, setCollections] = useState([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [deletingColId, setDeletingColId] = useState(null);
  const [removingBook, setRemovingBook] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.get("/users/collections");
      setCollections(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    load();
  }, [user]);

  const createCollection = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      await api.post("/users/collections", { name: newName });
      setNewName("");
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteCollection = (colId) => {
    setDeletingColId(colId);
  };

  const confirmDelete = async () => {
    if (!deletingColId) return;
    try {
      await api.del(`/users/collections/${deletingColId}`);
      setDeletingColId(null);
      load();
    } catch (err) {
      setError(err.message);
      setDeletingColId(null);
    }
  };

  const startRename = (colId, currentName) => {
    setRenamingId(colId);
    setRenameValue(currentName);
  };

  const confirmRename = async (colId) => {
    if (!renameValue.trim()) return;
    try {
      await api.put(`/users/collections/${colId}`, { name: renameValue });
      setRenamingId(null);
      setRenameValue("");
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const removeBookFromCollection = async (colId, bookId) => {
    setRemovingBook(null);
    try {
      await api.put(`/users/collections/${colId}`, { removeBook: bookId });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  if (!user)
    return (
      <p className="col-status">
        Please <Link to="/login">log in</Link> to view your collections.
      </p>
    );
  if (loading) return <p className="col-status">Loading your collections...</p>;

  const colPendingDelete = collections.find((c) => c._id === deletingColId);

  return (
    <div className="col">
      <header className="col-header">
        <h1 className="col-title">My Collections</h1>
        <p className="col-subtitle">
          Collections are named lists you create, for example a reading list for
          one course. To save an entry to a single list instead, use Favorites.
        </p>
      </header>

      <form className="col-form" onSubmit={createCollection}>
        <label className="visually-hidden" htmlFor="new-collection">
          New collection name
        </label>
        <input
          id="new-collection"
          type="text"
          placeholder="New collection name, for example ML Reading List"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          required
        />
        <button type="submit">Create Collection</button>
      </form>

      <div aria-live="polite">
        {error && (
          <p className="col-error" role="alert">
            {error}
          </p>
        )}
      </div>

      {collections.length === 0 ? (
        <p className="col-status">
          No collections yet. Create one above, then open any entry and choose
          Add to Collection.
        </p>
      ) : (
        <ul className="col-list">
          {collections.map((col) => (
            <li key={col._id} className="col-card">
              <div className="col-card-header">
                {renamingId === col._id ? (
                  <div className="col-rename-input">
                    <label
                      className="visually-hidden"
                      htmlFor={`rename-${col._id}`}
                    >
                      New name for {col.name}
                    </label>
                    <input
                      id={`rename-${col._id}`}
                      type="text"
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      autoFocus
                    />
                    <button
                      type="button"
                      className="col-confirm-btn"
                      onClick={() => confirmRename(col._id)}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="col-cancel-btn"
                      onClick={() => setRenamingId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="col-card-title">{col.name}</h2>
                    <div className="col-card-actions">
                      <button
                        type="button"
                        className="col-rename-btn"
                        onClick={() => startRename(col._id, col.name)}
                        aria-label={`Rename the collection ${col.name}`}
                      >
                        Rename
                      </button>
                      <button
                        type="button"
                        className="col-delete-btn"
                        onClick={() => deleteCollection(col._id)}
                        aria-label={`Delete the collection ${col.name}`}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>

              <p className="col-count">
                {col.books.length}{" "}
                {col.books.length === 1 ? "entry" : "entries"}
              </p>

              {col.books.length > 0 ? (
                <ul className="col-books">
                  {col.books.map((book) => (
                    <li key={book._id} className="col-book-item">
                      <Link to={`/books/${book._id}`} className="col-book-link">
                        {book.title}
                      </Link>
                      <button
                        type="button"
                        className="col-remove-book-btn"
                        onClick={() =>
                          setRemovingBook({
                            colId: col._id,
                            colName: col.name,
                            bookId: book._id,
                            bookTitle: book.title,
                          })
                        }
                        aria-label={`Remove ${book.title} from ${col.name}`}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="col-empty">
                  No entries in this collection yet. Open an entry and choose
                  Add to Collection.
                </p>
              )}
            </li>
          ))}
        </ul>
      )}

      {colPendingDelete && (
        <div className="col-delete-overlay">
          <div
            className="col-delete-confirmation"
            role="dialog"
            aria-modal="true"
            aria-labelledby="col-delete-title"
          >
            <h2 id="col-delete-title">
              Delete &quot;{colPendingDelete.name}&quot;?
            </h2>
            <p>
              This collection holds {colPendingDelete.books.length}{" "}
              {colPendingDelete.books.length === 1 ? "entry" : "entries"}. The
              collection will be removed, but the entries stay in the archive.
              This cannot be undone.
            </p>
            <div className="col-delete-buttons">
              <button
                type="button"
                className="col-delete-cancel-btn"
                onClick={() => setDeletingColId(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="col-delete-confirm-btn"
                onClick={confirmDelete}
              >
                Delete collection
              </button>
            </div>
          </div>
        </div>
      )}

      {removingBook && (
        <div className="col-delete-overlay">
          <div
            className="col-delete-confirmation"
            role="dialog"
            aria-modal="true"
            aria-labelledby="col-remove-title"
          >
            <h2 id="col-remove-title">Remove this entry?</h2>
            <p>
              Remove &quot;{removingBook.bookTitle}&quot; from{" "}
              {removingBook.colName}? The entry stays in the archive.
            </p>
            <div className="col-delete-buttons">
              <button
                type="button"
                className="col-delete-cancel-btn"
                onClick={() => setRemovingBook(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="col-delete-confirm-btn"
                onClick={() =>
                  removeBookFromCollection(
                    removingBook.colId,
                    removingBook.bookId,
                  )
                }
              >
                Remove entry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Collections;
