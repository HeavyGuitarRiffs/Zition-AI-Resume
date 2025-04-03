import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem("blogPosts")) || [];

     // Ensure every post has a date
  const updatedPosts = savedPosts.map(post => ({
    ...post,
    date: post.date || new Date().toLocaleDateString()
  }));

  console.log("Loaded Posts:", updatedPosts); // Debugging log

    setPosts(savedPosts);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !content) {
      alert("Title and content are required.");
      return;
    }

    const date = new Date().toLocaleDateString();
    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        savePost(reader.result, date);
      };
      reader.readAsDataURL(imageFile);
    } else {
      savePost(thumbnailUrl, date);
    }
  };

  const savePost = (image, date) => {
    const newPost = { id: Date.now(), title, content, image, date };
    const updatedPosts = [newPost, ...posts];

    setPosts(updatedPosts);
    localStorage.setItem("blogPosts", JSON.stringify(updatedPosts));

    setTitle("");
    setContent("");
    setThumbnailUrl("");
    setImageFile(null);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create a Blog Post</h1>

      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border mb-2"
          required
        />

        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border mb-2"
          required
        ></textarea>

        <input
          type="text"
          placeholder="Thumbnail URL (optional)"
          value={thumbnailUrl}
          onChange={(e) => setThumbnailUrl(e.target.value)}
          className="w-full p-2 border mb-2"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="w-full p-2 border mb-2"
        />

        {imageFile && (
          <img
            src={URL.createObjectURL(imageFile)}
            alt="Preview"
            className="w-32 h-32 object-cover mb-2"
          />
        )}

        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          Save Post
        </button>
      </form>

      <h2 className="text-xl font-bold mb-2">Saved Posts</h2>
      {posts.length === 0 ? <p>No posts yet.</p> : null}

      {posts.map((post) => (
        <div key={post.id} className="border p-4 mb-4">
          {/* Clickable Thumbnail */}
          {post.image && (
            <Link to={`/blog/${post.id}`}>
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover mb-2 cursor-pointer"
              />
            </Link>
          )}

          {/* Clickable Title */}
          <Link to={`/blog/${post.id}`} className="text-xl font-semibold block">
            {post.title}
          </Link>

          {/* Display Date Under Title */}
          <p className="text-gray-500 text-sm">{post.date}</p>
        </div>
      ))}
    </div>
  );
};

export default Blog;
