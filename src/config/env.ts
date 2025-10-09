import 'dotenv/config'

const config = {
  DB: process.env.MONGO_URI,
  DB_TEST: process.env.MONGO_URI_TEST,
  PORT: process.env.PORT,
  JWT_PRIVATE: `${process.env.JWT_PRIVATE}`,
  JWT_PUBLIC: `${process.env.JWT_PUBLIC}`,
}

export default config
