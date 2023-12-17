// Import the required modules
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Import routes
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');

// Initialize an Express application
const app = express();
const port = 8000;

// Use body-parser middleware to parse JSON request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set EJS as the template engine
app.set('view engine', 'ejs');

// Define the route handler for GET requests to the root URL
app.get('/', (req, res) => {
    res.render('index');
  });

// Route for displaying the registration form
app.get('/register', (req, res) => {
    res.render('register');
  });

// Route for displaying the login form
app.get('/login', (req, res) => {
    res.render('login');
  });

  // Route for displaying the new post form
  app.get('/posts/:id', async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      res.render('post', { post });
    } catch (err) {
      console.error(err.message);
      res.status(500).send();
    }
  });

// Route for displaying the user's blog posts
app.get('/blog-posts', (req, res) => {
    // Fetch the blog posts from the database
    db.all('SELECT * FROM posts', [], (err, rows) => {
      if (err) {
        return console.error(err.message);
      }
  
      // Render the blog posts in a view
      res.render('blog-posts', { posts: rows });
    });
  });
  

// Use routes
app.use('/users', userRoutes);
app.use('/posts', postRoutes);

// Open a SQLite database, or create it if it doesn't exist
let db = new sqlite3.Database('./db.sqlite3', (err) => {
  if (err) {
    // If an error occurred, print it to the console
    console.error(err.message);
  }
});

// Create the users table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  username TEXT NOT NULL,
  password TEXT NOT NULL
)`, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Users table created successfully");
  }
});

// Route for handling login form submissions
app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    // Query the database for the user
    db.get('SELECT password FROM users WHERE username = ?', [username], (err, row) => {
      if (err) {
        return console.error(err.message);
      }
  
      // If the user exists and the password is correct
      if (row && bcrypt.compareSync(password, row.password)) {
        // Log the user in and redirect to their blog posts page
        res.redirect('/blog-posts');
        //res.redirect('/posts');
      } else {
        // If the login failed, redirect back to the login page with an error message
        res.redirect('/login?error=Invalid username or password');
      }
    });
  });
  
  // Route for handling registration form submissions
  app.post('/register', (req, res) => {
    const { new_username, new_password } = req.body;
  
    console.log(`Username: ${new_username}`);
    console.log(`Password: ${new_password}`);
    console.log(`Salt rounds: ${saltRounds}`);

    // Hash the password
    const hashedPassword = bcrypt.hashSync(new_password, saltRounds);
    
  
    // Insert the new user into the database
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [new_username, hashedPassword], (err) => {
      if (err) {
        // If user creation failed, redirect back to the registration page with an error message
        return res.redirect('/register?error=Failed to create user');
      }
  
      // If user creation is successful, redirect to the login page
      res.redirect('/login');
    });
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
