import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'

import {
  deleteUserById,
  getAllUsers,
  getUserById,
  insertUser,
  updateUserById,
} from '../services/user.service'
import { createUserValidation } from '../validations/user.validation'

export const deleteUser = async (req: Request, res: Response) => {
  const user_id = req.params.id

  try {
    await deleteUserById(user_id)
    res.status(200).json({ message: 'User deleted successfully.' })
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}

export const updateUser = async (req: Request, res: Response) => {
  const user_id = req.params.id
  const { error, value } = createUserValidation(req.body)

  if (error) {
    res.status(422).json({ message: error.details[0].message })
  }

  try {
    await updateUserById(user_id, value)
    res.status(200).json({ message: 'User updated successfully.' })
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}

export const createUser = async (req: Request, res: Response) => {
  req.body.user_id = uuidv4()
  const { error, value } = createUserValidation(req.body)

  if (error) {
    res.status(422).json({ message: error.details[0].message })
    return
  }

  try {
    await insertUser(value)
    res.status(200).json({ message: 'User created successfully.' })
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}

export const getUsers = async (req: Request, res: Response) => {
  const user_id = req.params.id

  try {
    if (user_id) {
      const user = await getUserById(user_id)

      res.status(200).json({ data: user })
      return
    }

    const users = await getAllUsers()
    if (users.length > 0) {
      res.status(200).json({ data: users })
      return
    }

    res.status(404).json({ message: 'User is empty.' })
  } catch (err) {
    res.status(500).json({ message: (err as Error).message })
  }
}
