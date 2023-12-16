// Import the sqlite3 module and enable verbose logging
const sqlite3 = require('sqlite3').verbose();

// Connect to the SQLite database
const db = new sqlite3.Database('./db.sqlite3');

// Define a function to create a new user
const create = (user) => {
    // Return a new promise
    return new Promise((resolve, reject) => {
      // Define the SQL query to create the users table if it doesn't exist
      const createTableSql = `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        username TEXT NOT NULL,
        password TEXT NOT NULL
      )`;
  
      // Run the SQL query to create the users table
      db.run(createTableSql, (err) => {
        if (err) {
          return reject(err);
        }
  
        // Define the SQL query to insert a new user
        const insertUserSql = 'INSERT INTO users (username, password) VALUES (?, ?)';
  
        // Run the SQL query to insert a new user
        db.run(insertUserSql, [user.username, user.password], function(err) {
          if (err) {
            return reject(err);
          }
  
          // If there's no error, resolve the promise with the new user's details
          resolve({ id: this.lastID, ...user });
        });
      });
    });
  };

  // Define a function to find a user by username
const findByUsername = (username) => {
    // Return a new promise
    return new Promise((resolve, reject) => {
      // Define the SQL query to create the users table if it doesn't exist
      const createTableSql = `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        username TEXT NOT NULL,
        password TEXT NOT NULL
      )`;
  
      // Run the SQL query to create the users table
      db.run(createTableSql, (err) => {
        if (err) {
          return reject(err);
        }
  
        // Define the SQL query to select a user by username
        const selectUserSql = 'SELECT * FROM users WHERE username = ?';
  
        // Run the SQL query to select a user by username
        db.get(selectUserSql, [username], (err, row) => {
          if (err) {
            return reject(err);
          }
  
          // If there's no error, resolve the promise with the user's details
          resolve(row);
        });
      });
    });
  };

module.exports = {
  create,
  findByUsername,
};
