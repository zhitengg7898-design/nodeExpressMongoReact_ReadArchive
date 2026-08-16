import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "./BookCard.css";

function colorFromTitle(title) {
  const colors = [
    "#3730a3",
    "#0b5c6e",
    "#8f1035",
    "#12662f",
    "#8a4008",
    "#5b21b6",
    "#0c5f59",
    "#701a75",
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
    <article className="book-card">
      <div className="book-card-cover">
        {showImage ? (
          <img
            src={book.coverImage}
            alt=""
            loading="lazy"
            onError={() => setImgFailed(true)}
            onLoad={handleLoad}
          />
        ) : (
          <div
            className="book-card-textcover"
            style={{ background: colorFromTitle(book.title) }}
            aria-hidden="true"
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

        <h2 className="book-card-title">
          <Link to={`/books/${book._id}`} className="book-card-link">
            {book.title}
          </Link>
        </h2>

        {book.author && <p className="book-card-author">{book.author}</p>}
      </div>
    </article>
  );
}

BookCard.propTypes = {
  book: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string,
    type: PropTypes.string,
    coverImage: PropTypes.string,
  }).isRequired,
};

export default BookCard;
