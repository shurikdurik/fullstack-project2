import express from 'express';
import mongoose from 'mongoose';
import { 
    registerValidation,
    postCreateValidation, 
    loginValidation 
    } from './validations.js';
import checkAuth from './utils/checkAuth.js';
import * as UserController from './controllers/UserController.js';
import * as PostController from './controllers/PostController.js';

mongoose
    .connect('mongodb+srv://admin:wwwwww@cluster0.8ny2mnh.mongodb.net/?retryWrites=true&w=majority')
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err))

const app = express();

app.use(express.json())

app.listen(4444, (err) => {
    if (err) {
        return console.log(err)
    }
    console.log('Server OK')
})
//User
app.post('/auth/login', loginValidation, UserController.login)

app.post('/auth/register', registerValidation, UserController.register)

app.get('/auth/me', checkAuth, UserController.getMe)


//Post
app.get('/posts', checkAuth, PostController.getAll)

app.get('/posts/:id', checkAuth, PostController.getOne)

app.delete('/posts/:id', checkAuth, PostController.remove)


app.post('/posts', checkAuth, postCreateValidation, PostController.create)

//app.get('/auth/me', checkAuth, UserController.getMe)

