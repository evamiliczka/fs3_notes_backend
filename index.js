/* the environment variables from the ".env" file are available globally,
 before the code from the other modules is imported. */
require('dotenv').config();
//console.log('Process env: ', process.env);

const express = require('express');
const cors = require ('cors');
const Note = require('./models/note');


/*express, which this time is a 
function that is used to create an express application stored in the app variable: */
const app = express();

app.use(express.json());
/* To make express show static content, the page index.html and the JavaScript, etc., 
it fetches, we need a built-in middleware from express called static.*/
app.use(express.static('build'));
app.use(cors());



  /* Next, we define two routes to the application. The first one defines an event 
  handler that is used to handle HTTP GET requests made to the application's /, i.e. root:*/
app.get('/', (request, response) => {
//  console.log(request);
    response.send('<h1>Hello world</h1>')
})

/* Handle HTTP GET to /api/notes */
app.get('/api/notes', (request, response) => {
    Note.find({})
      .then(notes => {
        response.json(notes)
      })
})

// Handle HTTP GET to /api/notes/SOMETHING
// SOMETHING is an arbitrary string
/// http://localhost/api/notes/1  ====> request.params = {id: '1'}
app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id)
    .then(note => {
      response.json(note);
    })
})


app.post('/api/notes', (request, response) => {
  //request je vstupom, tu programujem odpoved servera na REQUEST
  const body = request.body; //a JSON string

  //Ak novo pridana poznamka nema content, cize naco ju pridavat
  if (body.content === undefined) 
    return response.status(400).json({error: 'content missing'})
  //else
  
  const newNote = new Note({
    content : body.content,
    important : body.important || false,
  })
  
  newNote.save()
    .then(savedNote => {
      response.json(savedNote)
    }) 
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter(n => n.id !== id);
  response.status(204).end();
})

const PORT = process.env.PORT; // We are using dotenv and the port is defined in the .env file,... || 3001;   
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  }
);