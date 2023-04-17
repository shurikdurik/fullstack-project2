import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import { registerValidator } from './validations/auth.js';
import UserModel from './models/User.js'

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

app.post('/auth/register', registerValidator, async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json(errors.array())
        }
        const { password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash
        })
        const user = await doc.save();
        res.json(user)
    } catch (error) {
        res.status(500).json({
            message: 'Cant register',
            error
        })
    }
})

