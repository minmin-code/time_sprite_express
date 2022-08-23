/*
 * @Author: 王敏
 * @LastEditTime: 2022-08-23 11:33:54
 * @Description: file content
 */
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