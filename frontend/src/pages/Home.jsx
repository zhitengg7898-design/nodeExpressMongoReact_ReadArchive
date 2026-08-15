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
      <div className="home-hero">
        <h1>ReadArchive</h1>
        <p>Search, save, and share books and articles</p>
        <form className="home-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search by title, author, or keyword..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
        <div className="home-filters">
          <button
            type="button"
            className={typeFilter === "" ? "active" : ""}
            onClick={() => setTypeFilter("")}
          >
            All
          </button>
          <button
            type="button"
            className={typeFilter === "book" ? "active" : ""}
            onClick={() => setTypeFilter("book")}
          >
            Books
          </button>
          <button
            type="button"
            className={typeFilter === "article" ? "active" : ""}
            onClick={() => setTypeFilter("article")}
          >
            Articles
          </button>
        </div>
      </div>

      {error && <p className="home-status home-error">{error}</p>}
      {!loading && !error && books.length === 0 && (
        <p className="home-status">No results found.</p>
      )}

      <div className="home-grid">
        {books.map((book) => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>

      {loading && <p className="home-status">Loading...</p>}

      {!loading && page < totalPages && (
        <div className="home-loadmore">
          <button type="button" onClick={loadMore}>
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

Home.propTypes = {};

export default Home;
