/* eslint-disable no-underscore-dangle */
const supertest = require('supertest');
const mongoose = require('mongoose');

mongoose.set('bufferTimeoutMS', 30000);

const helper = require('./test_helper');
const app = require('../app');

const api = supertest(app);

const Note = require('../models/note');

beforeEach(async () => {
  await Note.deleteMany({}); // reset DB
  await Note.insertMany(helper.initialNotes);

  /* const notesObject = helper.initialNotes.map(note => new Note(note));
      // we create an array of promises
      const promiseArray = notesObject.map(note => note.save())
      // array is transformed to a single promise
      await Promise.all(promiseArray);
      // we can access results 
      const results = await Promise.all(promiseArray)
    */

  /* If we want PARTICULAR ORDER
    for (let note of helper.initialNotes) {
    let noteObject = new Note(note)
    await noteObject.save()
  } */
}, 100000);

describe('when there are initially some notes saved', () => {
  test('notes are retunrned as JSON', async () => {
    console.log('entered test');
    await api
      .get('/api/notes')
      .expect(200) // using supertest
      .expect('Content-Type', /application\/json/); // using supertest
  }, 100000);

  test('all notes are returned', async () => {
    const response = await api.get('/api/notes');

    expect(response.body).toHaveLength(helper.initialNotes.length); // JEST expect method
  }, 100000);

  test('a specific note is within returned notes', async () => {
    const response = await api.get('/api/notes');

    const contents = response.body.map((r) => r.content);

    expect(contents).toContain('Browser can execute only JavaScript'); // JEST expect
  }, 100000);
});

describe.only('viewing a specific note ', () => {
  test('succeeds with a valid id', async () => {
    const notesAtStart = await helper.allNotesInDb(); // maped with JSON belonging to noteSchema
    const noteToView = notesAtStart[0];
    // console.log('noteToView is ', noteToView);
    const result = await api
      .get(`/api/notes/${noteToView.id}`) // the app uses JSON belonging to noteSchema
      .expect(200)
      .expect('Content-Type', /application\/json/);

    //  console.log(' body is ', result.body);
    expect(result.body).toEqual(noteToView);
  });

  test('fails with status code 404 if note does not exist ', async () => {
    const validNonexisitngId = await helper.nonExistingId();

    await api.get(`/api/notes/${validNonexisitngId}`).expect(404);
  });

  test('fails with status code 400 if id is invalid ', async () => {
    const invalidId = '5a3d5da59070081a82a3445';

    await api.get(`/api/notes/${invalidId}`).expect(400);
  });
});

describe('addition of a new note ', () => {
  test('secceeds with a valid note', async () => {
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

    const contents = notesFinal.map((n) => n.content);
    expect(contents).toContain('async/await simplifies making async calls');
  });

  test('fails with status code 400 if data is invalid (content missing)', async () => {
    const invalidNote = {
      important: true,
    };

    await api.post('/api/notes').send(invalidNote).expect(400);

    const notesAtEnd = await helper.allNotesInDb();

    expect(notesAtEnd).toHaveLength(helper.initialNotes.length);
  });
});

test('a valid note can be updated', async () => {
  const updatedNote = {
    content: 'let us update the first note',
  };

  const notes = await helper.allNotesInDb();
  const aNote = notes[0];

  // console.log('We want to update note ', aNote, 'with id ', aNote.id);
  // console.log('On the address ', `/api/notes/${aNote.id}`);
  await api.put(`/api/notes/${aNote.id}`).send(updatedNote).expect(204);

  const notesFinal = await helper.allNotesInDb();
  expect(notesFinal).toHaveLength(helper.initialNotes.length);
  console.log('Notes final[0] is ', notesFinal[0].content);
  expect(notesFinal[0].content).toBe('let us update the first note');
});

describe('deletion of a note', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const notesAtStart = await helper.allNotesInDb();
    const noteToBeDeleted = notesAtStart[0];

    await api.delete(`/api/notes/${noteToBeDeleted.id}`).expect(204);

    const notesAtEnd = await helper.allNotesInDb();

    expect(notesAtEnd).toHaveLength(helper.initialNotes.length - 1);

    const contents = notesAtEnd.map((n) => n.content);
    expect(contents).not.toContain(noteToBeDeleted.content);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
