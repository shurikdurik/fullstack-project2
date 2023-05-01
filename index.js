import express from 'express';
import mongoose from 'mongoose';
import { registerValidator } from './validations/auth.js';
import checkAuth from './utils/checkAuth.js'
import {register, login, getMe} from './controllers/UserController.js'

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

app.post('/auth/login', login)

app.post('/auth/register', registerValidator, register)

app.get('/auth/me', checkAuth, getMe)

