import 'dotenv/config'

const config = {
  DB: process.env.MONGO_URI,
  PORT: process.env.PORT,
}

export default config
