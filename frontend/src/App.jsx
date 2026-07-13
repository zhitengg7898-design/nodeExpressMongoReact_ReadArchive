import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<div>Welcome to Read Archive</div>} />
      </Routes>
    </Router>
  );
}

export default App;
