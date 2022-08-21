import { expressjwt as jwt } from 'express-jwt'

import {secretKey} from "../constants/common";

export default function jwtMiddleware () {
  return jwt({
    secret: secretKey,//密钥
    algorithms: ["HS256"],
    // credentialsRequired: false,
    // getToken: function fromHeaderOrQuerystring(req:any) {
    //   // let token = jsonwebtoken.verify(req.headers.Authorization, 'shhhhh')
    //   // console.log(11,req.headers.Authorization,token)

    //  return req.headers.Authorization
    // },
  }).unless({ path: ["/user/login"] })
}