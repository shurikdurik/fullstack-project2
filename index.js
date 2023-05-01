import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import { registerValidator } from './validations/auth.js';
import UserModel from './models/User.js';
import checkAuth from './utils/checkAuth.js'

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

app.post('/auth/login', async (req, res) => {
    try {
        const user = await UserModel.findOne({email: req.body.email});

        if (!user) {
            res.status(404).json({
                message: 'Wrong email or password'
            })
        }

        const isValidPass = await bcrypt.compare(req.body.password, user.passwordHash)

        if (!isValidPass) {
            res.status(400).json({
                message: 'Wrong email or password'
            })
        }

        const token = jwt.sign({
            _id: user._id,
        }, 
        'secret123',
        {
            expiresIn: '30d'
        });

        const {passwordHash, ...userData} = user._doc;

        res.json({
            ...userData,
            token
        });

    } catch (error) {
        res.status(500).json({
            message: 'Cant login',
            error
        })
    }
})

app.post('/auth/register', registerValidator, async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json(errors.array())
        }
        const { password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        })
        
        const user = await doc.save();
        const token = jwt.sign({
            _id: user._id,
        }, 
        'secret123',
        {
            expiresIn: '30d'
        });

        const {passwordHash, ...userData} = user._doc;

        res.json({
            ...userData,
            token
        });

    } catch (error) {
        res.status(500).json({
            message: 'Cant register',
            error
        })
    }
})

app.get('/auth/me', checkAuth, async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);

        if (!user) {
            req.status(404).json({
                message: "No user founded"
            })
        }
        
        const {passwordHash, ...userData} = user._doc;

        res.json(userData);
    } catch (error) {
        res.status(500).json({
            message: 'Cant register',
            error
        })
    }
})

