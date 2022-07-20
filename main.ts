/*
 * @Author: 王敏
 * @LastEditTime: 2022-07-20 18:58:54
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
  methods: ['GET', 'POST','PUT','DELETE'],
  alloweHeaders: ['Conten-Type', 'Authorization'],
  credentials: true
}))
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
  ddl?: string // 截至日期
  taskList: TaskType[] // 任务列表
}


/**
 * 任务列表
 */
//新增任务
app.post('/home/addTask', async (req:any, res:any) => {
  let {
    title, // 标题
    subTitle, // 副标
    ddl,
    taskList // 任务列表
  }:AddFormType=req.body
  try{
    await prisma.todo.create({
      data: {
        title, // 标题
        subTitle, // 副标
        ddl,
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
//获取任务列表
app.get('/home/getTodoList', async (req:any, res:any) => {
  let {
    ddl
  }=req.query
  const data = await prisma.todo.findMany({
    where:{
      // ddl
      ddl:{
        startsWith:ddl
      }
    },
    include: {
      taskList: true
    }
  })
  res.send({code:200,data:data})
})

app.post('/home/updateSubTask', async (req:any, res:any) => {
  let {
    id,
    ...rest
  }=req.query
  const data = await prisma.todo.update({
    where:{
      id
    },
    data:{
      ...rest
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