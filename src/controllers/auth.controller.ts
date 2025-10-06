import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'

import { insertUser } from '../services/user.service'
import { hashing } from '../utils/hashing'
import { createUserValidation } from '../validations/user.validation'

export const registerUser = async (req: Request, res: Response) => {
  req.body.user_id = uuidv4()
  const { error, value } = createUserValidation(req.body)

  if (error) {
    res.status(422).json({ message: error.details[0].message })
  }

  try {
    value.password = `${hashing(value.password)}`

    await insertUser(value)
    res.status(201).json({ message: 'Register user successfully.' })
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}
