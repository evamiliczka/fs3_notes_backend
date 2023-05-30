const mongoose = require('mongoose')

if (process.argv.length < 3){
    console.log('Please give a password as argument');
    process.exit(1)
}

const password = process.argv[2]

const url = 
`mongodb+srv://evamiliczka:${password}@notes0.akd4cqs.mongodb.net/noteApp?retryWrites=true&w=majority`;


mongoose.set('strictQuery', false);
mongoose.connect(url);

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
})

const Note = mongoose.model('Note', noteSchema);

Note.find({}).then(result => {
    console.log(result);
    result.forEach(note => console.log(`note: ${note}`))
    mongoose.connection.close()
})

/* const note = new Note({
   content: 'CSS is difficult',
     important: true,
 })

note.save().then(result => {
    console.log(('Note saved!'));
    mongoose.connection.close();
})*/