const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const cors = require('cors');
const mysql = require('mysql2');
const fs = require('fs');

const dbConfig = require('./dbconfig.json');
const { port, host } = require('./config.json');

// const corsOptions = {
//   origin: "http://localhost:5173", // Replace with your client origin
//   credentials: true, // Allows cookies and other credentials
// };
// app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use('/public', express.static(path.join(__dirname, 'public')));

app.use( express.static(path.join(__dirname, 'public'))); //build
app.set('views', path.join(__dirname, 'templates'));

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
  if (err) {
    console.error('error', err);
    return;
  }
  console.log('Connected to MySQL database');
});

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.get('/cats', (req, res) => {
  const { color, size, character } = req.query;
  let query = 'SELECT DISTINCT * FROM cats';
  let params = [];

  if (color) {
    query = `SELECT * FROM cats WHERE FIND_IN_SET(?, color)`;
    params = [color];
  } else if (size) {
    query = `SELECT * FROM cats WHERE FIND_IN_SET(?, size)`;
    params = [size];
  } else if (character) {
    query = `SELECT * FROM cats WHERE FIND_IN_SET(?, personality)`;
    params = [character];
  }

  connection.query(query, params, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Server error');
      return;
    }

    res.json(results);
  });
});

app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Ei käytetä HTTPS:ää kehityksessä
  },
}));

function hashPassword(password) {
  return password.split('').reverse().join('');
}

app.use(express.static(__dirname));


app.get('/colors', (req, res) => {
  const query = 'SELECT DISTINCT color FROM cats';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('error', err);
      res.status(500).send('server error');
      return;
    }

    res.json(results);
  });
});

app.get('/size', (req, res) => {
  const query = 'SELECT DISTINCT size FROM cats';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Query error:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
  });
});

app.get('/character', (req, res) => {
  const query = 'SELECT DISTINCT personality FROM cats';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Query error:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
  });
});

app.get('/cats/:breed', (req, res) => {
  const { breed } = req.params;
  const query = 'SELECT * FROM cats WHERE breed = ?';

  connection.query(query, [breed], (err, results) => {
    if (err) {
      console.error('Query error:', err);
      res.status(500).send('Server error');
      return;
    }

    res.json(results);
  });
});

const commentsFilePath = path.join(__dirname, 'comments.json');

app.get('/comments/:breed', (req, res) => {
  const { breed } = req.params;
  fs.readFile(commentsFilePath, 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading comments:', err);
      return res.status(500).send('Error reading comments');
    }
    const comments = JSON.parse(data || '[]');
    const breedComments = comments.filter(comment => comment.breed === breed);
    res.json(breedComments);
  });
});

function generateId(length = 16) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }
  return result;
}
app.post('/comments/:breed', (req, res) => {
  // const { commentstext, user_id, cat_id } = req.body;
  // console.log(user_id)

  // if (!user_id || !cat_id) {
  //     return res.status(400).send('User ID and Cat ID are required');
  // }

  // const query = 'INSERT INTO comments (commentstext, user_id, cat_id) VALUES (?, ?, ?)';
  // const values = [commentstext, user_id, cat_id];

  // connection.query(query, values, (err, result) => {
  //     if (err) {
  //         console.error('Error adding to favorites:', err);
  //         return res.status(500).send('Error adding to favorites');
  //     }
  //     res.status(201).send('Favorite added');
  // });
  const { breed } = req.params;
  // console.log(req.session)
  const newComment = { ...req.body, breed, id: generateId()};

  fs.readFile(commentsFilePath, 'utf-8', (err, data) => {

    if (err) {
      console.error('Error reading comments:', err);
      return res.status(500).send('Error reading comments');
    }
    const comments = JSON.parse(data || '[]');
    // console.log(comments.map(userscom => "" + userscom.id))
    const com = "x" + newComment.id;
    // console.log(com)
    if ((comments.map(userscom => "x" + userscom.id)).includes(com)) {
      const temp = "x" + newComment.id + "100";
      newComment.id + temp;
    }
    // console.log(newComment)
    comments.push(newComment);

    fs.writeFile(commentsFilePath, JSON.stringify(comments, null, 2), (err) => {
      if (err) {
        console.error('Error saving comment:', err);
        return res.status(500).send('Error saving comment');
      }
      res.status(201).json(newComment);
    });
  });
});

// Users

app.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Username and password are required.');
  }

  connection.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      return res.status(500).send('Error checking username.');
    }

    if (results.length > 0) {
      return res.status(400).send('Username already exists.');
    }

    const hashedPassword = hashPassword(password);

    connection.query(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword],
      (err, result) => {
        if (err) {
          return res.status(500).send('Error registering user.');
        }
        res.status(201).send('Registration successful.');
      }
    );
  });
});
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send({ error: 'Username and password are required.' });
  }

  const hashedPassword = hashPassword(password);

  connection.query(
    'SELECT * FROM users WHERE username = ? AND password = ?',
    [username, hashedPassword],
    (err, results) => {
      if (err) {
        return res.status(500).send({ error: 'Error logging in.' });
      }

      if (results.length === 0) {
        return res.status(401).send({ error: 'Invalid username or password.' });
      }

      const user = results[0];
      req.session.user = { user_id: user.id, username: user.username };

      res.json({
        message: 'Login successful.',
        credentials: 'include',
        user: { user_id: user.id, username: user.username }
      });
    }
  );
});



app.post('/logout', (req, res) => {
  if (req.session.user) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send('Could not log out. Try again.');
      }
      res.send('Logout successful.');
    });
  } else {
    res.status(400).send('No user logged in.');
  }
});

app.get('/profile', (req, res) => {
  if (!req.session.user) {
    return res.status(401).send('Please log in to view this page.');
  }

  const username = req.session.user.username;
  connection.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      return res.status(500).send('Error fetching user profile.');
    }

    if (results.length === 0) {
      return res.status(404).send('User not found.');
    }

    const userProfile = results[0];
    res.json(userProfile);
  });
});

app.post('/favorites', (req, res) => {
  const { user_id, cat_id } = req.body;
  // console.log(user_id)

  if (!user_id || !cat_id) {
    return res.status(400).send('User ID and Cat ID are required');
  }

  const query = 'INSERT INTO favorites (user_id, cat_id, added_at) VALUES (?, ?, ?)';
  const values = [user_id, cat_id, new Date()];

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error('Error adding to favorites:', err);
      return res.status(500).send('Error adding to favorites');
    }
    res.status(201).send('Favorite added');
  });
});


app.get('/favorites', (req, res) => {
  const { user_id } = req.query;
  // console.log(user_id)
  if (!user_id) {
    return res.status(400).send('User ID is required');
  }

  const query = 'SELECT * FROM favorites WHERE user_id = ?';
  connection.query(query, [user_id], (err, results) => {
    if (err) {
      console.error('Error fetching favorites:', err);
      return res.status(500).send('Error fetching favorites');
    }
    res.json(results);
  });
});

app.get('/favorites/:user_id', (req, res) => {
  const { user_id } = req.params;

  if (!user_id) {
    return res.status(400).send('User ID is required');
  }

  const query = `
    SELECT cats.* 
    FROM favorites 
    JOIN cats ON favorites.cat_id = cats.id 
    WHERE favorites.user_id = ?
  `;

  connection.query(query, [user_id], (err, results) => {
    if (err) {
      console.error('Error fetching favorites:', err);
      return res.status(500).send('Error fetching favorites');
    }

    if (results.length === 0) {
      return res.status(404).send('No favorites found for this user');
    }

    res.json(results);
  });
});


app.delete('/favorites/:user_id/:cat_id', (req, res) => {
  const { user_id, cat_id } = req.params;

  if (!user_id || !cat_id) {
    return res.status(400).send('User ID and Cat ID are required');
  }

  const query = 'DELETE FROM favorites WHERE user_id = ? AND cat_id = ?';
  connection.query(query, [user_id, cat_id], (err, result) => {
    if (err) {
      console.error('Error removing from favorites:', err);
      return res.status(500).send('Error removing from favorites');
    }
    res.status(200).send('Favorite removed');
  });
});





app.listen(port, host, () => {
  console.log(`cats projekti toimii ${host}:${port}`);
});
