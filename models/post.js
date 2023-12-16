const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db.sqlite3');



db.serialize(() => {
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
});

// Create a new post
const create = (post) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)';
    db.run(sql, [post.user_id, post.title, post.content], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, ...post });
      }
    });
  });
};

// Find all posts
const findAll = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM posts';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// Find a post by id
const findById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM posts WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

// Update a post
const update = (id, post) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE posts SET title = ?, content = ? WHERE id = ?';
    db.run(sql, [post.title, post.content, id], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: id, ...post });
      }
    });
  });
};

// Delete a post
const deletePost = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM posts WHERE id = ?';
    db.run(sql, [id], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

module.exports = {
  create,
  findAll,
  findById,
  update,
  delete: deletePost
};