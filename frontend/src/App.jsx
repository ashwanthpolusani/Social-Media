import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CreatePost from "./routes/CreatePost";
import PostList from "./routes/PostList";
import Profile from "./routes/Profile";
import UserList from "./routes/UserList";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="navbar">
        <Link to="/">Posts</Link>
        <Link to="/create">Create Post</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/users">Users</Link>
      </div>

      <Routes>
        <Route path="/" element={<PostList />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/users" element={<UserList />} />
      </Routes>
    </Router>
  );
}

export default App;
