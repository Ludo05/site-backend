import Joi from 'joi';

export const UserValidation = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
});

export const getUserValidation = Joi.object().keys({
    username: Joi.string().min(2).required().error(() => 'username needs to be a string')
});