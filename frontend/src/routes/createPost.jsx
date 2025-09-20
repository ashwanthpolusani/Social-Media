import { useState } from "react";

function CreatePost() {
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("description", description);
    if (file) formData.append("image", file);
    formData.append("user", "665b8c2e2e2e2e2e2e2e2e2e"); // replace with real user id

    await fetch("/api/posts", {
      method: "POST",
      body: formData,
    });

    alert("Post created!");
    setDescription("");
    setFile(null);
    setPreview(null);
  };

  return (
    <div className="createPost">
      <h1>Create Post</h1>
      <form className="createPostForm" onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {preview && <img src={preview} alt="Preview" width="200" />}

        <textarea
          placeholder="Write a description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <button type="submit">Post</button>
      </form>
    </div>
  );
}

export default CreatePost;
