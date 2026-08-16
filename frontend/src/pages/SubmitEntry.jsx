import { useState, useEffect } from "react";
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
  const [coverFailed, setCoverFailed] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

  const loadUserPosts = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await api.get("/books?limit=1000");
      const myPosts = response.books.filter(
        (book) => book.submittedBy?._id === user._id,
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

  if (!user) {
    return (
      <p className="submit-status">
        Please <Link to="/login">log in</Link> to post a new book or article.
      </p>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
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
      setTitle("");
      setAuthor("");
      setIsbn("");
      setType("book");
      setDescription("");
      setCoverImage("");
      setLinkLabel("");
      setLinkUrl("");
      setShowForm(false);
      loadUserPosts();
      navigate(`/books/${book._id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  const deletePost = async (postId) => {
    setPendingDelete(null);
    try {
      await api.del(`/books/${postId}`);
      setUserPosts(userPosts.filter((post) => post._id !== postId));
    } catch (err) {
      setError(err.message);
    }
  };

  const postPendingDelete = userPosts.find((p) => p._id === pendingDelete);

  return (
    <div className="submit">
      <header className="submit-header">
        <h1 className="submit-title">My Posts</h1>
        <p className="submit-subtitle">
          Entries you have added to the archive. Anyone can read them, and you
          can remove your own at any time.
        </p>
      </header>

      <button
        type="button"
        className="submit-toggle-btn"
        onClick={() => setShowForm(!showForm)}
        aria-expanded={showForm}
      >
        {showForm ? "View my posts" : "Create a post"}
      </button>

      {showForm ? (
        <form className="submit-form" onSubmit={handleSubmit}>
          <div aria-live="polite">
            {error && (
              <div className="submit-error" role="alert">
                {error}
              </div>
            )}
          </div>

          <label htmlFor="title">
            Title <span className="submit-required">required</span>
          </label>
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

          <label htmlFor="isbn">ISBN</label>
          <span className="submit-hint" id="isbn-hint">
            Optional. The 13 digit number printed near the barcode.
          </span>
          <input
            id="isbn"
            type="text"
            placeholder="978-0-123456-78-9"
            aria-describedby="isbn-hint"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
          />

          <label htmlFor="type">
            Type <span className="submit-required">required</span>
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="book">Book</option>
            <option value="article">Article</option>
          </select>

          <label htmlFor="description">Description</label>
          <span className="submit-hint" id="desc-hint">
            Optional. A sentence or two about what this entry covers.
          </span>
          <textarea
            id="description"
            rows="4"
            aria-describedby="desc-hint"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label htmlFor="coverImage">Cover image URL</label>
          <span className="submit-hint" id="cover-hint">
            Optional. A direct web address ending in .jpg or .png. Leave it
            blank to use a text cover.
          </span>
          <input
            id="coverImage"
            type="url"
            placeholder="https://example.com/cover.jpg"
            aria-describedby="cover-hint"
            value={coverImage}
            onChange={(e) => {
              setCoverImage(e.target.value);
              setCoverFailed(false);
            }}
          />

          {coverImage && (
            <div className="submit-preview">
              {coverFailed ? (
                <p className="submit-preview-error">
                  This image could not be loaded. Check the address, or leave
                  the field blank to use a text cover.
                </p>
              ) : (
                <img
                  src={coverImage}
                  alt="Preview of the cover image"
                  className="submit-preview-img"
                  onError={() => setCoverFailed(true)}
                />
              )}
            </div>
          )}

          <label htmlFor="linkLabel">Resource link label</label>
          <span className="submit-hint" id="label-hint">
            Optional. A short name for the link, for example Free PDF.
          </span>
          <input
            id="linkLabel"
            type="text"
            placeholder="Free PDF"
            aria-describedby="label-hint"
            value={linkLabel}
            onChange={(e) => setLinkLabel(e.target.value)}
          />

          <label htmlFor="linkUrl">Resource link URL</label>
          <span className="submit-hint" id="url-hint">
            Optional. The full web address, starting with https.
          </span>
          <input
            id="linkUrl"
            type="url"
            placeholder="https://example.com/book.pdf"
            aria-describedby="url-hint"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
          />

          <button type="submit">Publish entry</button>
        </form>
      ) : (
        <div className="submit-posts-section">
          {loading ? (
            <p className="submit-status">Loading your posts...</p>
          ) : userPosts.length === 0 ? (
            <p className="submit-status">
              You have not posted any entries yet.{" "}
              <button
                type="button"
                className="submit-create-link"
                onClick={() => setShowForm(true)}
              >
                Create your first post
              </button>
            </p>
          ) : (
            <ul className="submit-posts-list">
              {userPosts.map((post) => (
                <li key={post._id} className="submit-post-item">
                  <div className="submit-post-info">
                    <h2 className="submit-post-title">
                      <Link
                        to={`/books/${post._id}`}
                        className="submit-post-link"
                      >
                        {post.title}
                      </Link>
                    </h2>
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
                      onClick={() => setPendingDelete(post._id)}
                      aria-label={`Delete the entry ${post.title}`}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {postPendingDelete && (
        <div className="submit-overlay">
          <div
            className="submit-confirm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="submit-confirm-title"
          >
            <h2 id="submit-confirm-title">Delete this entry?</h2>
            <p>
              &quot;{postPendingDelete.title}&quot; will be removed from the
              archive for everyone. This cannot be undone.
            </p>
            <div className="submit-confirm-actions">
              <button
                type="button"
                className="submit-cancel-btn"
                onClick={() => setPendingDelete(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="submit-confirm-btn"
                onClick={() => deletePost(postPendingDelete._id)}
              >
                Delete entry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubmitEntry;
