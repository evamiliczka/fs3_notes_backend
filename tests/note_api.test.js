const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');

mongoose.set("bufferTimeoutMS", 30000);
const app = require('../app');
const Note = require('../models/note');

const api = supertest(app);


beforeEach(async () => {
    await Note.deleteMany({}); // reset DB

    let noteObject = new Note(helper.initialNotes[0]);
    await noteObject.save();

    noteObject = new Note(helper.initialNotes[1]);
    await noteObject.save();
}, 100000)



test('notes are retunrned as JSON', async () => {
    await api
        .get('/api/notes')
        .expect(200) // using supertest
        .expect('Content-Type', /application\/json/); // using supertest
},100000)

test('all notes are returned', async () => {
    const response = await api.get('/api/notes');

    expect(response.body).toHaveLength(helper.initialNotes.length);  // JEST expect method
},100000)

test('a specific note is within returned notes', async () => {
    const response = await api.get('/api/notes');

    const contents = response.body.map(r => r.content);

    expect(contents).toContain("Browser can execute only JavaScript"); // JEST expect
}, 100000)

test('a valid note can be added', async () => {
  const newNote = {
    content: 'async/await simplifies making async calls',
    important: true,
  };

  await api
    .post('/api/notes')
    .send(newNote) // supertest
    .expect(201) // supertest
    .expect('Content-Type', /application\/json/);

  const notesFinal = await helper.allNotesInDb();
  expect(notesFinal).toHaveLength(helper.initialNotes.length + 1);

  const contents = notesFinal.map(n => n.content);
  expect(contents).toContain('async/await simplifies making async calls'); 
  /* const response = await api.get('/api/notes');
  console.log('test response body is ', response.body,' of type ', typeof response.body);

  const contents = response.body.map(r => r.content);
  console.log('test contents is ', contents,' of type ', typeof contents); 


  expect(response.body).toHaveLength(helper.initialNotes.length + 1);
  expect(contents).toContain('async/await simplifies making async calls') */
})

test('a note without content CAN NOT be added', async () => {
  const newNote = {
    important: true,
  };

  await api
    .post('/api/notes')
    .send(newNote) // supertest
    .expect(400) // supertest    
    .expect('Content-Type', /application\/json/);

    const notesFinal = await helper.allNotesInDb();
    expect(notesFinal).toHaveLength(helper.initialNotes.length);
})

afterAll(async () => {
    await mongoose.connection.close();
})