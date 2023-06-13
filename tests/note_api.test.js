const mongoose = require('mongoose');
const supertest = require('supertest');

mongoose.set("bufferTimeoutMS", 30000);
const app = require('../app');
const Note = require('../models/note');

const api = supertest(app);

const initialNotes =  [
    {
      content: 'HTML is easy',
      important: false,
    },
    {
      content: 'Browser can execute only JavaScript',
      important: true,
    },
  ]

beforeEach(async () => {
    await Note.deleteMany({});
    let noteObject = new Note(initialNotes[0]);
    await noteObject.save();
    noteObject = new Note(initialNotes[1]);
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

    expect(response.body).toHaveLength(initialNotes.length);  // JEST expect method
},100000)

test('a specific note is within returned notes', async () => {
    const response = await api.get('/api/notes');

    const contents = response.body.map(r => r.content);

    expect(contents).toContain("Browser can execute only JavaScript"); // JEST expect
}, 100000)

afterAll(async () => {
    await mongoose.connection.close();
})