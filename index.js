const express = require('express');
const path = require('path');
//const { dbConnection } = require('./database/config');
require('dotenv').config();

// DB Config
require('./database/config').dbConnection();

// Express app
const app = express();

// Read and parsing of incoming request payload
app.use(express.json());


// Node server
const server = require('http').createServer(app);
module.exports.io = require('socket.io')(server);
require('./sockets/socket');


// Public path
const publicPath = path.resolve(__dirname, 'public');


// My routes
app.use('/api/login', require('./routes/auth'));

app.use(express.static(publicPath));

server.listen(process.env.PORT, (err) => {
  if (err) throw new Error(err);

  console.log('Server running on port', process.env.PORT);
});
