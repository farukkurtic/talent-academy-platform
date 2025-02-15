const Joi = require('joi');
const { password } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const changePassword = {
  body: Joi.object().keys({
    _id: Joi.object().keys({
      _id: Joi.required(),
      currentPassword: Joi.string().required(),
      newPassword: Joi.string().required(),
    })
  }),
};

module.exports = {
    register,
    login,
    changePassword
}