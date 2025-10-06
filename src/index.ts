import config from './config/env'
import { createServer } from './utils/server'

import './utils/db'

const app = createServer()
const port = config.PORT

app.listen(port, () =>
  console.log(`Api server started at http://localhost:${port}`),
)
