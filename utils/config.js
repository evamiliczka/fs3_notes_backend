/* Handling of environment variables */
/* The environment variables from the ".env" file are available globally,
 before the code from the other modules is imported. */
require('dotenv').config();
// console.log('Process env: ', process.env); //testing

const { PORT } = process.env;
const MONGODB_URI =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

console.log('This is config.js, MONGODB_URI is set to ', MONGODB_URI);

module.exports = {
  MONGODB_URI,
  PORT,
};
