import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand">
        ReadArchive
      </Link>

      <nav className="navbar-links" aria-label="Main navigation">
        <NavLink to="/" end className="navbar-link">
          Home
        </NavLink>

        {user ? (
          <>
            <NavLink to="/favorites" className="navbar-link">
              Favorites
            </NavLink>
            <NavLink to="/submit" className="navbar-link">
              My Posts
            </NavLink>
            <NavLink to="/collections" className="navbar-link">
              Collections
            </NavLink>
            <span className="navbar-user">Hi, {user.username}</span>
            <button type="button" onClick={logout} className="navbar-logout">
              Log Out
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="navbar-link">
              Log In
            </NavLink>
            <Link to="/register" className="navbar-register">
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
