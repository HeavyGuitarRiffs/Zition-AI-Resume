import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"; // Import Navigate for redirection
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import Navbar from "./components/Navbar";
import About from "./pages/About";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost"; // ✅ Added BlogPost
import PricingPage from "./pages/PricingPage";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
// import Login from "./pages/Login"; // Removed for now
import UploadPage from "./pages/UploadPage";
import "./App.css";
import ResumeView from "./pages/ResumeView"; // Create this component

const App = () => {
  // Set isAuthenticated to true for now to bypass login
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Temporarily bypass login check

  useEffect(() => {
    document.title = "Zition";
  }, []);

  const handleLogout = () => {
    // If logout logic is still needed, keep it
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="App font-sans">
        {/* ✅ Navbar always visible */}
        <Navbar />

        <Routes>
          {/* ✅ Redirect to Home if authenticated */}
          <Route
            path="/"
            element={isAuthenticated ? <Home /> : <Navigate to="/login" />} // Redirect to /login if not authenticated
          />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/resume/:id" element={<ResumeView />} />
          {/* Removed login route for now */}
          {/* <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} /> */}
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} /> {/* ✅ BlogPost Route */}
          <Route path="/contact" element={<Contact />} />
        </Routes>

        {/* ✅ Show Logout Button Only If Logged In */}
        {isAuthenticated && (
          <button onClick={handleLogout} style={{ margin: "20px" }}>Logout</button>
        )}

        {/* Footer with Social Icons */}
        <footer className="App-footer text-center mt-12">
          <h2 className="text-2xl font-semibold mb-4">Follow Us</h2>
          <ul className="flex justify-center space-x-6">
            <li>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebook className="text-blue-600 hover:text-blue-800 transition duration-300" />
              </a>
            </li>
            <li>
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter className="text-blue-400 hover:text-blue-600 transition duration-300" />
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="text-pink-600 hover:text-pink-800 transition duration-300" />
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                <FaLinkedin className="text-blue-700 hover:text-blue-900 transition duration-300" />
              </a>
            </li>
          </ul>
        </footer>
      </div>
    </Router>
  );
};

export default App;
