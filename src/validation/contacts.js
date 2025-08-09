import Joi from 'joi';
import JoiPhoneNumber from 'joi-phone-number';

const JoiPhone = Joi.extend(JoiPhoneNumber);

export const createContactsSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Contact name should be a string',
    'string.min': 'Contact name should have at least {#limit} characters',
    'string.max': 'Contact name should have at most {#limit} characters',
    'any.required': 'Contact name is required',
  }),
  phoneNumber: Joi.string()
    .replace(/\D/g, '')
    .replace(/^380/, '+380')
    .replace(/^0/, '+380')
    .pattern(/^\+380\d{9}$/)
    .required()
    .messages({
      'string.base': 'Phone number should be a string',
      'string.phoneNumber': 'Phone number must be valid for Ukraine',
      'any.required': 'Phone number must be required',
    }),
  email: Joi.string().trim().lowercase().email().optional().empty('').messages({
    'string.email': 'Email must be a valid email address',
  }),
  isFavourite: Joi.boolean().default(true).messages({
    'boolean.base': 'isFavourite must be a boolean value',
  }),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .required()
    .default('personal')
    .messages({
      'any.only': 'Contact type must be one of work, home, or personal',
      'any.required': 'Contact type is required',
    }),
}).unknown(false);

export const upDateContactsSchema = Joi.object({
  name: Joi.string().trim().min(3).max(20).messages({
    'string.base': 'Contact name should be a string',
    'string.min': 'Contact name should have at least {#limit} characters',
    'string.max': 'Contact name should have at most {#limit} characters',
  }),
  phoneNumber: Joi.string()
    .replace(/\D/g, '')
    .replace(/^380/, '+380')
    .replace(/^0/, '+380')
    .pattern(/^\+380\d{9}$/)
    .disallow('')
    .optional()
    .messages({
      'any.invalid': 'Phone number cannot be empty',
      'string.base': 'Phone number should be a string',
      'string.phoneNumber': 'Phone number must be valid for Ukraine',
    }),
  email: Joi.string().trim().lowercase().email().messages({
    'string.email': 'Email must be a valid email address',
  }),
  isFavourite: Joi.boolean().strict().invalid('').optional().messages({
    'boolean.base': 'isFavourite must be a boolean value',
    'any.invalid': 'isFavourite cannot be empty',
  }),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .disallow('')
    .optional()
    .messages({
      'any.only': 'Contact type must be one of work, home, or personal',
      'any.invalid': 'Contact type cannot be empty',
    }),
}).unknown(false);
