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

const notesInDb = async () => {
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
  notesInDb,
};
