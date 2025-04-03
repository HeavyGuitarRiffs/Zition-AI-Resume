import React, { useEffect, useState } from "react";
import { FaUpload, FaDownload, FaTrash, FaShareAlt } from "react-icons/fa"; // Import icons
import { Link } from "react-router-dom";

const UploadPage = () => {
  const [resumes, setResumes] = useState([]);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  // Fetch resumes from backend
  useEffect(() => {
    fetch("http://localhost:5000/resumes")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched resumes:", data); // Debugging
        setResumes(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error fetching resumes:", err);
        setResumes([]);
      });
  }, []);
  
  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setMessage(`Selected: ${selectedFile.name}`);
    } else {
      setMessage("Please upload a PDF resume.");
      setFile(null);
    }
  };

  // Handle file upload
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setMessage("Upload successful! AI is processing your resume.");
        fetch("http://localhost:5000/resumes")
          .then((res) => res.json())
          .then((data) => setResumes(Array.isArray(data) ? data : []));
      } else {
        setMessage("Upload failed. Please try again.");
      }
    } catch (error) {
      setMessage("Error uploading file.");
    }
  };

  // Handle resume download
  const handleDownload = async (resume) => {
    if (!resume || !resume._id) {
      console.error("Invalid resume data:", resume);
      return;
    }
  
    try {
      console.log("Downloading resume:", resume._id);
      
      const response = await fetch(`http://localhost:5000/resumes/${resume._id}/download`);
  
      if (!response.ok) {
        throw new Error("Failed to download file");
      }
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = resume.filename || "resume.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
    }
  };
  

  // Handle resume deletion
  const handleDelete = async (resumeId) => {
    console.log("Deleting resume with ID:", resumeId); // Debugging
  
    if (!resumeId) {
      console.error("Error: Resume ID is undefined.");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5000/resumes/${resumeId}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete resume");
      }
  
      setResumes((prevResumes) => prevResumes.filter((resume) => resume._id !== resumeId));
    } catch (error) {
      console.error("Error deleting resume:", error);
    }
  };
  
  // Handle sharing a resume
  const handleShare = (resume) => {
    const shareUrl = `${window.location.origin}/resume/${resume._id}`;
    if (navigator.share) {
      navigator.share({
        title: "Check out this resume!",
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("Resume link copied to clipboard!");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Upload Your Resume</h1>
      <form onSubmit={handleSubmit}>
        <label style={{ display: "block", marginBottom: "10px" }}>
          <input type="file" accept="application/pdf" onChange={handleFileChange} hidden />
          <button type="button" onClick={() => document.querySelector('input[type=file]').click()}>
            <FaUpload size={16} /> Select Resume
          </button>
        </label>
        <button type="submit">Upload</button>
      </form>
      <p>{message}</p>

      <h2>Saved Resumes</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
        {resumes.length === 0 ? (
          <p>No resumes uploaded yet.</p>
        ) : (
          resumes.map((resume) => (
            <div
              key={resume._id}
              style={{ border: "1px solid #ddd", padding: "10px", width: "300px", textAlign: "left" }}
            >
              <h3>{resume.filename}</h3>
              <p><strong>Key Metrics:</strong></p>
              <ul>
                {(resume.skills || []).length > 0 ? (
                  resume.skills.map((skill, index) => (
                    <li key={index}>
                      <img src={`/icons/${skill.toLowerCase()}.png`} alt={skill} style={{ width: "20px", marginRight: "5px" }} />
                      {skill}
                    </li>
                  ))
                ) : (
                  <li>No skills available</li>
                )}
              </ul>

              <p><strong>Outcome:</strong> {resume.outcome || "Not available"}</p>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                <button onClick={() => handleDownload(resume)}><FaDownload /> Download</button>
                <button onClick={() => handleDelete(resume._id)}><FaTrash /> Delete</button>
                <button onClick={() => handleShare(resume)}><FaShareAlt /> Share</button>
              </div>
              <Link to={`/resume/${resume._id}`} style={{ display: "block", textAlign: "center", marginTop: "10px", color: "blue" }}>
                View Full Resume
              </Link>

              {/* Corrected share button */}
              <div style={{ marginTop: "10px" }}>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.origin}/resume/${resume._id}`} target="_blank" rel="noopener noreferrer">
                  <FaShareAlt size={20} style={{ marginRight: "5px" }} />
                </a>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UploadPage;
