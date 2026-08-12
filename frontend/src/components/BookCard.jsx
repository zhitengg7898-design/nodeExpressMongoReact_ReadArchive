import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "./BookCard.css";

function colorFromTitle(title) {
  const colors = [
    "#4f46e5",
    "#0891b2",
    "#be123c",
    "#15803d",
    "#b45309",
    "#7c3aed",
    "#0f766e",
    "#a21caf",
  ];
  let sum = 0;
  for (let i = 0; i < title.length; i++) sum += title.charCodeAt(i);
  return colors[sum % colors.length];
}

function BookCard({ book }) {
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = book.coverImage && !imgFailed;

  const handleLoad = (e) => {
    // Some broken URLs load a tiny placeholder pixel; treat those as failed
    if (e.target.naturalWidth < 50 || e.target.naturalHeight < 50) {
      setImgFailed(true);
    }
  };

  return (
    <Link to={`/books/${book._id}`} className="book-card">
      <div className="book-card-cover">
        {showImage ? (
          <img
            src={book.coverImage}
            alt={book.title}
            onError={() => setImgFailed(true)}
            onLoad={handleLoad}
          />
        ) : (
          <div
            className="book-card-textcover"
            style={{ background: colorFromTitle(book.title) }}
          >
            <span className="book-card-textcover-title">{book.title}</span>
            <span className="book-card-textcover-author">{book.author}</span>
          </div>
        )}
      </div>
      <div className="book-card-body">
        <span className={`book-card-type book-card-type-${book.type}`}>
          {book.type}
        </span>
        <h3 className="book-card-title">{book.title}</h3>
        <p className="book-card-author">{book.author}</p>
        {book.isbn && <p className="book-card-isbn">ISBN: {book.isbn}</p>}
      </div>
    </Link>
  );
}

BookCard.propTypes = {
  book: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string,
    type: PropTypes.string,
    isbn: PropTypes.string,
    coverImage: PropTypes.string,
  }).isRequired,
};

export default BookCard;
