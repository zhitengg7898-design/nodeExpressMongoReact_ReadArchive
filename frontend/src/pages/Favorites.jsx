import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import "./Favorites.css";

function Favorites() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const loadFavorites = () => {
    setLoading(true);
    api
      .get("/users/favorites")
      .then((data) => setBooks(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    loadFavorites();
  }, [user]);

  const confirmUnfavorite = (bookId) => {
    setDeletingId(bookId);
  };

  const unfavorite = async () => {
    if (!deletingId) return;
    try {
      await api.del(`/users/favorites/${deletingId}`);
      setBooks(books.filter((b) => b._id !== deletingId));
      setDeletingId(null);
    } catch (err) {
      setError(err.message);
      setDeletingId(null);
    }
  };

  if (!user)
    return <p className="fav-status">Please log in to view your favorites.</p>;
  if (loading) return <p className="fav-status">Loading...</p>;
  if (error) return <p className="fav-status fav-error">{error}</p>;

  return (
    <div className="fav">
      <h1 className="fav-title">My Favorites</h1>
      {books.length === 0 ? (
        <p className="fav-status">
          No favorites yet. Browse books and add some!
        </p>
      ) : (
        <div className="fav-list">
          {books.map((book) => (
            <div
              key={book._id}
              className="fav-item"
              onClick={() => navigate(`/books/${book._id}`)}
            >
              <div className="fav-item-content">
                <h3>{book.title}</h3>
                {book.author && <p className="fav-author">by {book.author}</p>}
                {book.isbn && <p className="fav-isbn">ISBN: {book.isbn}</p>}
                <p className="fav-description">{book.description}</p>
              </div>
              <div className="fav-item-actions">
                <button
                  className="fav-remove-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmUnfavorite(book._id);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {deletingId && (
        <div className="fav-delete-overlay">
          <div className="fav-delete-confirmation">
            <h3>Remove from Favorites?</h3>
            <p>This book will be removed from your favorites.</p>
            <div className="fav-delete-buttons">
              <button className="fav-delete-confirm-btn" onClick={unfavorite}>
                Remove
              </button>
              <button
                className="fav-delete-cancel-btn"
                onClick={() => setDeletingId(null)}
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

export default Favorites;
