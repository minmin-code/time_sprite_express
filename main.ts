import { PrismaClient } from '@prisma/client'

const express = require('express')
const app = express()
const port = 3000
const prisma = new PrismaClient()

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

//增
app.post('/api/user', async (req:any, res:any) => {
  let {name,email}=req.body
  const allUsers = await prisma.user.create({
    data: {name,email},
  })
  res.send({code:200,message:'添加成功'})
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})