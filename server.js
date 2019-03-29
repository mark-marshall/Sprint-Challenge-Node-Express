const express = require('express');
const cors = require('cors');
const server = express();

const projectRoutes = require('./routes/projects');
const actionRoutes = require('./routes/actions');

server.use(cors());
server.use(express.json());

server.use(projectRoutes);
server.use(actionRoutes);

module.exports = server;
