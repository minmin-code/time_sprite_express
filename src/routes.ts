/*
 * @Author: 王敏
 * @LastEditTime: 2022-08-23 11:31:22
 * @Description: file content
 */
import { Application } from 'express'

export function registeRoutes (app: Application) {
  //路由模块
  app.use('/test', require("./controllers/test"))
  app.use('/user', require("./controllers/user"))
  app.use('/todo', require("./controllers/todo"))
  app.use('/task', require("./controllers/task"))
}