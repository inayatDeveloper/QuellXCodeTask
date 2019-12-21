const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const schemas = {

    signUp: Joi.object().keys({
        name: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        role: Joi.string(),
        password: Joi.string().min(8).regex(/^[a-zA-Z0-9]{3,30}$/).alphanum().required()
    }),

    signIn: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).regex(/^[a-zA-Z0-9]{3,30}$/).alphanum().required()
    }),

    updateUser: Joi.object().keys({
        userId: Joi.objectId().required(),
        name: Joi.string().allow('').min(3),
        role: Joi.string().allow(''),
    }),

    userId: Joi.object().keys({
        userId: Joi.objectId().required(),
    })
};

exports.schemas = schemas;