import { Application } from 'express'

export function registeRoutes (app: Application) {
  //路由模块
  app.use('/test', require("./controllers/test"))
  app.use('/home', require("./controllers/home"))
  app.use('/calendar', require("./controllers/calendar"))
  app.use('/user', require("./controllers/user"))
}