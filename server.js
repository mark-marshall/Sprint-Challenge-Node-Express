const express = require('express');
const server = express();

const projectRoutes = require('./routes/projects');
const actionRoutes = require('./routes/actions');

server.use(cors());
server.use(projectRoutes);
server.use(actionRoutes);

module.exports = server;
