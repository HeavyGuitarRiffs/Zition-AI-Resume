import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../logo.svg';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="font-sans flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 text-center">
      {/* Header Section */}
      <header className="mb-8">
        <img src={logo} className="App-logo rotate-logo" alt="Zition Logo" />
        <h1 className="text-4xl font-extrabold text-gray-800">Zition - AI Resume Enhancer</h1>
        <p className="text-lg text-gray-600 mt-2">
          Upload your resume and let AI enhance it for you.
        </p>
      </header>

      {/* Call-to-Action */}
      <button 
        onClick={() => navigate('/upload')} 
        className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300">
        Get Started
      </button>

      {/* Footer */}
      <footer className="mt-12 text-gray-500">
        <p>&copy; {new Date().getFullYear()} Zition. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
