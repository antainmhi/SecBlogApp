const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db.sqlite');


// Create the posts table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    user_id INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log("Posts table created successfully");
    }
  });


// Create a new post
router.post('/', async (req, res) => {
  try {
    const post = await Post.create({
      user_id: req.body.user_id,
      title: req.body.title,
      content: req.body.content
    });
    res.status(201).json(post);
  } catch {
    res.status(500).send();
  }
});

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.findAll();
    res.json(posts);
  } catch {
    res.status(500).send();
  }
});

// Get a post by id
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post == null) {
      return res.status(404).send();
    }
    res.json(post);
  } catch {
    res.status(500).send();
  }
});

// Update a post
router.put('/:id', async (req, res) => {
  try {
    const post = await Post.update(req.params.id, {
      title: req.body.title,
      content: req.body.content
    });
    res.json(post);
  } catch {
    res.status(500).send();
  }
});

// Delete a post
router.delete('/:id', async (req, res) => {
  try {
    await Post.delete(req.params.id);
    res.status(204).send();
  } catch {
    res.status(500).send();
  }
});



module.exports = router;