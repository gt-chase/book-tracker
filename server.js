const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Routes
app.get('/api/books', async (req, res) => {
  const result = await pool.query('SELECT * FROM books');
  res.json(result.rows);
});

app.post('/api/books', async (req, res) => {
  const { title, author, notes} = req.body;
  const result = await pool.query(
    'INSERT INTO books (title, author, notes) VALUES ($1, $2, $3) RETURNING *',
    [title, author, notes]
  );
  res.json(result.rows[0]);
});

app.put('/api/books/:id', async (req, res) => {
  const { id } = req.params;
  const { title, author, notes } = req.body;
  const result = await pool.query(
    'UPDATE books SET title = $1, author = $2, notes = $3, WHERE id = $4 RETURNING *',
    [title, author, notes, id]
  );
  res.json(result.rows[0]);
});

app.delete('/api/books/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM books WHERE id = $1', [id]);
  res.json({ message: 'Book deleted' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
