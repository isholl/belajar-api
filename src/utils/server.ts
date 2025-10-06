import bodyParser from 'body-parser'
import express, { Application } from 'express'

import { routes } from '../routes'

export const createServer = () => {
  const app: Application = express()

  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', '*')
    res.setHeader('Access-Control-Allow-Headers', '*')
    next()
  })

  routes(app)

  return app
}
