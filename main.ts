/*
 * @Author: 王敏
 * @LastEditTime: 2022-07-22 09:48:25
 * @Description: file content
 */
import { PrismaClient } from '@prisma/client'
import moment from 'moment'

const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000
const prisma = new PrismaClient()

app.use(cors({
  origin: 'http://localhost:8000', //前端地址
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  alloweHeaders: ['Conten-Type', 'Authorization'],
  credentials: true
}))
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


//增
app.post('/api/user', async (req: any, res: any) => {
  try {
    console.log(req.body)
    let { name, email } = req.body
    const allUsers = await prisma.user.create({
      data: { name, email },
    })
    res.send({ code: 200, message: '添加成功' })
  } catch (err) {
    console.error(err)
  }
})
//删
app.delete('/api/user/:id', async (req: any, res: any) => {
  const allUsers = await prisma.user.delete({
    where: {
      id: +req.params.id
    },
  })
  res.send({ code: 200, message: '删除成功' })
})
//改
app.put('/api/user/:id', async (req: any, res: any) => {
  let { name, email } = req.body
  const allUsers = await prisma.user.update({
    where: {
      id: +req.params.id
    },
    data: { name, email },
  })
  res.send({ code: 200, message: '修改成功' })
})
//查1
app.get('/api/user', async (req: any, res: any) => {
  const allUsers = await prisma.user.findMany({})
  res.send({ code: 200, data: allUsers })
})
//查2
app.get('/api/user/:id', async (req: any, res: any) => {
  const allUsers = await prisma.user.findMany({
    where: {
      id: +req.params.id
    }
  })
  res.send({ code: 200, data: allUsers })
})

interface Task {
  id: number
  name: string
  checked: boolean
}
interface AddFormType {
  id?: string
  title: string // 标题
  subTitle?: string // 副标
  ddl: string // 截至日期
  taskList: Task[] // 任务列表
}
interface UpdateForm {
  id: number
  title?: string // 标题
  subTitle?: string // 副标
  ddl?: string // 截止日期
  taskList: Task[] // 任务列表
  finish?: boolean // 是否完成
}
interface CalendarEvent{
  title:string,
  date:string
}


/**
 * 任务列表
 */
//新增任务
app.post('/home/addTask', async (req: any, res: any) => {
  let {
    title, // 标题
    subTitle, // 副标
    ddl,
    taskList // 任务列表
  }: AddFormType = req.body
  try {
    await prisma.todo.create({
      data: {
        title, // 标题
        subTitle, // 副标
        ddl:new Date(ddl),
        taskList: {
          create: taskList
        }

      },
    })
    res.send({ code: 200, message: '添加成功' })
  } catch (err) {
    console.error(err)
    res.send({ code: 500, message: '添加失败' })
  }
})
//获取任务列表
app.get('/home/getTodoList', async (req: any, res: any) => {
  let {
    ddl
  } = req.query
  try {
    const data = await prisma.todo.findMany({
      where: {
        AND:[
          {
            ddl:{
              gte:ddl
            }
          },
          {
            ddl:{
              lt:new Date(moment(ddl).add(1,'d').format('YYYY-MM-DD HH:mm:ss'))
            }
          },
        ]
      },
      include: {
        taskList:{
          select:{
            id:true,
            name:true,
            checked:true
          }
        }
      }
    })
    res.send({ code: 200, data: data })
  } catch (err) {
    console.error(err)
    res.send({ code: 500, message: '获取任务失败' })
  }
})
//获取任务详情
app.get('/home/getTaskDetail/:id', async (req: any, res: any) => {
  try {
    const data = await prisma.todo.findUnique({
      where: {
        id:+req.params.id
      },
      include: {
        taskList:{
          select:{
            id:true,
            name:true,
            checked:true
          }
        }
      }
    })
    res.send({ code: 200, data: data })
  } catch (err) {
    console.error(err)
    res.send({ code: 500, message: '获取任务详情失败' })
  }
})
//修改子任务
app.post('/home/updateSubTask', async (req: any, res: any) => {
  try {
    let {
      id,
      ...rest
    } = req.body
    await prisma.task.update({
      where: {
        id
      },
      data: {
        ...rest
      },
    })
    res.send({ code: 200, message: '修改成功' })
  } catch (err) {
    console.error(err)
    res.send({ code: 500, message: '修改子任务失败' })
  }
})
//修改任务
app.post('/home/updateTask', async (req: any, res: any) => {
  try {
    let {
      id,
      taskList,
      ...rest
    }:UpdateForm = req.body
    await prisma.todo.update({
      where: {
        id
      },
      data:{
        ...rest,
        taskList:{
          create:taskList.filter((task:Task)=>!task.id),
          update:taskList.filter((task:Task)=>task.id).map((task:Task)=>({data:task,where:{id:task.id}}))


          // upsert:taskList.map((task:Task)=>({
          //   create:task,
          //   update:task,
          //   // where:{id:task.id}
          // }))
        }
      },
      // create:{
      //   taskList:{connectOrCreate:list}
      // },
      // update:{
      //   ...rest,
      //   taskList:{connectOrCreate:list}
      // },
      include: {
        taskList: true
      }
    })
    res.send({ code: 200, message: '修改成功' })
  } catch (err) {
    console.error(err)
    res.send({ code: 500, message: '修改任务失败' })
  }
})

/**
 * 日历模块
 */
app.get('/calendar/getCalendarEvents', async (req: any, res: any) => {
  let {
    date
  } = req.query
  try {
    const data = await prisma.todo.findMany({
      where: {
        AND:[
          {
            ddl:{
              gte:new Date(moment(date).subtract(15,'d').format('YYYY-MM-DD HH:mm:ss'))
            }
          },
          {
            ddl:{
              lte:new Date(moment(date).add(45,'d').format('YYYY-MM-DD HH:mm:ss'))
            }
          },
        ]
      },
      include: {
        taskList: true
      }
    }) 
    let resData:CalendarEvent[]=[]
    data.forEach((({ddl,taskList})=>{
      taskList.forEach(({name})=>{
        resData.push({title:name,date:moment(ddl).format('YYYY-MM-DD')})
      })
    }))
    res.send({ code: 200, data: resData })
  } catch (err) {
    console.error(err)
    res.send({ code: 500, message: '获取日历失败' })
  }

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})