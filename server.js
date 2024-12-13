// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config({ path: './.env' });
const cors = require('cors');
const morgan = require('morgan');

// Initialize the Express app
const app = express();

// Middleware
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(morgan('dev')); // Log HTTP requests

app.use(express.json()); // Parse JSON bodies

// Define a simple route
app.get('/', (req, res) => {
  res.send({ message: 'Welcome to the chat app server!' });
});

// Define the port
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
