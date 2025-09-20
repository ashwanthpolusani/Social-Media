import { useEffect, useState } from "react";

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then(setUsers);
  }, []);

  const DUMMY_USER_ID = "665b8c2e2e2e2e2e2e2e2e2e"; // replace with real user id

  const handleFollow = async (id) => {
    await fetch(`/api/users/${id}/follow`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: DUMMY_USER_ID }),
    });
    alert("Followed!");
  };

  const handleUnfollow = async (id) => {
    await fetch(`/api/users/${id}/unfollow`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: DUMMY_USER_ID }),
    });
    alert("Unfollowed!");
  };

  return (
    <div>
      <h1>All Users</h1>
      {users.map((u) => (
        <div key={u._id} className="userCard">
          <p>{u.username}</p>
          <button onClick={() => handleFollow(u._id)}>Follow</button>
          <button onClick={() => handleUnfollow(u._id)}>Unfollow</button>
        </div>
      ))}
    </div>
  );
}

export default UserList;
