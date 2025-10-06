import { Router } from 'express'

import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from '../controllers/user.controller'

export const UserRouter: Router = Router()

UserRouter.delete('/:id', deleteUser)
UserRouter.put('/:id', updateUser)
UserRouter.post('/', createUser)
UserRouter.get('/:id', getUsers)
UserRouter.get('/', getUsers)
