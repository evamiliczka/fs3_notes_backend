const mongoose = require('mongoose');
const cors = require('cors');
const express = require('express');
const config = require('./utils/config');

const app = express();
const notesRouter = require('./controllers/notes');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');


mongoose.set('strictQuery', false);

logger.info('Connecting to ', config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI)
  .then(() => {  // replaced result by ()
    logger.info('Connected to MongoDB');
  })
  .catch((error) => {
    logger.error('Error connecting to MongoDB: ', error.message);
});

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(middleware.requestLogger);

app.use('/api/notes', notesRouter);

app.use(middleware.unknownEndpoint); // no routes or middleware are called after this, with the exception of errorHandler
app.use(middleware.errorHandler);

module.exports = app;
