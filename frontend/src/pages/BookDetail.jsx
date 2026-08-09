import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import "./BookDetail.css";

function BookDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favMsg, setFavMsg] = useState("");
  const [imgFailed, setImgFailed] = useState(false);
  const [supplementLabel, setSupplementLabel] = useState("");
  const [supplementUrl, setSupplementUrl] = useState("");
  const [addingSupplementLink, setAddingSupplementLink] = useState(false);
  const [showSupplementForm, setShowSupplementForm] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [collections, setCollections] = useState([]);
  const [showCollectionMenu, setShowCollectionMenu] = useState(false);
  const [loadingCollections, setLoadingCollections] = useState(false);
  const [deletingLinkId, setDeletingLinkId] = useState(null);

  const loadBook = () => {
    api
      .get(`/books/${id}`)
      .then((data) => {
        setBook(data);
        checkIfFavorite();
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  const checkIfFavorite = async () => {
    if (!user) return;
    try {
      const favorites = await api.get("/users/favorites");
      const inFav = favorites.some((fav) => fav._id === id);
      setIsFavorite(inFav);
    } catch (err) {
      console.error("Error checking favorites");
    }
  };

  useEffect(() => {
    setLoading(true);
    loadBook();
  }, [id, user]);

  const addToFavorites = async () => {
    setFavMsg("");
    try {
      if (isFavorite) {
        await api.del(`/users/favorites/${id}`);
        setIsFavorite(false);
        setFavMsg("Removed from favorites!");
      } else {
        await api.post("/users/favorites", { bookId: id });
        setIsFavorite(true);
        setFavMsg("Added to favorites!");
      }
    } catch (err) {
      setFavMsg(err.message);
    }
  };

  const deleteEntry = async () => {
    if (!window.confirm("Delete this entry? This cannot be undone.")) return;
    try {
      await api.del(`/books/${id}`);
      navigate("/");
    } catch (err) {
      setFavMsg(err.message);
    }
  };

  const loadCollections = async () => {
    if (!user) return;
    setLoadingCollections(true);
    try {
      const data = await api.get("/users/collections");
      setCollections(data);
    } catch (err) {
      console.error("Failed to load collections");
    } finally {
      setLoadingCollections(false);
    }
  };

  const addSupplementLink = async (e) => {
    e.preventDefault();
    if (!supplementLabel.trim() || !supplementUrl.trim()) {
      setFavMsg("Please provide both label and URL");
      return;
    }
    setAddingSupplementLink(true);
    try {
      const updated = await api.post(`/books/${id}/supplement-links`, {
        label: supplementLabel,
        url: supplementUrl,
      });
      setBook(updated);
      setSupplementLabel("");
      setSupplementUrl("");
      setFavMsg("Link added successfully!");
    } catch (err) {
      setFavMsg(err.message);
    } finally {
      setAddingSupplementLink(false);
    }
  };

  const deleteSupplementLink = async (linkId) => {
    setDeletingLinkId(null);
    try {
      const updated = await api.del(`/books/${id}/supplement-links/${linkId}`);
      setBook(updated);
    } catch (err) {
      setFavMsg(err.message);
    }
  };

  if (loading) return <p className="detail-status">Loading...</p>;
  if (error) return <p className="detail-status detail-error">{error}</p>;
  if (!book) return <p className="detail-status">Book not found.</p>;

  const showImage = book.coverImage && !imgFailed;
  const isOwner = user && book.submittedBy && user._id === book.submittedBy._id;

  return (
    <div className="detail">
      <Link to="/" className="detail-back">
        ← Back
      </Link>
      <div className="detail-content">
        <div className="detail-cover">
          {showImage ? (
            <img
              src={book.coverImage}
              alt={book.title}
              onError={() => setImgFailed(true)}
            />
          ) : (
            <div className="detail-textcover">
              <span className="detail-textcover-title">{book.title}</span>
              <span className="detail-textcover-author">{book.author}</span>
            </div>
          )}
        </div>
        <div className="detail-info">
          <span className={`detail-type detail-type-${book.type}`}>
            {book.type}
          </span>
          <h1>{book.title}</h1>
          <p className="detail-author">by {book.author}</p>
          {book.isbn && <p className="detail-isbn">ISBN: {book.isbn}</p>}
          <p className="detail-description">{book.description}</p>

          {user ? (
            <div className="detail-full-text-section">
              <h3 className="detail-full-text-header">Full Text</h3>

              {(book.links && book.links.length > 0) ||
              (book.supplementLinks && book.supplementLinks.length > 0) ? (
                <div className="detail-resources">
                  <div className="detail-resources-list">
                    {book.links &&
                      book.links.map((link) => (
                        <a
                          key={link.url}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="detail-resource-item"
                        >
                          <svg
                            className="detail-resource-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="12" y1="13" x2="12" y2="17"></line>
                            <line x1="10" y1="15" x2="14" y2="15"></line>
                          </svg>
                          <span className="detail-resource-label">
                            {link.label}
                          </span>
                          <svg
                            className="detail-resource-action-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                          </svg>
                        </a>
                      ))}

                    {book.supplementLinks &&
                      book.supplementLinks.map((link) => (
                        <div
                          key={link._id}
                          className="detail-resource-item detail-supplement-resource"
                        >
                          <svg
                            className="detail-resource-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                          </svg>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="detail-resource-label"
                          >
                            {link.label}
                          </a>
                          {user &&
                            link.contributedBy?.toString() === user._id && (
                              <button
                                type="button"
                                className="supplement-delete-btn"
                                onClick={() => setDeletingLinkId(link._id)}
                                title="Delete this resource"
                              >
                                ✕
                              </button>
                            )}
                          <svg
                            className="detail-resource-action-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                          </svg>
                        </div>
                      ))}
                  </div>
                </div>
              ) : null}

              <h3 className="detail-actions-header">Actions</h3>

              <div className="detail-actions">
                <button
                  type="button"
                  className={`detail-action-btn detail-favorite-btn ${isFavorite ? "is-favorited" : ""}`}
                  onClick={addToFavorites}
                  title={
                    isFavorite ? "Remove from favorites" : "Add to favorites"
                  }
                >
                  <svg
                    className="detail-action-icon"
                    viewBox="0 0 24 24"
                    fill={isFavorite ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  <span>{isFavorite ? "Unfavorite" : "Favorite"}</span>
                </button>

                <button
                  type="button"
                  className="detail-action-btn detail-add-resource-btn"
                  onClick={() => setShowSupplementForm(!showSupplementForm)}
                  title="Add a resource link"
                >
                  <svg
                    className="detail-action-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  <span>Add Resource</span>
                </button>

                <div className="collection-dropdown">
                  <button
                    type="button"
                    className="detail-action-btn detail-collection-btn"
                    onClick={() => {
                      setShowCollectionMenu(!showCollectionMenu);
                      if (!showCollectionMenu) loadCollections();
                    }}
                    title="Add to a collection"
                  >
                    <svg
                      className="detail-action-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                      <line x1="12" y1="11" x2="12" y2="17"></line>
                      <line x1="9" y1="14" x2="15" y2="14"></line>
                    </svg>
                    <span>Add to Collection</span>
                  </button>

                  {showCollectionMenu && (
                    <div className="collection-menu">
                      {loadingCollections ? (
                        <p className="collection-loading">
                          Loading collections...
                        </p>
                      ) : collections.length === 0 ? (
                        <p className="collection-empty">No collections yet</p>
                      ) : (
                        <div className="collection-list">
                          {collections.map((col) => (
                            <button
                              key={col._id}
                              type="button"
                              className="collection-item"
                              onClick={async () => {
                                try {
                                  await api.put(
                                    `/users/collections/${col._id}`,
                                    {
                                      addBook: id,
                                    },
                                  );
                                  setFavMsg(`Added to "${col.name}"!`);
                                  setShowCollectionMenu(false);
                                } catch (err) {
                                  setFavMsg(err.message);
                                }
                              }}
                            >
                              {col.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {isOwner && (
                  <button
                    type="button"
                    className="detail-action-btn detail-delete-btn"
                    onClick={deleteEntry}
                  >
                    <svg
                      className="detail-action-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                    <span>Delete Entry</span>
                  </button>
                )}
              </div>

              {showSupplementForm && (
                <div className="detail-add-supplement">
                  <form
                    onSubmit={addSupplementLink}
                    className="supplement-form"
                  >
                    <input
                      type="text"
                      placeholder="Link label (e.g. Alternative PDF)"
                      value={supplementLabel}
                      onChange={(e) => setSupplementLabel(e.target.value)}
                      disabled={addingSupplementLink}
                    />
                    <input
                      type="url"
                      placeholder="Link URL"
                      value={supplementUrl}
                      onChange={(e) => setSupplementUrl(e.target.value)}
                      disabled={addingSupplementLink}
                    />
                    <button type="submit" disabled={addingSupplementLink}>
                      {addingSupplementLink ? "Adding..." : "Add Resource"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          ) : (
            <p className="detail-login-hint">
              <Link to="/login">Log in</Link> to save this to favorites or
              contribute links.
            </p>
          )}
          {favMsg && <p className="detail-fav-msg">{favMsg}</p>}
        </div>
      </div>

      {deletingLinkId && (
        <div className="detail-delete-overlay">
          <div className="detail-delete-confirmation">
            <p>Delete this resource link?</p>
            <div className="detail-delete-actions">
              <button
                type="button"
                className="detail-delete-confirm-btn"
                onClick={() => deleteSupplementLink(deletingLinkId)}
              >
                Delete
              </button>
              <button
                type="button"
                className="detail-delete-cancel-btn"
                onClick={() => setDeletingLinkId(null)}
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

export default BookDetail;
