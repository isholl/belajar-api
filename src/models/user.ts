import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
  },
  { timestamps: true },
)

export const UserModel = mongoose.model('users', UserSchema)
