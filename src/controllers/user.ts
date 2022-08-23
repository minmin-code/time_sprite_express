import { PrismaClient } from '@prisma/client'
import moment from 'moment'
import {secretKey} from "../constants/common";

var jwt = require('jsonwebtoken');
const express = require('express')
let router = express.Router();
const prisma = new PrismaClient()

router.post('/login', async (req: any, res: any) => {
  console.log('req.body', req.body)
  let token=jwt.sign(req.body, secretKey,{ expiresIn: '10h' })
  res.send({ code: 200, message: '添加成功',data:token })
})

module.exports = router;
