import { useState, useEffect } from "react";
import "./Comments.css";

const Comments = ({ breed }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetch(`http://localhost:3005/comments/${breed}`)
      .then((response) => response.json())
      .then((data) => setComments(data))
      .catch((error) => console.error("Error fetching comments:", error));
  }, [breed]);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (newComment.trim() === "") return;

    const comment = {
      id: Date.now(),
      username: "Guest",
      text: newComment,
      breed,
    };

    fetch(`http://localhost:3005/comments/${breed}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(comment),
    })
      .then((response) => response.json())
      .then((data) => {
        setComments([...comments, data]);
        setNewComment("");
      })
      .catch((error) => console.error("Error adding comment:", error));
  };

  const handleDeleteComment = (id) => {
    fetch(`http://localhost:3005/comments/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        const updatedComments = comments.filter((comment) => comment.id !== id);
        setComments(updatedComments);
      })
      .catch((error) => console.error("Error deleting comment:", error));
  };

  return (
    <div className="container">
      <h2 className="comments-title">Comments for {breed}</h2>
      <div className="commentsList">
        {comments.map((comment) => (
          <div key={comment.id} className="comment">
            <p>
              <strong>{comment.username}:</strong> {comment.text}
            </p>
            
          </div>
        ))}
        {comments.length === 0 && <p>No comments yet.</p>}
      </div>
      <form onSubmit={handleAddComment} className="form">
        <textarea
          className="textarea"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          required
        ></textarea>
        <button type="submit" className="addButton">
          Add Comment
        </button>
      </form>
    </div>
  );
};

export default Comments;
