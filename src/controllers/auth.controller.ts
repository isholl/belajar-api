import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'

import { findUserByEmail, insertUser } from '../services/user.service'
import { checkPassword, hashing } from '../utils/hashing'
import { signJWT, veryfiedJWT } from '../utils/jwt'
import {
  createSessionValidation,
  createUserValidation,
  refreshSessionValidation,
} from '../validations/user.validation'

export const refreshSession = async (req: Request, res: Response) => {
  const { error, value } = refreshSessionValidation(req.body)

  if (error) {
    return res.status(422).json({ message: error.details[0].message })
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { decoded }: any = veryfiedJWT(value.refreshToken)

    const user = await findUserByEmail(decoded?._doc.email)

    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    const accessToken = signJWT(
      {
        ...user,
      },
      {
        expiresIn: '1d',
      },
    )

    return res.status(200).json({
      message: 'Refresh session successfully.',
      data: { accessToken },
    })
  } catch (err) {
    return res.status(500).json({ message: (err as Error).message })
  }
}

export const createSession = async (req: Request, res: Response) => {
  const { error, value } = createSessionValidation(req.body)

  if (error) {
    return res.status(422).json({
      message: 'Validation error',
      errors: error.details.map(detail => detail.message),
    })
  }

  try {
    const user = await findUserByEmail(value.email)

    if (!user || !user.password || !value.password) {
      return res.status(422).json({ message: 'Invalid email or password.' })
    }

    const isValid = checkPassword(value.password, user.password)

    if (!isValid) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    const accessToken = signJWT({ ...user }, { expiresIn: '1d' })

    const refreshToken = signJWT({ ...user }, { expiresIn: '1y' })

    return res.status(200).json({
      message: 'Login success',
      data: { accessToken, refreshToken },
    })
  } catch (err) {
    return res.status(500).json({ message: (err as Error).message })
  }
}

export const registerUser = async (req: Request, res: Response) => {
  req.body.user_id = uuidv4()
  const { error, value } = createUserValidation(req.body)

  if (error) {
    return res.status(422).json({
      message: 'Validation error',
      errors: error.details.map(detail => detail.message),
    })
  }

  try {
    value.password = `${hashing(value.password)}`

    await insertUser(value)
    return res.status(201).json({ message: 'Register user successfully.' })
  } catch (err) {
    return res.status(500).json({ message: (err as Error).message })
  }
}
