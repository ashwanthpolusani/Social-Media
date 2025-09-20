import { useEffect, useState } from "react";

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/users")
      .then((res) => res.json())
      .then(setUsers);
  }, []);

  const handleFollow = async (id) => {
    await fetch(`http://localhost:5000/api/users/${id}/follow`, { method: "PUT" });
    alert("Followed!");
  };

  const handleUnfollow = async (id) => {
    await fetch(`http://localhost:5000/api/users/${id}/unfollow`, { method: "PUT" });
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
