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
});

notesRouter.put('/:id', async (request, response) => {
    const { content, important } = request.body;
  
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