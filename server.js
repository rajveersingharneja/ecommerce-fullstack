const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'Udayveer001',
  database: 'shopping',
});

db.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    return;
  }
  console.log('✅ MySQL connected');
});

// === REGISTER ROUTE ===
app.post('/register', (req, res) => {
  const { name, phone, email, password } = req.body;

  if (!name || !phone || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const checkUserQuery = 'SELECT * FROM register WHERE phone = ? OR email = ?';
  db.query(checkUserQuery, [phone, email], (err, results) => {
    if (err) {
      console.error('❌ DB error:', err.message);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: "User with this phone or email already exists" });
    }

    const insertUserQuery = 'INSERT INTO register (name, phone, email, password) VALUES (?, ?, ?, ?)';
    db.query(insertUserQuery, [name, phone, email, password], (err, results) => {
      if (err) {
        console.error('❌ Insert error:', err.message);
        return res.status(500).json({ error: "Could not register user" });
      }

      res.status(200).json({ message: "Registration successful!" });
    });
  });
});

// === LOGIN ROUTE ===
app.post('/login', (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ error: "Phone and password are required" });
  }

  const loginQuery = 'SELECT * FROM register WHERE phone = ? AND password = ?';
  db.query(loginQuery, [phone, password], (err, results) => {
    if (err) {
      console.error('❌ Login error:', err.message);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid phone or password" });
    }

    res.status(200).json({ message: "Login successful", user: results[0] });
  });
});

app.post('/payment', (req, res) => {
  const { cart, totalAmount } = req.body;

  if (!cart || cart.length === 0 || !totalAmount) {
    return res.status(400).json({ error: 'Invalid order data' });
  }

  console.log('✅ Order received:', cart, 'Total:', totalAmount);

  // Simulate success response
  setTimeout(() => {
    res.status(200).json({ message: 'Payment processed successfully' });
  }, 1000);
});


// === START SERVER ===
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
