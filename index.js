import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import fs from 'fs';

import { 
    registerValidation,
    postCreateValidation, 
    loginValidation 
    } from './validations.js';
import {PostController, UserController} from './controllers/index.js';
import {handleValidationErrors, checkAuth} from './utils/index.js';

mongoose
    .connect('mongodb+srv://admin:wwwwww@cluster0.8ny2mnh.mongodb.net/?retryWrites=true&w=majority')
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err))

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads');
          }
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        console.log(file);

        cb(null, file.originalname)
    }
});

const upload = multer({storage})

app.use(express.json())

app.listen(4444, (err) => {
    if (err) {
        return console.log(err)
    }
    console.log('Server OK')
})

app.use('/uploads', express.static('uploads'));

//User
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);

app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);

app.get('/auth/me', checkAuth, UserController.getMe);


//Post
app.get('/posts', PostController.getAll);

app.get('/posts/:id', PostController.getOne);

app.delete('/posts/:id', checkAuth, PostController.remove);

app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);

app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);

// Upload files

app.post('/upload', checkAuth, upload.single('image'), (res, req) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
});
