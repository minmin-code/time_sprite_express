/*
 * @Author: 王敏
 * @LastEditTime: 2022-08-23 11:06:40
 * @Description: file content
 */
import { PrismaClient } from '@prisma/client'
import moment from 'moment'

const express = require('express')
let router = express.Router();
const prisma = new PrismaClient()


//修改子任务
router.patch('/', async (req: any, res: any) => {
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

module.exports = router;