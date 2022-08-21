/*
 * @Author: 王敏
 * @LastEditTime: 2022-07-22 09:48:25
 * @Description: file content
 */

import { registeMiddlewares } from "./middlewares";

const express = require('express')
const app = express()

const { registeRoutes } = require('./routes')

const port = 3000

import config from '../config'


// function x () {
//   config.middlewares.forEach(name => {
//     const module = require(name)
//     // @ts-ignore
//     app.use(module(config.midleewareConfig[name]))
//   })
// }

registeMiddlewares(app)
registeRoutes(app)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})