const mongoose = require('mongoose');
const cors = require('cors');
const express = require('express');
const config = require('./utils/config');

require('express-async-errors');

const app = express();
const notesRouter = require('./controllers/notes');
const usersRouter = require('./controllers/users');

const {
  requestLogger,
  unknownEndpoint,
  errorHandler,
} = require('./utils/middleware');

const { info, error } = require('./utils/logger');

mongoose.set('strictQuery', false);

info('Connecting to ', config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    // replaced result by ()
    info('Connected to MongoDB');
  })
  .catch((err) => {
    error('Error connecting to MongoDB: ', err.message);
  });

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(requestLogger);

app.use('/api/notes', notesRouter);

app.use('/api/users', usersRouter)

app.use(unknownEndpoint); // no routes or middleware must be called after this!!!!!!!!!, with the exception of errorHandler
app.use(errorHandler);

module.exports = app;
