import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

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

app.get('/', (req, res) =>{
    res.send('Hello world')
})

app.post('/auth/login', (req, res) =>{
    const token = jwt.sign({
        email: req.body.email,
        password: req.body.password, 
    },
    'secret123'
    )
    res.json({
        success: true,
        token
    })
})

