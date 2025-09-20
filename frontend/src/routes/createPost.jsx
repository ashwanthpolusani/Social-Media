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

    // Send description + (later image via multer)
    const postData = { description };

    await fetch("http://localhost:5000/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
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
