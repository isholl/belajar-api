import Joi from 'joi'

import { User } from '../types/api'

export const createUserValidation = (payload: User) => {
  const schema = Joi.object({
    user_id: Joi.string().required(),
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
  })

  return schema.validate(payload)
}
