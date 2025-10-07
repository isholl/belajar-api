import { UserModel } from '../models/user'
import { User } from '../types/api'

export const findUserByEmail = async (email: string) => {
  return await UserModel.findOne({ email })
}

export const deleteUserById = async (user_id: string) => {
  await getUserById(user_id)

  return await UserModel.findOneAndDelete({ user_id })
}

export const updateUserById = async (user_id: string, payload: User) => {
  await getUserById(user_id)

  return await UserModel.findOneAndUpdate({ user_id }, { $set: payload })
}

export const insertUser = async (payload: User) => {
  return await UserModel.create(payload)
}

export const getUserById = async (user_id: string) => {
  const user = await UserModel.findOne({ user_id })

  if (!user) throw { message: 'User not found.' }

  return user
}

export const getAllUsers = async () => {
  return await UserModel.find()
}
