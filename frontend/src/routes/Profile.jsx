import { useState, useEffect } from "react";

function Profile({ currentUserId }) {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!currentUserId) return;
    fetch(`/api/users/${currentUserId}`)
      .then((res) => res.json())
      .then((data) => {
        setUsername(data.username || "");
        setBio(data.bio || "");
      });
  }, [currentUserId]);

  const handleUpdate = async () => {
    await fetch(`/api/users/${currentUserId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, bio }),
    });
    setEditing(false);
    alert("Profile updated!");
  };

  return (
    <div className="profile-container">
      <h1 className="profile-title">User Profile</h1>
      {editing ? (
        <div className="profile-edit">
          <input
            className="profile-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <textarea
            className="profile-textarea"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <button className="profile-save-btn" onClick={handleUpdate}>
            Save
          </button>
        </div>
      ) : (
        <div className="profile-view">
          <p className="profile-username">
            <strong>{username}</strong>
          </p>
          <p className="profile-bio">{bio}</p>
          <button
            className="profile-edit-btn"
            onClick={() => setEditing(true)}
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
}

export default Profile;
