const bcrypt = require('bcrypt');
const supertest = require('supertest');
const mongoose = require('mongoose');

mongoose.set('bufferTimeoutMS', 30000);

const helper = require('./test_helper');
const app = require('../app');

const api = supertest(app);

const User = require('../models/user');


describe('when there is initially one user in the db', () => 
{
    beforeEach(async () => {
        await User.deleteMany({});
        const passwordHash = await bcrypt.hash('socret', 10);
        const user = new User({ username: 'root', passwordHash });
        await user.save();
    }, 100000);
   

    test('creation succeeds with a new username ', async () => {
        const usersAtTheBeginning = await helper.allUsersInDb();

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',  
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const usersInTheEnd = await helper.allUsersInDb();

        expect(usersInTheEnd).toHaveLength(usersAtTheBeginning.length + 1);
        const userNames = usersInTheEnd.map(u => u.username);
        expect(userNames).toContain(newUser.username);
    })

    test('creation fails with proper statuscode and message if the username is already taken', async () => {
        const usersAtTheBeginning = await helper.allUsersInDb();

        const newUser = {
            username: 'root',
            name: 'new Superuser',
            password: 'salainen',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);
        
        expect(result.body.error).toContain('expected `username` to be unique');

        const usersInTheEnd = await helper.allUsersInDb();
        expect(usersInTheEnd).toHaveLength(usersAtTheBeginning.length);

        
    })


    afterAll(async () => {
        await mongoose.connection.close();
    });
}
)