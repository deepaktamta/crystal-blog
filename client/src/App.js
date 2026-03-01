import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill-new'; 
import 'react-quill-new/dist/quill.snow.css';
import { Search, PlusCircle, Layout, Trash2, Clock, User, BookOpen } from 'lucide-react';
import './App.css';

const API_URL = "https://crystal-blog.onrender.com/post";

function App() {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [cover, setCover] = useState('');
  const [category, setCategory] = useState('Development');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    fetchPosts();
    setIsClient(true);
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(API_URL);
      setPosts(res.data);
    } catch (err) { console.error("Fetch error:", err); }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, { title, summary, content, cover, category });
      setTitle(''); setSummary(''); setContent(''); setCover('');
      setShowEditor(false);
      fetchPosts(); 
    } catch (err) { console.error("Publish error:", err); }
  };

  const deletePost = async (id) => {
    if (window.confirm("Delete this story permanently?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchPosts();
      } catch (err) { console.error("Delete error:", err); }
    }
  };

  const getReadingTime = (text) => {
    const words = text ? text.split(/\s/g).length : 0;
    return Math.ceil(words / 200) || 1;
  };

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      {/* 📂 Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-box">C</div>
          <span>Crystal.</span>
        </div>
        <nav className="nav-menu">
          <button className="menu-link active"><Layout size={20}/> Dashboard</button>
          <button className="menu-link" onClick={() => setShowEditor(!showEditor)}>
            <PlusCircle size={20}/> {showEditor ? "Close Editor" : "Write Story"}
          </button>
          <button className="menu-link"><BookOpen size={20}/> Library</button>
          <button className="menu-link"><User size={20}/> Profile</button>
        </nav>
        <div className="sidebar-user">
          <div className="user-avatar">DT</div>
          <div className="user-info">
            <strong>Deepak Tamta</strong>
            <span>Admin</span>
          </div>
        </div>
      </aside>

      {/* 💻 Main Dashboard Area */}
      <main className="main-viewport">
        <header className="header-bar">
          <div className="search-box">
            <Search size={18} className="search-icon"/>
            <input 
              type="text" 
              placeholder="Search by title or category..." 
              onChange={e => setSearchQuery(e.target.value)} 
            />
          </div>
          <div className="header-meta">
            <span className="post-count">{posts.length} Stories</span>
          </div>
        </header>

        <div className="scroll-content">
          {showEditor && (
            <div className="editor-overlay">
              <form className="floating-editor" onSubmit={handlePublish}>
                <div className="editor-header">
                  <h2>Create New Story</h2>
                  <select value={category} onChange={e => setCategory(e.target.value)}>
                    <option value="Development">Development</option>
                    <option value="College">College</option>
                    <option value="Design">Design</option>
                  </select>
                </div>
                <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
                <input type="text" placeholder="Summary" value={summary} onChange={e => setSummary(e.target.value)} required />
                <input type="text" placeholder="Cover Image URL" value={cover} onChange={e => setCover(e.target.value)} required />
                {isClient && <ReactQuill theme="snow" value={content} onChange={setContent} />}
                <button type="submit" className="publish-btn">Publish to Feed</button>
              </form>
            </div>
          )}

          <div className="bento-grid">
            {filteredPosts.map(post => (
              <article className="post-card" key={post._id}>
                <div className="card-image">
                  <span className="card-tag">{post.category}</span>
                  <img src={post.cover} alt="" />
                </div>
                <div className="card-details">
                  <div className="meta-row">
                    <span className="read-time"><Clock size={14}/> {getReadingTime(post.content)} min read</span>
                    <button className="delete-btn" onClick={() => deletePost(post._id)}><Trash2 size={16}/></button>
                  </div>
                  <h3>{post.title}</h3>
                  <p>{post.summary}</p>
                  <div className="card-footer">
                    <small>{new Date(post.createdAt).toLocaleDateString()}</small>
                    <span className="author-name">Deepak Tamta</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;