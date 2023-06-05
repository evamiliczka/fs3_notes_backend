const express = require('express');
/*express, which this time is a 
function that is used to create an express application stored in the app variable: */
const app = express();
const cors = require ('cors');
/* the environment variables from the ".env" file are available globally,
 before the code from the other modules is imported. */
 require('dotenv').config();
 //console.log('Process env: ', process.env);

const Note = require('./models/note');

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

/*--------------error  ------------*/
const errorHandler = (error, request, response, next) => {
  console.error('Error handler: ', error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else 
    if (error.name === 'ValidationError'){
      return response.status(400).json({error: error.message})
    }
  next(error)
}


app.use(cors());
app.use(express.json());
app.use(requestLogger);
/* To make express show static content, the page index.html and the JavaScript, etc., 
it fetches, we need a built-in middleware from express called static.*/
app.use(express.static('build'));

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
app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note){
        response.json(note);
      } else {
        console.log('Note not found error');
        response.status(404).end();
      }
    })
    .catch(error => {
      console.log('Caught error: ', error);
      debugger;
      next(error)})
})



app.post('/api/notes', (request, response, next) => {
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
    .catch(error => next(error))
})

app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end();
    })
    .catch(error => next(error))  
})

app.put('/api/notes/:id', (request, response, next) => 
  {
    console.log('Request.body is ', request.body);
    const {content, important } = request.body;
    console.log('By setting   const {content, important } = request.body; we get:');
    console.log('content is ', content);
    console.log('important is ', important);

    Note.findByIdAndUpdate(request.params.id, {content, important}, 
        {new : true, runValidators : true, context : 'query'}
    )
      .then(updatedNote => {
        response.json(updatedNote)
      })
      .catch(error => next(error))
  })


app.use(unknownEndpoint) //no routes or middleware are called after this, with the exception of errorHandler 
app.use(errorHandler)

const PORT = process.env.PORT; // We are using dotenv and the port is defined in the .env file,... || 3001;   
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  }
);