 import express, { Application } from 'express'

export function registeMiddlewares (app: Application) {
  [
    require('./cors'),
    () => express.json(),
    () => express.urlencoded({ extended: true }),
    require('./jwt'),
    require('./error'),
  ].forEach((fn,index) =>{
    app.use(fn.default ? fn.default() : fn())
  } )
}