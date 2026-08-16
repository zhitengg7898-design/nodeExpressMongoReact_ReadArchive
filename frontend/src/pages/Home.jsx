import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { api } from "../api/client";
import BookCard from "../components/BookCard";
import "./Home.css";

function Home() {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBooks = useCallback(
    async (pageNum, append) => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams();
        if (query) params.set("q", query);
        if (typeFilter) params.set("type", typeFilter);
        params.set("page", String(pageNum));
        params.set("limit", "24");
        const data = await api.get(`/books?${params.toString()}`);
        setBooks((prev) => (append ? [...prev, ...data.books] : data.books));
        setTotalPages(data.pages);
        setPage(data.page);
        if (typeof data.total === "number") setTotal(data.total);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [query, typeFilter]
  );

  useEffect(() => {
    loadBooks(1, false);
  }, [loadBooks]);

  const handleSearch = (e) => {
    e.preventDefault();
    loadBooks(1, false);
  };

  const loadMore = () => {
    loadBooks(page + 1, true);
  };

  return (
    <div className="home">
      <section className="home-hero" aria-labelledby="home-title">
        <h1 id="home-title">Find your next read</h1>
        <p className="home-tagline">
          Search a shared archive of books and articles, open the resources
          freely, and keep the ones you like.
        </p>

        <form
          className="home-search"
          onSubmit={handleSearch}
          role="search"
          aria-label="Search the archive"
        >
          <label className="visually-hidden" htmlFor="home-search-input">
            Search by title, author, keyword or ISBN
          </label>
          <input
            id="home-search-input"
            type="search"
            placeholder="Search by title, author, keyword or ISBN..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="btn-approve">
            Search
          </button>
        </form>

        <div className="home-filters" role="group" aria-label="Filter by type">
          <button
            type="button"
            className={typeFilter === "" ? "active" : ""}
            aria-pressed={typeFilter === ""}
            onClick={() => setTypeFilter("")}
          >
            All
          </button>
          <button
            type="button"
            className={typeFilter === "book" ? "active" : ""}
            aria-pressed={typeFilter === "book"}
            onClick={() => setTypeFilter("book")}
          >
            Books
          </button>
          <button
            type="button"
            className={typeFilter === "article" ? "active" : ""}
            aria-pressed={typeFilter === "article"}
            onClick={() => setTypeFilter("article")}
          >
            Articles
          </button>
        </div>
      </section>

      <div aria-live="polite">
        {error && (
          <p className="home-status home-error" role="alert">
            {error}
          </p>
        )}

        {!loading && !error && books.length === 0 && (
          <p className="home-status">
            No results found. Try a shorter word, or a different spelling.
          </p>
        )}

        {!loading && !error && books.length > 0 && (
          <p className="home-count">
            Showing {books.length}
            {total > 0 ? ` of ${total}` : ""} entries
          </p>
        )}
      </div>

      <ul className="home-grid">
        {books.map((book) => (
          <li key={book._id}>
            <BookCard book={book} />
          </li>
        ))}
      </ul>

      {loading && <p className="home-status">Loading entries...</p>}

      {!loading && page < totalPages && (
        <div className="home-loadmore">
          <button type="button" onClick={loadMore}>
            Load more entries
          </button>
        </div>
      )}
    </div>
  );
}

Home.propTypes = {};

export default Home;
