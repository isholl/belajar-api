import { NextFunction, Request, Response } from 'express'

import { veryfiedJWT } from '../utils/jwt'

export const requireUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = res.locals.user

  if (!user) {
    res.sendStatus(403)
    return
  }

  return next()
}

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = res.locals.user

  // Res.locals.user now contains the decoded JWT payload directly.
  // Check role on the payload instead of digging into Mongoose internals.
  if (!user || user.role !== 'admin') {
    res.sendStatus(403)
    return
  }

  return next()
}

export const deserializedToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const accessToken = req.headers.authorization?.replace(/^Bearer\s/, '')

  if (!accessToken) {
    next()
    return
  }

  const { decoded, expired } = veryfiedJWT(accessToken)

  if (decoded) {
    res.locals.user = decoded
    next()
    return
  }

  if (expired) {
    next()
    return
  }

  return next()
}
