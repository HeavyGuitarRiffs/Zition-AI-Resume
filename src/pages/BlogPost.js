import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [editedImage, setEditedImage] = useState("");
  const [editedDate, setEditedDate] = useState("");

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem("blogPosts")) || [];
    const foundPost = savedPosts.find((p) => p.id === Number(id));
    if (foundPost) {
      setPost(foundPost);
      setEditedTitle(foundPost.title);
      setEditedContent(foundPost.content);
      setEditedImage(foundPost.image);
      setEditedDate(foundPost.date);
    }
  }, [id]);

  const handleDelete = () => {
    const savedPosts = JSON.parse(localStorage.getItem("blogPosts")) || [];
    const updatedPosts = savedPosts.filter((p) => p.id !== Number(id));
    localStorage.setItem("blogPosts", JSON.stringify(updatedPosts));
    navigate("/blog");
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    const savedPosts = JSON.parse(localStorage.getItem("blogPosts")) || [];
    const updatedPosts = savedPosts.map((p) =>
      p.id === Number(id)
        ? { ...p, title: editedTitle, content: editedContent, image: editedImage, date: editedDate }
        : p
    );
    localStorage.setItem("blogPosts", JSON.stringify(updatedPosts));
    setPost({ id: Number(id), title: editedTitle, content: editedContent, image: editedImage, date: editedDate });
    setIsEditing(false);
  };

  if (!post) {
    return <p className="text-center text-gray-600">Post not found.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      {isEditing ? (
        <div>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full p-2 border mb-2"
          />
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full p-2 border mb-2"
          ></textarea>
          <input
            type="text"
            value={editedImage}
            onChange={(e) => setEditedImage(e.target.value)}
            className="w-full p-2 border mb-2"
            placeholder="Image URL"
          />
          <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 mr-2">
            Save
          </button>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold">{post.title}</h1>
          <p className="text-gray-500 text-sm">{post.date}</p>

          {post.image && (
            <img src={post.image} alt={post.title} className="w-full h-auto object-cover my-4" />
          )}

          <p className="text-lg">{post.content}</p>

          <div className="mt-4">
            <button onClick={handleEdit} className="bg-yellow-500 text-white px-4 py-2 mr-2">
              Edit
            </button>
            <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2">
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BlogPost;
