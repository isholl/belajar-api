import bcrypt from 'bcrypt'

export const checkPassword = (password: string, userPassword: string) => {
  return bcrypt.compareSync(password, userPassword)
}

export const hashing = (password: string) => {
  return bcrypt.hashSync(password, 10)
}
