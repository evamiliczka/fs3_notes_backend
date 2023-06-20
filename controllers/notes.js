/* eslint-disable no-underscore-dangle */
const notesRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const Note = require('../models/note');
const User = require('../models/user');
const { error } = require('../utils/logger')

    
const getTokenFrom = request => {
    const authorization = request.get('authorization');
    if (authorization && authorization.startsWith('bearer ')){
        return authorization.replace('bearer ','');
    }
    return null;
}


/* Handle HTTP GET to /api/notes */
notesRouter.get('/', async (request, response) => {
    const notes = await Note.find({}).populate('userId', { username: 1, name: 1});
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
        error('Note not found error');
        response.status(404).end();
    }
});

// eslint-disable-next-line consistent-return
notesRouter.post('/', async (request, response) => {
    // request je vstupom, tu programujem odpoved servera na REQUEST
    const { body } = request; // a JSON string
    // console.log('Going to post a note',body, typeof body);

    // jwt.verify checks the token, decodes it and returns the object
    // the token is based on
    // exception: JsonWebTokenError
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
    if (!decodedToken.id){
        return response.status(401).json({ error: 'invalid token' });
    }

    const user = await User.findById(decodedToken.id);

    // const user = await User.findById(body.userId);
    // info('Created by user ', user, typeof user);

    const note = new Note({
        content: body.content,
        important: body.important || false,
        userId: user.id
      })
    
    // info('Going to post this note, aready a model ', note, typeof note);
 
     const savedNote = await note.save();
    // info('This note is saved to DB ', savedNote, typeof savedNote);
    user.notes = user.notes.concat(savedNote._id);
    // info('The user has saved notes ', user.notes, typeof user.notes);
    await user.save();


 
    response.status(201).json(savedNote); // json data is sent to client
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