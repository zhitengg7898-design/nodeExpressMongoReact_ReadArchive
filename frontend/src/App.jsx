import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import BookDetail from "./pages/BookDetail";
import Favorites from "./pages/Favorites";
import Collections from "./pages/Collections";
import SubmitEntry from "./pages/SubmitEntry";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-shell">
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>

        <Navbar />

        <main className="app-main" id="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/books/:id" element={<BookDetail />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/submit" element={<SubmitEntry />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>
            ReadArchive :- a community reading archive. Browse and open
            resources freely, or create an account to post entries, save
            favorites and build collections.
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
