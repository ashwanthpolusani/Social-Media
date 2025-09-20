import { useEffect, useState } from "react";

function PostList() {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [editingPostId, setEditingPostId] = useState(null);
  const [editDesc, setEditDesc] = useState("");
  const [editingComment, setEditingComment] = useState({ postId: null, commentId: null, text: "" });
  const DUMMY_USER_ID = "665b8c2e2e2e2e2e2e2e2e2e"; // <-- update this to match a real user

  // Fetch posts and their comments
  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        data.forEach(post => fetchComments(post._id));
      });
  }, []);

  // Helper to fetch comments for a post
  const fetchComments = (postId) => {
    fetch(`/api/posts/${postId}/comments`)
      .then(res => res.json())
      .then(commentsArr => {
        setComments(prev => ({ ...prev, [postId]: commentsArr }));
      });
  };

  const handleLike = async (id) => {
    await fetch(`/api/posts/${id}/like`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: DUMMY_USER_ID }),
    });
    setPosts(posts.map(p => p._id === id ? { ...p, likes: (p.likes || 0) + 1 } : p));
  };

  const handleUnlike = async (id) => {
    await fetch(`/api/posts/${id}/unlike`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: DUMMY_USER_ID }),
    });
    setPosts(posts.map(p => p._id === id ? { ...p, likes: (p.likes || 1) - 1 } : p));
  };

  const handleEdit = (post) => {
    setEditingPostId(post._id);
    setEditDesc(post.description);
  };

  const handleUpdate = async (id) => {
    await fetch(`/api/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: editDesc }),
    });
    setPosts(posts.map(p => p._id === id ? { ...p, description: editDesc } : p));
    setEditingPostId(null);
  };

  const handleDelete = async (id) => {
    await fetch(`/api/posts/${id}`, { method: "DELETE" });
    setPosts(posts.filter(p => p._id !== id));
    setComments(prev => {
      const newComments = { ...prev };
      delete newComments[id];
      return newComments;
    });
  };

  const handleDeleteComment = async (postId, commentId) => {
    await fetch(`/api/posts/${postId}/comments/${commentId}`, { method: "DELETE" });
    fetchComments(postId);
    setEditingComment({ postId: null, commentId: null, text: "" });
  };

  const handleEditComment = (postId, comment) => {
    setEditingComment({ postId, commentId: comment._id, text: comment.text });
  };

  const handleUpdateComment = async () => {
    await fetch(`/api/posts/${editingComment.postId}/comments/${editingComment.commentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: editingComment.text }),
    });
    fetchComments(editingComment.postId);
    setEditingComment({ postId: null, commentId: null, text: "" });
  };

  const handleAddComment = async (e, postId) => {
    e.preventDefault();
    const text = e.target.comment.value;
    await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, userId: DUMMY_USER_ID }),
    });
    fetchComments(postId);
    e.target.reset();
  };

  return (
    <div>
      <h1>All Posts</h1>
      {posts.map((p) => (
        <div key={p._id} className="postCard">
          {p.image
            ? <img src={`http://localhost:5000/uploads/${p.image}`} alt="post" width="200" />
            : <img src="https://via.placeholder.com/200x150?text=No+Image" alt="No image" width="200" />}
          {editingPostId === p._id ? (
            <>
              <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} />
              <button onClick={() => handleUpdate(p._id)}>Save</button>
              <button onClick={() => setEditingPostId(null)}>Cancel</button>
            </>
          ) : (
            <>
              <p>{p.description}</p>
              <button onClick={() => handleLike(p._id)}>👍 {p.likes || 0}</button>
              <button onClick={() => handleUnlike(p._id)}>👎</button>
              <button onClick={() => handleEdit(p)}>✏️ Edit</button>
              <button onClick={() => handleDelete(p._id)}>🗑️ Delete</button>
            </>
          )}

          {/* Comments Section */}
          <div className="comments">
            <h4>Comments</h4>
            {comments[p._id]?.length === 0 && <div style={{ color: "#888" }}>No comments yet.</div>}
            {comments[p._id]?.map((c, i) =>
              editingComment.postId === p._id && editingComment.commentId === c._id ? (
                <div key={c._id || i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    value={editingComment.text}
                    onChange={e => setEditingComment({ ...editingComment, text: e.target.value })}
                  />
                  <button onClick={handleUpdateComment}>Save</button>
                  <button onClick={() => setEditingComment({ postId: null, commentId: null, text: "" })}>Cancel</button>
                </div>
              ) : (
                <div key={c._id || i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span>
                    💬 {c.text}
                    {c.user?.username && <b> ({c.user.username})</b>}
                  </span>
                  <button onClick={() => handleEditComment(p._id, c)}>✏️</button>
                  <button onClick={() => handleDeleteComment(p._id, c._id)}>❌</button>
                </div>
              )
            )}
            <form onSubmit={e => handleAddComment(e, p._id)}>
              <input name="comment" placeholder="Add a comment" autoComplete="off" />
              <button type="submit">Send</button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PostList;

