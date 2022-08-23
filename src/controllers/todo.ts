import { PrismaClient } from '@prisma/client'
import moment from 'moment'

const express = require('express')
let router = express.Router();
const prisma = new PrismaClient()

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
// 获取日历
router.get('/calendar', async (req: any, res: any) => {
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
//新增待办
router.post('/', async (req: any, res: any) => {
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
// 获取待办
router.get('/', async (req: any, res: any) => {
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
//获取待办详情
router.get('/:id', async (req: any, res: any) => {
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
//修改待办(有问题，删了的任务没用)
router.put('/', async (req: any, res: any) => {
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

module.exports = router;