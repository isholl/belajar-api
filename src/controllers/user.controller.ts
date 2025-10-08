import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'

import {
  deleteUserById,
  getAllUsers,
  getUserById,
  insertUser,
  updateUserById,
} from '../services/user.service'
import { hashing } from '../utils/hashing'
import {
  createUserValidation,
  updateUserValidation,
} from '../validations/user.validation'

export const deleteUser = async (req: Request, res: Response) => {
  const user_id = req.params.id

  try {
    await deleteUserById(user_id)
    return res.status(200).json({ message: 'User deleted successfully.' })
  } catch (err) {
    return res.status(500).json({ message: (err as Error).message })
  }
}

export const updateUser = async (req: Request, res: Response) => {
  const user_id = req.params.id
  const { error, value } = updateUserValidation(req.body)

  if (error) {
    return res.status(422).json({
      message: 'Validation error',
      errors: error.details.map(detail => detail.message),
    })
  }

  try {
    await updateUserById(user_id, value)
    return res.status(200).json({ message: 'User updated successfully.' })
  } catch (err) {
    return res.status(500).json({ message: (err as Error).message })
  }
}

export const createUser = async (req: Request, res: Response) => {
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
    return res.status(200).json({ message: 'User created successfully.' })
  } catch (err) {
    return res.status(500).json({ message: (err as Error).message })
  }
}

export const getUsers = async (req: Request, res: Response) => {
  const user_id = req.params.id

  try {
    if (user_id) {
      const user = await getUserById(user_id)

      return res.status(200).json({ data: user })
    }

    const users = await getAllUsers()
    if (users.length > 0) {
      return res.status(200).json({ data: users })
    }

    return res.status(404).json({ message: 'User is empty.' })
  } catch (err) {
    return res.status(500).json({ message: (err as Error).message })
  }
}
