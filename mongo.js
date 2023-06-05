/* eslint-disable no-console */
const mongoose = require('mongoose');

// eslint-disable-next-line no-undef
if (process.argv.length < 3){
  console.log('Please give a password as argument');
  // eslint-disable-next-line no-undef
  process.exit(1);
}

// eslint-disable-next-line no-undef
const password = process.argv[2];

const url =
`mongodb+srv://evamiliczka:${password}@cluster0.btei67j.mongodb.net/Notes?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

const Note = mongoose.model('Note', noteSchema);



const note = new Note({
  content: 'CSS is difficult',
  important: true,
});

note.save().then(() => { // replaced result by () !!!
  console.log(('Note saved!'));
  //  mongoose.connection.close();
});

Note.find({}).then(result => {
  console.log(result);
  result.forEach(n => console.log(`note: ${n}`));
  mongoose.connection.close();
});