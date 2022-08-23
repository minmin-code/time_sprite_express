/*
 * @Author: 王敏
 * @LastEditTime: 2022-08-23 11:33:03
 * @Description: file content
 */
import { expressjwt as jwt } from 'express-jwt'

import {secretKey} from "../constants/common";

export default function jwtMiddleware () {
  return jwt({
    secret: secretKey,//密钥
    algorithms: ["HS256"],
  }).unless({ path: ["/user/login"] })
}