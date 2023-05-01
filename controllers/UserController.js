import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';

import UserModel from '../models/User.js';


export const register = async (req, res) => {
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
};

export const login = async (req, res) => {
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
}

export const getMe = async (req, res) => {
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
}