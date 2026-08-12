import { useState, useEffect } from "react";
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
  const [deletingBookData, setDeletingBookData] = useState(null);

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
    try {
      await api.put(`/users/collections/${colId}`, { removeBook: bookId });
      setDeletingBookData(null);
      load();
    } catch (err) {
      setError(err.message);
      setDeletingBookData(null);
    }
  };

  const confirmRemoveBook = (colId, bookId, bookTitle) => {
    setDeletingBookData({ colId, bookId, bookTitle });
  };

  if (!user)
    return (
      <p className="col-status">Please log in to view your collections.</p>
    );
  if (loading) return <p className="col-status">Loading...</p>;

  return (
    <div className="col">
      <h1 className="col-title">My Collections</h1>

      <form className="col-form" onSubmit={createCollection}>
        <input
          type="text"
          placeholder="New collection name..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          required
        />
        <button type="submit">Create Collection</button>
      </form>

      {error && <p className="col-error">{error}</p>}

      {collections.length === 0 ? (
        <p className="col-status">No collections yet. Create one above!</p>
      ) : (
        <div className="col-list">
          {collections.map((col) => (
            <div key={col._id} className="col-card">
              <div className="col-card-header">
                {renamingId === col._id ? (
                  <div className="col-rename-input">
                    <input
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
                    <h3>{col.name}</h3>
                    <div className="col-card-actions">
                      <button
                        type="button"
                        className="col-rename-btn"
                        onClick={() => startRename(col._id, col.name)}
                      >
                        Rename
                      </button>
                      <button
                        type="button"
                        className="col-delete-btn"
                        onClick={() => deleteCollection(col._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
              <p className="col-count">
                {col.books.length} {col.books.length === 1 ? "book" : "books"}
              </p>
              {col.books.length > 0 ? (
                <div className="col-books">
                  {col.books.map((book) => (
                    <div key={book._id} className="col-book-item">
                      <a href={`/books/${book._id}`} className="col-book-link">
                        {book.title}
                      </a>
                      <button
                        type="button"
                        className="col-remove-book-btn"
                        onClick={() =>
                          confirmRemoveBook(col._id, book._id, book.title)
                        }
                        title="Remove from collection"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="col-empty">No books in this collection yet</p>
              )}
            </div>
          ))}
        </div>
      )}

      {deletingBookData && (
        <div className="col-delete-overlay">
          <div className="col-delete-confirmation">
            <h3>Remove from Collection?</h3>
            <p>
              "{deletingBookData.bookTitle}" will be removed from this
              collection.
            </p>
            <div className="col-delete-buttons">
              <button
                type="button"
                className="col-delete-confirm-btn"
                onClick={() =>
                  removeBookFromCollection(
                    deletingBookData.colId,
                    deletingBookData.bookId,
                  )
                }
              >
                Remove
              </button>
              <button
                type="button"
                className="col-delete-cancel-btn"
                onClick={() => setDeletingBookData(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {deletingColId && (
        <div className="col-delete-overlay">
          <div className="col-delete-confirmation">
            <h3>Delete Collection?</h3>
            <p>This action cannot be undone.</p>
            <div className="col-delete-buttons">
              <button
                type="button"
                className="col-delete-confirm-btn"
                onClick={confirmDelete}
              >
                Delete
              </button>
              <button
                type="button"
                className="col-delete-cancel-btn"
                onClick={() => setDeletingColId(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Collections;
