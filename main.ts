/*
 * @Author: 王敏
 * @LastEditTime: 2022-07-18 17:50:12
 * @Description: file content
 */
import { PrismaClient } from '@prisma/client'

const express = require('express')
const cors=require('cors')
const app = express()
const port = 3000
const prisma = new PrismaClient()

app.use(cors({
  origin: 'http://localhost:8000', //前端地址
  methods: ['GET', 'POST'],
  alloweHeaders: ['Conten-Type', 'Authorization'],
  credentials: true
}))
// app.use((req:any, res:any, next:Function) => {
//   // 即在不同域名下发出的请求也可以携带 cookie
//   res.header("Access-Control-Allow-Credentials",true)
//   // 第二个参数表示允许跨域的域名，* 代表所有域名
//   res.header('Access-Control-Allow-Origin', 'http://localhost:8000')//配置80端口跨域
//   res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS') // 允许的 http 请求的方法
//   // 允许前台获得的除 Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma 这几张基本响应头之外的响应头
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
//   if (req.method == 'OPTIONS') {
//       res.sendStatus(200)
//   } else {
//       next()
//   }
// })
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


//增
app.post('/api/user', async (req:any, res:any) => {
  try {
    console.log(req.body)
    let {name,email}=req.body
    const allUsers = await prisma.user.create({
      data: {name,email},
    })
    res.send({code:200,message:'添加成功'})
  } catch (err) {
    console.error(err)
  }
})
//删
app.delete('/api/user/:id', async(req:any, res:any) => {
  const allUsers = await prisma.user.delete({
    where:{
      id:+req.params.id
    },
  })
  res.send({code:200,message:'删除成功'})
})
//改
app.put('/api/user/:id', async(req:any, res:any) => {
  let {name,email}=req.body
  const allUsers = await prisma.user.update({
    where:{
      id:+req.params.id
    },
    data: {name,email},
  })
  res.send({code:200,message:'修改成功'})
})
//查1
app.get('/api/user', async(req:any, res:any) => {
  const allUsers = await prisma.user.findMany({})
  res.send({code:200,data:allUsers})
})
//查2
app.get('/api/user/:id', async(req:any, res:any) => {
  const allUsers = await prisma.user.findMany({
    where:{
      id:+req.params.id
    }
  })
  res.send({code:200,data:allUsers})
})

interface TaskType {
  id: string
  name: string
  checked: boolean
}
 interface AddFormType {
  id?: string
  title: string // 标题
  subTitle?: string // 副标
  dateType?: number // 时间类型
  date?: string // 具体日期
  clock?: string[] // 闹钟 （具体时间时，分）
  taskList: TaskType[] // 任务列表
}


/**
 * 任务列表
 */
app.post('/home/addTask', async (req:any, res:any) => {
  let {
    title, // 标题
    subTitle, // 副标
    dateType, // 时间类型
    date, // 具体日期
    clock, // 闹钟 （具体时间时，分）
    taskList // 任务列表
  }:AddFormType=req.body
  try{
    await prisma.todo.create({
      data: {
        title, // 标题
        subTitle, // 副标
        dateType, // 时间类型
        date, // 具体日期
        clock: clock?.toString(), // 闹钟 （具体时间时，分）
        // taskList, // 任务列表
        taskList: {
          create: taskList
        }

      },
    })
    res.send({code:200,message:'添加成功'})
  }catch(err){
    console.error(err)
    res.send({code:500,message:'添加失败'})
  }
})

app.get('/home/getTodoList', async (req:any, res:any) => {
  let {
    date
  }=req.body
  const data = await prisma.todo.findMany({
    where:{
      date
    },
    include: {
      taskList: true
    }
  })
  res.send({code:200,data:data})
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})