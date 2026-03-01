const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// Define the structure for your blog posts
const PostSchema = new Schema({
  title: { 
    type: String, 
    required: true 
  },
  summary: { 
    type: String, 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  cover: { 
    type: String, 
    required: true 
  },
  // ✨ New Feature: Category support
  // This allows you to filter by Development, Design, etc.
  category: { 
    type: String, 
    default: 'Development',
    required: true 
  },
}, {
  // Automatically adds 'createdAt' and 'updatedAt' fields
  // This is used for the "Published on" date in your UI
  timestamps: true, 
});

// Create the Model
const PostModel = model('Post', PostSchema);

module.exports = PostModel;