import { useEffect, useState } from "react";

function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then(setPosts);
  }, []);

  const DUMMY_USER_ID = "123465678"; // replace with real user id

  const handleLike = async (id) => {
    await fetch(`/api/posts/${id}/like`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: DUMMY_USER_ID }),
    });
    setPosts(posts.map(p => p._id === id ? { ...p, likes: (p.likes || 0) + 1 } : p));
  };

  const handleDelete = async (id) => {
    await fetch(`/api/posts/${id}`, { method: "DELETE" });
    setPosts(posts.filter(p => p._id !== id));
  };

  return (
    <div>
      <h1>All Posts</h1>
      {posts.map((p) => (
        <div key={p._id} className="postCard">
          {p.image
            ? <img src={`http://localhost:5000/uploads/${p.image}`} alt="post" width="200" />
            : <img src="https://via.placeholder.com/200x150?text=No+Image" alt="No image" width="200" />}
          <p>{p.description}</p>
          <button onClick={() => handleLike(p._id)}>👍 {p.likes || 0}</button>
          <button onClick={() => handleDelete(p._id)}>🗑️ Delete</button>

          {/* Comments Section */}
          <div className="comments">
            <h4>Comments</h4>
            {p.comments?.map((c, i) => <p key={i}>💬 {c.text}</p>)}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const text = e.target.comment.value;
                await fetch(`/api/posts/${p._id}/comments`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ text, userId: DUMMY_USER_ID }),
                });
                setPosts(posts.map(post =>
                  post._id === p._id
                    ? { ...post, comments: [...(post.comments || []), { text }] }
                    : post
                ));
                e.target.reset();
              }}
            >
              <input name="comment" placeholder="Add a comment" />
              <button type="submit">Send</button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PostList;
