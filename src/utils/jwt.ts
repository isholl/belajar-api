import jwt from 'jsonwebtoken'

import config from '../config/env'

export const veryfiedJWT = (token: string) => {
  try {
    const decoded = jwt.verify(token, config.JWT_PUBLIC)

    return {
      valid: true,
      expired: false,
      decoded,
    }
  } catch (err) {
    return {
      valid: false,
      expired: (err as Error).message.includes('jwt expired'),
      decoded: null,
      message: (err as Error).message,
    }
  }
}

export const signJWT = (
  payload: object,
  options: jwt.SignOptions | undefined,
) => {
  return jwt.sign(payload, config.JWT_PRIVATE, {
    ...(options && options),
    algorithm: 'RS256',
  })
}
