/* eslint-disable no-console */
// This is a Node module, not ES6 modules, as the others
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

// eslint-disable-next-line no-undef
const url = process.env.MONGODB_URI;

console.log('URL is', url);


mongoose.connect(url)
  .then(() => {  // replaced result by ()
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB: ', error.message);
  });

const noteSchema = new mongoose.Schema({
  content: {
    type : String,
    minLength : 5,
    required : true
  },
  important: Boolean,
});

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    // eslint-disable-next-line no-param-reassign, no-underscore-dangle
    returnedObject.id = returnedObject._id.toString();
    // eslint-disable-next-line no-underscore-dangle, no-param-reassign
    delete returnedObject._id;
    // eslint-disable-next-line no-underscore-dangle, no-param-reassign
    delete returnedObject.__v;
  }
});

/* The public interface of the module is
defined by setting a value to the module.exports variable. */
module.exports = mongoose.model('Note', noteSchema);