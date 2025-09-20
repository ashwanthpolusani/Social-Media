import { useEffect, useState } from "react";

function UserList({ currentUserId }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then(setUsers);
  }, []);

  const handleFollow = async (id) => {
    await fetch(`/api/users/${id}/follow`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: currentUserId }),
    });
    // Refresh users to update followers/following
    fetch("/api/users")
      .then((res) => res.json())
      .then(setUsers);
  };

  const handleUnfollow = async (id) => {
    await fetch(`/api/users/${id}/unfollow`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: currentUserId }),
    });
    fetch("/api/users")
      .then((res) => res.json())
      .then(setUsers);
  };

  return (
    <div>
      <h1>All Users</h1>
      {users.map((u) => {
        const isFollowing = u.followers?.includes(currentUserId);
        return (
          <div key={u._id} className="userCard">
            <p>
              <b>{u.username}</b>
              {u.bio && <span style={{ color: "#888", marginLeft: 8 }}>{u.bio}</span>}
            </p>
            <p>
              Followers: {u.followers?.length || 0} | Following: {u.following?.length || 0}
            </p>
            {u._id !== currentUserId && (
              isFollowing ? (
                <button onClick={() => handleUnfollow(u._id)}>Unfollow</button>
              ) : (
                <button onClick={() => handleFollow(u._id)}>Follow</button>
              )
            )}
          </div>
        );
      })}
    </div>
  );
}

export default UserList;
