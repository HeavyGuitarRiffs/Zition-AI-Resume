import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [step, setStep] = useState(1); // Step 1: Enter Email, Step 2: Enter Code
  const [loading, setLoading] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(true); // Add this state to control overlay visibility
  const navigate = useNavigate();

  // Validate email format
  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  // Send 6-digit code to email
  const handleSendCode = async () => {
    if (!isValidEmail(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/send-code", { email });
      setMessage(response.data.message);
      setStep(2); // Move to step 2 (enter code)
    } catch (error) {
      setMessage(error.response?.data?.error || "Error sending code");
    }
    setLoading(false);
  };

  // Verify 6-digit code
  const handleVerifyCode = async () => {
    if (code.length !== 6 || isNaN(code)) {
      setMessage("Please enter a valid 6-digit code.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/verify-code", { email, code });

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        setIsAuthenticated(true);
        setMessage("Login successful!");
        setOverlayVisible(false); // Hide the overlay after successful login
        navigate("/"); // Redirect to homepage
      }
    } catch (error) {
      setMessage(error.response?.data?.error || "Invalid or expired code");
    }
    setLoading(false);
  };

  return (
    <div>
      {/* Overlay */}
      {overlayVisible && (
        <div className="login-overlay">
          <div className="login-modal">
            <h2>Login</h2>

            {step === 1 ? (
              <div>
                <label>Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button onClick={handleSendCode} disabled={loading}>
                  {loading ? "Sending..." : "Send Login Code"}
                </button>
              </div>
            ) : (
              <div>
                <label>Enter 6-Digit Code:</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  maxLength={6}
                />
                <button onClick={handleVerifyCode} disabled={loading}>
                  {loading ? "Verifying..." : "Verify & Login"}
                </button>
              </div>
            )}

            <p>{message}</p>
          </div>
        </div>
      )}

      {/* Main content will be hidden if overlay is active */}
      {!overlayVisible && (
        <div>
          {/* Your homepage or other content here */}
          <h1>Welcome to the App!</h1>
        </div>
      )}
    </div>
  );
};

export default Login;
