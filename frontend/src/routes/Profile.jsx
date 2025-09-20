import { useState } from "react";

function Profile() {
  const [username, setUsername] = useState("demo_user");
  const [bio, setBio] = useState("This is my profile.");
  const [editing, setEditing] = useState(false);

  const handleUpdate = () => {
    // send update to backend
    setEditing(false);
    alert("Profile updated!");
  };

  return (
    <div>
      <h1>User Profile</h1>
      {editing ? (
        <div>
          <input value={username} onChange={(e) => setUsername(e.target.value)} />
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
          <button onClick={handleUpdate}>Save</button>
        </div>
      ) : (
        <div>
          <p><strong>{username}</strong></p>
          <p>{bio}</p>
          <button onClick={() => setEditing(true)}>Edit Profile</button>
        </div>
      )}
    </div>
  );
}

export default Profile;
