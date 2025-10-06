import mongoose from 'mongoose'

import config from '../config/env'

mongoose
  .connect(`${config.DB}`)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch(err => {
    console.log('Failed connect to MongoDB')
    console.log(err)
    process.exit(1)
  })
