/*
 imports Node's built-in web server module
 The same as
 import http from 'http'
 (code that runs in the browser uses ES6 modules)
 But Node.js uses  'CommonJS modules':
  const http = require('http');
Node now also supports ES6 modules, but this is not perfect yet.
*/

const http = require('http');

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
/* We use createServer method
 of the http module to create a new web server.
 Event handler is registered to the server,
 that is called every time an HTTP request is made to the server's 
 address (not yet assigned...http://localhost:3001). */
const app = http.createServer((request, response) => {
  /* The server responds to the request with
    1. status code 200
    2. Content type header is set to ...
    3. The content of the site to be returned is...*/
    response.writeHead(200, 
      {'Content-Type': 'application/json'});
    response.end(JSON.stringify(notes));
    }
  )

/* We bind the http server assigned to the app variable, 
to listen to HTTP requests sent to port 3001 */
const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);