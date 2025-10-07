import { Router } from 'express'

import {
  createSession,
  refreshSession,
  registerUser,
} from '../controllers/auth.controller'

export const AuthRouter: Router = Router()

AuthRouter.post('/refresh', refreshSession)
AuthRouter.post('/login', createSession)
AuthRouter.post('/register', registerUser)
