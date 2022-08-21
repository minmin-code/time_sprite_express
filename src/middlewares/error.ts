import { ErrorRequestHandler } from 'express'

export default function CORS (): ErrorRequestHandler {
  return (err, req, res, next) => {
    console.log('get', err)

    if (err.name === 'UnauthorizedError') {
      // 这个需要根据⾃自⼰己的业务逻辑来处理理
      res.status(401).send({code:-1,msg:'token验证失败'});
    }else {
      // set locals, only providing error in development
      res.locals.message = err.message
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      // render the error page
      res.status(err.status || 500)
      res.render('error')
    }
  }
}