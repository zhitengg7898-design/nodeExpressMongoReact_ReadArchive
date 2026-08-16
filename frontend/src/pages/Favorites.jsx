import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import "./Favorites.css";

function Favorites() {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingRemoval, setPendingRemoval] = useState(null);

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

  const unfavorite = async (bookId) => {
    setPendingRemoval(null);
    try {
      await api.del(`/users/favorites/${bookId}`);
      setBooks(books.filter((b) => b._id !== bookId));
    } catch (err) {
      setError(err.message);
    }
  };

  if (!user)
    return (
      <p className="fav-status">
        Please <Link to="/login">log in</Link> to view your favorites.
      </p>
    );
  if (loading) return <p className="fav-status">Loading your favorites...</p>;
  if (error)
    return (
      <p className="fav-status fav-error" role="alert">
        {error}
      </p>
    );

  const bookPendingRemoval = books.find((b) => b._id === pendingRemoval);

  return (
    <div className="fav">
      <header className="fav-header">
        <h1 className="fav-title">My Favorites</h1>
        <p className="fav-subtitle">
          Favorites is one saved list. To group entries by topic, use
          Collections instead.
        </p>
      </header>

      {books.length === 0 ? (
        <p className="fav-status">
          No favorites yet. Open any entry and choose Favorite to save it here.
        </p>
      ) : (
        <ul className="fav-list">
          {books.map((book) => (
            <li key={book._id} className="fav-item">
              <div className="fav-item-content">
                <h2 className="fav-item-title">
                  <Link to={`/books/${book._id}`} className="fav-item-link">
                    {book.title}
                  </Link>
                </h2>
                {book.author && <p className="fav-author">by {book.author}</p>}
                {book.isbn && <p className="fav-isbn">ISBN: {book.isbn}</p>}
                <p className="fav-description">{book.description}</p>
              </div>

              <div className="fav-item-actions">
                <button
                  type="button"
                  className="fav-remove-btn"
                  onClick={() => setPendingRemoval(book._id)}
                  aria-label={`Remove ${book.title} from favorites`}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {bookPendingRemoval && (
        <div className="fav-overlay">
          <div
            className="fav-confirm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="fav-confirm-title"
          >
            <p id="fav-confirm-title">
              Remove &quot;{bookPendingRemoval.title}&quot; from your favorites?
              The entry stays in the archive.
            </p>
            <div className="fav-confirm-actions">
              <button
                type="button"
                className="fav-confirm-btn"
                onClick={() => unfavorite(bookPendingRemoval._id)}
              >
                Remove
              </button>
              <button
                type="button"
                className="fav-cancel-btn"
                onClick={() => setPendingRemoval(null)}
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
