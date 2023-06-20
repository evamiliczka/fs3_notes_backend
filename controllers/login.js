/* eslint-disable no-underscore-dangle */
const jwt  = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/user');

loginRouter.post('/', async (request, response) => {
    const { username, password } = request.body;

    const user = await User.findOne({ username });
    const passwordIsCorrect = user === null
        ? false  // if the user does not exist, he can not have a password
        : await bcrypt.compare(password, user.passwordHash);

    if (!user || !passwordIsCorrect) {
        return response.status(401).json({error: 'invalid username or password'});
    }

    // all is ok
    const userForNewToken = {
        username: user.username,
        id: user._id,
    }

    // TOKEN EXPIRES IN 60 x 60 seconds, i.e. in one hour
    const token = jwt.sign(
        userForNewToken,
        process.env.SECRET,
        { expiresIn: 60*60 }
    )


    response 
        .status(200)
        .send({token, username: user.username, name: user.name});
})

module.exports = loginRouter;