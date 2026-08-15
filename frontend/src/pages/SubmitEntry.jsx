import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import "./SubmitEntry.css";

function SubmitEntry() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [type, setType] = useState("book");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [linkLabel, setLinkLabel] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [error, setError] = useState("");
  const [duplicateBookId, setDuplicateBookId] = useState(null);
  const [duplicateMessage, setDuplicateMessage] = useState("");
  const [deletingPostId, setDeletingPostId] = useState(null);

  const loadUserPosts = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await api.get("/books?limit=1000");
      const myPosts = response.books.filter(
        (book) => book.submittedBy?._id === user._id
      );
      setUserPosts(myPosts);
    } catch (err) {
      console.error("Failed to load posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserPosts();
  }, [user]);

  // Keyboard support for deletion dialog
  useEffect(() => {
    if (!deletingPostId) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setDeletingPostId(null);
      } else if (e.key === "Enter") {
        deletePost();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [deletingPostId]);
  if (!user) {
    return (
      <p className="submit-status">Please log in to post a new book or PDF.</p>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setDuplicateBookId(null);
    setDuplicateMessage("");
    try {
      const links = [];
      if (linkLabel && linkUrl) {
        links.push({ label: linkLabel, url: linkUrl });
      }
      const book = await api.post("/books", {
        title,
        author,
        isbn,
        type,
        description,
        coverImage,
        links,
      });
      // Reset form
      setTitle("");
      setAuthor("");
      setIsbn("");
      setType("book");
      setDescription("");
      setCoverImage("");
      setLinkLabel("");
      setLinkUrl("");
      setShowForm(false);
      // Reload posts
      loadUserPosts();
      navigate(`/books/${book._id}`);
    } catch (err) {
      // Check if this is a duplicate book error (409)
      if (err.status === 409 && err.data?.existingId) {
        setDuplicateBookId(err.data.existingId);
        setDuplicateMessage(err.message);
        setError("");
      } else {
        setError(err.message);
      }
    }
  };

  const confirmDeletePost = (postId) => {
    setDeletingPostId(postId);
  };

  const deletePost = async () => {
    if (!deletingPostId) return;
    try {
      await api.del(`/books/${deletingPostId}`);
      setUserPosts(userPosts.filter((post) => post._id !== deletingPostId));
      setDeletingPostId(null);
    } catch (err) {
      setError(err.message);
      setDeletingPostId(null);
    }
  };

  return (
    <div className="submit">
      <h1 className="submit-title">My Posts</h1>
      <button
        type="button"
        className="submit-toggle-btn"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "View Posts" : "Create Post"}
      </button>

      {showForm ? (
        <form className="submit-form" onSubmit={handleSubmit}>
          {error && <div className="submit-error">{error}</div>}
          {duplicateBookId && (
            <div className="submit-duplicate-warning">
              <p>{duplicateMessage}</p>
              <div className="submit-duplicate-actions">
                <Link
                  to={`/books/${duplicateBookId}`}
                  className="submit-duplicate-link"
                >
                  View Existing Book
                </Link>
                <button
                  type="button"
                  className="submit-duplicate-cancel"
                  onClick={() => {
                    setDuplicateBookId(null);
                    setDuplicateMessage("");
                    setTitle("");
                    setAuthor("");
                    setIsbn("");
                  }}
                >
                  Post Different Book
                </button>
              </div>
            </div>
          )}

          {!duplicateBookId && (
            <>
              <label htmlFor="title">Title *</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <label htmlFor="author">Author</label>
              <input
                id="author"
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />

              <label htmlFor="isbn">ISBN (optional)</label>
              <input
                id="isbn"
                type="text"
                placeholder="e.g. 978-0-123456-78-9"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
              />

              <label htmlFor="type">Type *</label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="book">Book</option>
                <option value="article">Article</option>
              </select>

              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <label htmlFor="coverImage">Cover Image URL (optional)</label>
              <input
                id="coverImage"
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
              />

              <label htmlFor="linkLabel">Resource Link Label (optional)</label>
              <input
                id="linkLabel"
                type="text"
                placeholder="e.g. Free PDF, Buy on Amazon"
                value={linkLabel}
                onChange={(e) => setLinkLabel(e.target.value)}
              />

              <label htmlFor="linkUrl">Resource Link URL (optional)</label>
              <input
                id="linkUrl"
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />

              <button type="submit">Post Book/PDF</button>
            </>
          )}
        </form>
      ) : (
        <div className="submit-posts-section">
          {loading ? (
            <p className="submit-status">Loading your posts...</p>
          ) : userPosts.length === 0 ? (
            <p className="submit-status">
              You haven't posted any books yet.{" "}
              <button
                type="button"
                className="submit-create-link"
                onClick={() => setShowForm(true)}
              >
                Create your first post
              </button>
            </p>
          ) : (
            <div className="submit-posts-list">
              {userPosts.map((post) => (
                <div
                  key={post._id}
                  className="submit-post-item"
                  onClick={() => navigate(`/books/${post._id}`)}
                >
                  <div className="submit-post-info">
                    <h2>{post.title}</h2>
                    {post.author && (
                      <p className="submit-post-author">by {post.author}</p>
                    )}
                    {post.isbn && (
                      <p className="submit-post-isbn">ISBN: {post.isbn}</p>
                    )}
                    <span
                      className={`submit-post-type submit-type-${post.type}`}
                    >
                      {post.type}
                    </span>
                    <p className="submit-post-description">
                      {post.description}
                    </p>
                  </div>
                  <div className="submit-post-actions">
                    <button
                      type="button"
                      className="submit-post-delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        confirmDeletePost(post._id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {deletingPostId && (
        <div
          className="submit-delete-overlay"
          role="alertdialog"
          aria-label="Confirm post deletion"
        >
          <div className="submit-delete-confirmation">
            <h3>Delete Post?</h3>
            <p>This action cannot be undone.</p>
            <div className="submit-delete-buttons">
              <button
                className="submit-delete-confirm-btn"
                onClick={deletePost}
                autoFocus
                aria-label="Confirm deletion"
              >
                Delete
              </button>
              <button
                className="submit-delete-cancel-btn"
                onClick={() => setDeletingPostId(null)}
                aria-label="Cancel deletion"
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

SubmitEntry.propTypes = {};

export default SubmitEntry;
