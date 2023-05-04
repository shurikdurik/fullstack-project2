import { body } from 'express-validator';

export const registerValidation = [
    body('email', 'Wrong email').isEmail(),
    body('password', 'Password should be at least 5 symbols length').isLength({min: 5}),
    body('fullName', 'Your full name').isLength({min: 3}),
    body('avatarUrl', 'Wrong URL to avatar').optional().isURL(),
];

export const loginValidation = [
    body('email', 'Wrong email').isEmail(),
    body('password', 'Password should be at least 5 symbols length').isLength({min: 5}),
];

export const postCreateValidation = [
    body('title', 'Header of your post').isLength({min: 3}).isString(),
    body('text', 'Text of your post').isLength({min: 10}).isString(),
    body('tags', 'Wrong format of tags, use array').optional().isString(),
    body('imageUrl', 'Wrong URL to image').optional().isString(),
];