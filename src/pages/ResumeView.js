import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ResumeView = () => {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/resume/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched resume:", data);
        if (!data || Object.keys(data).length === 0) {
          console.error("Empty resume response");
        }
        setResume(data);
      })
      .catch((err) => console.error("Error fetching resume:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!resume || Object.keys(resume).length === 0) return <p>No Resume Found.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{resume.filename || "Untitled Resume"}</h1>
      <p><strong>Outcome:</strong> {resume.outcome || "Not available"}</p>
      <h2>Skills</h2>
      <ul>
        {resume.skills?.length > 0 ? (
          resume.skills.map((skill, index) => <li key={index}>{skill}</li>)
        ) : (
          <li>No skills listed</li>
        )}
      </ul>
      <h2>Full Resume Content</h2>
      <pre>{resume.content ? resume.content : "No content available"}</pre>
    </div>
  );
};

export default ResumeView;
