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
  const note = new Note({content : 'willremovethissoon'});
  await note.save();
  await note.deleteOne();

  return note._id.toString();
} 

const allNotesInDb = async () => {
  const notes = await Note.find({});
  console.log(
    'notesInDb first note is',
    notes[0],
    '  of type',
    typeof notes[0]
  );
  return notes.map((note) => note.toJSON()); // why toJSON? Works also without...
};

module.exports = {
  initialNotes,
  allNotesInDb,
  nonExistingId,
};
