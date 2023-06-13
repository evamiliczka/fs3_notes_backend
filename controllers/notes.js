const notesRouter = require('express').Router();
const Note = require('../models/note');
const logger = require('../utils/logger')

    
/* Handle HTTP GET to /api/notes */
notesRouter.get('/', async (request, response) => {
    const notes = await Note.find({});
    response.json(notes);
    }
);

// Handle HTTP GET to /api/notes/SOMETHING
// SOMETHING is an arbitrary string
/// http://localhost/api/notes/1  ====> request.params = {id: '1'}
notesRouter.get('/:id', async (request, response) => {
    
    const note = await Note.findById(request.params.id);
    if (note) response.json(note);
    else {
        logger.error('Note not found error');
        response.status(404).end();
    }

    /* Note.findById(request.params.id)
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
    }); */
});

// eslint-disable-next-line consistent-return
notesRouter.post('/', async (request, response) => {
    // request je vstupom, tu programujem odpoved servera na REQUEST
    const { body } = request; // a JSON string

    const note = new Note({
        content: body.content,
        important: body.important || false,
      })
    
 
    const savedNote = await note.save();
    response.status(201).json(savedNote);
  
    
});

notesRouter.delete('/:id', async (request, response) => {
        await Note.findByIdAndRemove(request.params.id);
        response.status(204).end();


  /*  Note.findByIdAndRemove(request.params.id)
    .then((result) => {
        response.status(204).end();
    })
    .catch((error) => next(error)); */
});

notesRouter.put('/:id', async (request, response) => {
    logger.info('Request.body is ', request.body);
    const { content, important } = request.body;
    logger.info('By setting   const {content, important } = request.body; we get:');
    logger.info('content is ', content);
    logger.info('important is ', important);


    const updatedNote = await Note.findByIdAndUpdate(
        request.params.id,
        { content, important },
        { new: true, runValidators: true, context: 'query'}
    );
    response.status(204).json(updatedNote)
  

/*    Note.findByIdAndUpdate(
        request.params.id,
        { content, important },
        { new: true, runValidators: true, context: 'query' },
    )
    .then((updatedNote) => {
        response.json(updatedNote);
    })
    .catch((error) => next(error)); */
});

module.exports = notesRouter;