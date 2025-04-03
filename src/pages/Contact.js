import React from 'react';
import { FaGlobe, FaWhatsapp, FaSkype, FaDiscord, FaTelegram, FaEnvelope } from 'react-icons/fa'; // Import Gmail icon

function Contact() {
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Contact</h1>
      <table style={{ margin: "20px auto", borderCollapse: "collapse", width: "60%" }}>
        <tbody>
          {/* Website Row */}
          <tr style={{ borderBottom: "1px solid #ddd" }}>
            <td style={{ padding: "10px" }}>
              <strong>Website:</strong>
            </td>
            <td style={{ padding: "10px" }}>
              <a 
                href="https://thorough-radiance-production.up.railway.app/index.html" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ textDecoration: "none", color: "blue", fontSize: "18px" }}
              >
                <FaGlobe size={20} /> Visit My Website
              </a>
            </td>
          </tr>

          {/* WhatsApp Row */}
          <tr style={{ borderBottom: "1px solid #ddd" }}>
            <td style={{ padding: "10px" }}>
              <strong>WhatsApp:</strong>
            </td>
            <td style={{ padding: "10px" }}>
              <a 
                href="https://wa.me/19073598970" 
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none", color: "green", fontSize: "18px" }}
              >
                <FaWhatsapp size={20} /> Chat on WhatsApp
              </a>
            </td>
          </tr>

          {/* Skype Row */}
          <tr style={{ borderBottom: "1px solid #ddd" }}>
            <td style={{ padding: "10px" }}>
              <strong>Skype:</strong>
            </td>
            <td style={{ padding: "10px" }}>
              <a 
                href="https://join.skype.com/invite/Pftcdm7v1utD" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ textDecoration: "none", color: "#00aff0", fontSize: "18px" }}
              >
                <FaSkype size={20} /> Chat on Skype
              </a>
            </td>
          </tr>

          {/* Discord Row */}
          <tr style={{ borderBottom: "1px solid #ddd" }}>
            <td style={{ padding: "10px" }}>
              <strong>Discord:</strong>
            </td>
            <td style={{ padding: "10px" }}>
              <a 
                href="https://discord.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ textDecoration: "none", color: "#5865F2", fontSize: "18px" }}
              >
                <FaDiscord size={20} /> Join on Discord
              </a>
            </td>
          </tr>

          {/* Telegram Row */}
          <tr style={{ borderBottom: "1px solid #ddd" }}>
            <td style={{ padding: "10px" }}>
              <strong>Telegram:</strong>
            </td>
            <td style={{ padding: "10px" }}>
              <a 
                href="https://t.me/Svaalsbard" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ textDecoration: "none", color: "#0088cc", fontSize: "18px" }}
              >
                <FaTelegram size={20} /> Contact on Telegram
              </a>
            </td>
          </tr>

          {/* Email Row */}
          <tr>
            <td style={{ padding: "10px" }}>
              <strong>Email:</strong>
            </td>
            <td style={{ padding: "10px" }}>
              <a 
                href="mailto:justmcfarlane@gmail.com" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ textDecoration: "none", color: "#D44638", fontSize: "18px" }}
              >
                <FaEnvelope size={20} /> Send an Email
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Contact;
