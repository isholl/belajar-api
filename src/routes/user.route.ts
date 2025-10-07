import { Router } from 'express'

import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from '../controllers/user.controller'
import { requireAdmin, requireUser } from '../middleware/auth'

export const UserRouter: Router = Router()

UserRouter.delete('/:id', requireAdmin, deleteUser)
UserRouter.put('/:id', requireAdmin, updateUser)
UserRouter.post('/', requireAdmin, createUser)
UserRouter.get('/:id', requireUser, getUsers)
UserRouter.get('/', requireUser, getUsers)
