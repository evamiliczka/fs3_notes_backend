const express = require('express');
const cors = require ('cors');

/*express, which this time is a 
function that is used to create an express application stored in the app variable: */
const app = express();

app.use(express.json());
/* To make express show static content, the page index.html and the JavaScript, etc., 
it fetches, we need a built-in middleware from express called static.*/
app.use(express.static('build'));
app.use(cors());

let notes = [
    {
      id: 1,
      content: "HTML is easy",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
  ]

  /* Next, we define two routes to the application. The first one defines an event 
  handler that is used to handle HTTP GET requests made to the application's /, i.e. root:*/
app.get('/', (request, response) => {
//  console.log(request);
    response.send('<h1>Hello world</h1>')
})

/* Handle HTTP GET to /api/notes */
app.get('/api/notes', (request, response) => {
 // console.log('request',request);
    response.json(notes)
})

// Handle HTTP GET to /api/notes/SOMETHING
// SOMETHING is an arbitrary string
/// http://localhost/api/notes/1  ====> request.params = {id: '1'}
app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id); //change string to number
  const note = notes.find(n => n.id === id);
  if (note)
    response.json(note);
  else
    response.status(404).end(); 
})

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0;
  return maxId + 1;
}

app.post('/api/notes', (request, response) => {
  const body = request.body; //a JSON string

  //Ak novo pridana poznamka nema content, cize naco ju pridavat
  if (!body.content) 
    return response.status(400).json({error: 'content missing'})
  //else
  
  const newNote = {
    content : body.content,
    important : body.important || false,
    id : generateId()
  }


  notes = notes.concat(newNote);
  response.json(newNote);
 
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter(n => n.id !== id);
  response.status(204).end();
})

const PORT = process.env.PORT || 3001;   
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  }
);