//This is a Node module, not ES6 modules, as the others
const mongoose = require('mongoose')

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI

console.log('URL is', url)


mongoose.connect(url)
    .then(result => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB: ', error.message);
    })

const noteSchema = new mongoose.Schema({
    content : String,
    important: Boolean,
})

noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})

/*The public interface of the module is 
defined by setting a value to the module.exports variable.*/
module.exports = mongoose.model('Note', noteSchema);