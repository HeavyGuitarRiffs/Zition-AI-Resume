import React from 'react';

function About() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">About Us</h1>
      
      <p className="text-lg mb-4">
        Our mission is to empower young professionals and entrepreneurs by providing AI-powered SaaS tools that simplify career advancement. Whether you're looking to land your dream job or build a thriving business, we create cutting-edge solutions to help you stand out.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">The Power of a Short, Impactful Resume</h2>
      <p className="mb-4">
        A resume should be concise yet powerful—hiring managers spend **less than 10 seconds** scanning a resume before deciding whether to keep reading. Our AI-driven resume writer condenses key details, replacing text-heavy sections with **icons for skills, schools, and workplaces**, ensuring clarity while keeping the file size under **1MB**.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Best Practices for a Winning Resume</h2>
      <ul className="list-disc pl-6 mb-4">
        <li><strong>Tailor Every Resume:</strong> Customize for each job description, aligning with **keywords** in the listing.</li>
        <li><strong>Quantify Achievements:</strong> Use metrics like **"Increased sales by 40%"** instead of vague statements.</li>
        <li><strong>Keep It One Page:</strong> Unless you're senior-level, a **one-page resume** is ideal.</li>
        <li><strong>Use Clean Formatting:</strong> Clear sections, professional fonts, and minimal colors improve readability.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">What Recruiters & Hiring Managers Are Looking For</h2>
      <p className="mb-4">
        Recruiters focus on **skills, experience, and impact**. They look for:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li><strong>Skills that match the job description</strong> (use the right **keywords**).</li>
        <li><strong>Relevant experience & measurable achievements</strong>.</li>
        <li><strong>Clean, easy-to-read formatting</strong> (no clutter).</li>
        <li><strong>Problem-solving and leadership traits</strong> in bullet points.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">How Resume Screening Works</h2>
      <p className="mb-4">
        Most companies use **Applicant Tracking Systems (ATS)** to filter resumes before a recruiter sees them. These systems scan for:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li><strong>Keyword Matches:</strong> Resumes that mirror job descriptions rank higher.</li>
        <li><strong>Formatting:</strong> Simple layouts work better than complex designs.</li>
        <li><strong>Job Titles & Experience:</strong> Relevant roles get prioritized.</li>
      </ul>

      <p className="mt-6">
        Our AI Resume Writer ensures your resume passes **ATS filters**, aligns with recruiter expectations, and makes a powerful impact—helping you land more interviews and stand out in today's job market.
      </p>
    </div>
  );
}

export default About;
