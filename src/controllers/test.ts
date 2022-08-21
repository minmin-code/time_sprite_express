import { PrismaClient } from '@prisma/client'

const express = require('express')
let router = express.Router();
const prisma = new PrismaClient()

//增
router.post('/user', async (req: any, res: any) => {
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
router.delete('/user/:id', async (req: any, res: any) => {
  const allUsers = await prisma.user.delete({
    where: {
      id: +req.params.id
    },
  })
  res.send({ code: 200, message: '删除成功' })
})
//改
router.put('/user/:id', async (req: any, res: any) => {
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
router.get('/user', async (req: any, res: any) => {
  const allUsers = await prisma.user.findMany({})
  res.send({ code: 200, data: allUsers })
})
//查2
router.get('/user/:id', async (req: any, res: any) => {
  const allUsers = await prisma.user.findMany({
    where: {
      id: +req.params.id
    }
  })
  res.send({ code: 200, data: allUsers })
})

module.exports = router;