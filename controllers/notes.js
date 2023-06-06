const notesRouter = require('express').Router();
const Note = require('../models/note');
const logger = require('../utils/logger')

    
/* Handle HTTP GET to /api/notes */
notesRouter.get('/', (request, response) => {
    Note.find({})
    .then((notes) => {
        response.json(notes);
    });
});

// Handle HTTP GET to /api/notes/SOMETHING
// SOMETHING is an arbitrary string
/// http://localhost/api/notes/1  ====> request.params = {id: '1'}
notesRouter.get('/:id', (request, response, next) => {
    Note.findById(request.params.id)
    .then((note) => {
        if (note) {
        response.json(note);
        } else {
        logger.error('Note not found error');
        response.status(404).end();
        }
    })
    .catch((error) => {
        logger.error('Caught error: ', error);
        next(error);
    });
});

// eslint-disable-next-line consistent-return
notesRouter.post('/', (request, response, next) => {
    // request je vstupom, tu programujem odpoved servera na REQUEST
    const { body } = request; // a JSON string

    const note = new Note({
        content: body.content,
        important: body.important || false,
      })
    
    note.save()
    .then(savedNote => {
        response.json(savedNote)
    })
    .catch(error => next(error))
});

notesRouter.delete('/:id', (request, response, next) => {
    Note.findByIdAndRemove(request.params.id)
    // eslint-disable-next-line no-unused-vars
    .then((result) => {
        response.status(204).end();
    })
    .catch((error) => next(error));
});

notesRouter.put('/:id', (request, response, next) => {
    logger.info('Request.body is ', request.body);
    const { content, important } = request.body;
    logger.info('By setting   const {content, important } = request.body; we get:');
    logger.info('content is ', content);
    logger.info('important is ', important);

    Note.findByIdAndUpdate(
        request.params.id,
        { content, important },
        { new: true, runValidators: true, context: 'query' },
    )
    .then((updatedNote) => {
        response.json(updatedNote);
    })
    .catch((error) => next(error));
});

module.exports = notesRouter;