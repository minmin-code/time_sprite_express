import { PrismaClient } from '@prisma/client'
import moment from 'moment'

const express = require('express')
let router = express.Router();
const prisma = new PrismaClient()

interface CalendarEvent{
  title:string,
  date:string
}
/**
 * 日历模块
 */
router.get('/calendar/getCalendarEvents', async (req: any, res: any) => {
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

module.exports = router;