const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

// routes
const routes = require('./routes');
app.use('/api', routes);

// start the server
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
