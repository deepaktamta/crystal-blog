const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Post = require('./models/Post');
require('dotenv').config();

const app = express();

// 🔐 Middleware
// Standard CORS setup to allow your Vercel frontend to communicate with this API
app.use(cors()); 
app.use(express.json());

// 🗄️ MongoDB Connection
// Uses an environment variable for security, falling back to your local DB for testing
const mongoURI = process.env.MONGO_URI || "mongodb+srv://admin:admin123@cluster0.yecfjq4.mongodb.net/blogDB";

mongoose.connect(mongoURI)
  .then(() => console.log("✅ Crystal Blog Database Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// 📝 API Routes

// 1. Create a New Post (Includes Category support)
app.post('/post', async (req, res) => {
  try {
    const { title, summary, content, cover, category } = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover,
      category,
    });
    res.status(201).json(postDoc);
  } catch (err) {
    res.status(400).json({ error: "Failed to create post", details: err.message });
  }
});

// 2. Get All Posts (Sorted by newest first)
app.get('/post', async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(20); // Safety limit for performance
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// 3. Delete a Post by ID
app.delete('/post/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json({ message: "Post deleted successfully", id });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete post" });
  }
});

// 🌐 Server Activation
// process.env.PORT is mandatory for Render/Heroku deployment
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server is flying on http://localhost:${PORT}`);
});