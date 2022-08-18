/*
 * @Author: 王敏
 * @LastEditTime: 2022-07-22 09:48:25
 * @Description: file content
 */
const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

app.use(cors({
  origin: 'http://localhost:8000', //前端地址
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  alloweHeaders: ['Conten-Type', 'Authorization'],
  credentials: true
}))
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

//路由模块
app.use('/test', require("./controllers/test"))
app.use('/home', require("./controllers/home"))
app.use('/calendar', require("./controllers/calendar"))
app.use(function (req: any, res: any) {
  res.send('404');
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})