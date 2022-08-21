export default {
  middlewares: ['jwt', 'cors'],
  midleewareConfig: {
    cors: {
      origin: 'http://localhost:8000', //前端地址
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      alloweHeaders: ['Conten-Type', 'Authorization'],
      credentials: true
    }
  }
}




