const cors = require('cors')

export default function CORS () {
  return cors({
    origin: 'http://localhost:8000', //前端地址
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    alloweHeaders: ['Conten-Type', 'Authorization'],
    credentials: true
  })
}