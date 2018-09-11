const debug = require('debug')('kansa:server')
const path = require('path')

const config = require('@kansa/common/config')
const adminRouter = require('./admin/router')
const getConfig = require('./get-config')
const peopleRouter = require('./people/router')
const userRouter = require('./user/router')

module.exports = (db, app) => {
  const ctx = {}

  app.get('/config', (req, res, next) =>
    getConfig(db)
      .then(data => res.json(data))
      .catch(next)
  )

  app.use(userRouter(db, ctx))
  app.use('/people', adminRouter(db, ctx))
  app.use('/people', peopleRouter(db, ctx))

  Object.keys(config.modules).forEach(name => {
    const mc = config.modules[name]
    if (!mc) return
    debug(`Adding module ${name}`)
    const mp = path.resolve(__dirname, '..', 'modules', name)
    app.use(`/${name}`, require(mp)(db, ctx, mc))
  })

  return ctx
}
