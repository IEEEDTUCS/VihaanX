// App — root component, sets up routing; currently single-page so everything lives on "/"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Add more routes here as the project grows (e.g. /register, /admin) */}
      </Routes>
    </Router>
  );
}
