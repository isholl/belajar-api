import Joi from 'joi'

import { User } from '../types/api'

export const refreshSessionValidation = (payload: User) => {
  const schema = Joi.object({
    refreshToken: Joi.string().required(),
  })

  return schema.validate(payload)
}

export const createSessionValidation = (payload: User) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  })

  return schema.validate(payload, {
    abortEarly: false,
  })
}

export const updateUserValidation = (payload: User) => {
  const schema = Joi.object({
    name: Joi.string().min(3).allow('', null),
    email: Joi.string().email().allow('', null),
    password: Joi.string().min(6).allow('', null),
  })

  return schema.validate(payload, {
    abortEarly: false,
  })
}

export const createUserValidation = (payload: User) => {
  const schema = Joi.object({
    user_id: Joi.string().required(),
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  })

  return schema.validate(payload, {
    abortEarly: false,
  })
}
