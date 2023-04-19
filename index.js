const express = require('express');
const path = require('path');
const controllers = require('./controllers/handler');
require('dotenv').config();
const db = require("./services/db_service");

const app = express();
const port = process.env.PORT || 3000;
const secretKey = process.env.SECRET_KEY;

app.use(express.json()); // Parse JSON request bodies

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Define routes
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.get('/items', controllers.getItems);
app.post('/items', controllers.createItem);

// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  console.log(`Secret key is ${secretKey}`);
});
