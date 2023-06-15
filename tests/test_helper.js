/* eslint-disable no-underscore-dangle */
const Note = require('../models/note');

const initialNotes = [
  {
    content: 'HTML is easy',
    important: false,
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true,
  },
];

const nonExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon' }); // here _id is already generated
  // console.log('This note is going to be saved ', note);
  await note.save(); // here note has also __v: 0
  // console.log('This note has been saved ', note);

  await note.deleteOne(); // note object remains the same, only it is not in DB
  // console.log('This note has been deleted ', note);

  return note._id.toString();
};

const allNotesInDb = async () => {
  const notes = await Note.find({});

  return notes.map((note) => note.toJSON()); // our JSON transform
};

module.exports = {
  initialNotes,
  allNotesInDb,
  nonExistingId,
};
