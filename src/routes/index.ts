import { Application, Router } from 'express'

import { AuthRouter } from './auth.route'
import { HealthRouter } from './health.route'
import { UserRouter } from './user.route'

const _routes: Array<[string, Router]> = [
  ['/health', HealthRouter],
  ['/users', UserRouter],
  ['/auth', AuthRouter],
]

export const routes = (app: Application) => {
  _routes.forEach(route => {
    const [url, router] = route
    app.use(`/api${url}`, router)
  })
}
