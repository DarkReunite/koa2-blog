import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import accountModel from '../../models/account';
import { secret } from "../../config/index";

class V0 {
  constructor(){
    this.login = this.login.bind(this);

    this.authRefreshToken = this.authRefreshToken.bind(this);
  }

  //对密码进行MD5加密
  MD5(password){
    const md5 = crypto.createHash('md5');
    return md5.update(password).digest('hex');
  }


  async login(ctx){
    //获取username和password
    //查询数据库是否存在该账号和密码
    //存在则返回token

    let username = ctx.request.body.username;
    let password = ctx.request.body.password;
    console.log(username);
    console.log(password);
    

    try {
      let account = await accountModel.findOne({username});

      if (!account) {
        ctx.body = {
          status: 0,
          message: '账号或密码错误'
        }
        return;
      }

      //将密码转换成MD5值
      let newpassword = this.MD5(password);

      //当密码不正确时
      if (account.password != newpassword) {
        ctx.status = 403
        ctx.message = 'Incorrect username or password'
        return;
      }

      //密码正确时
      //1.生成token
      //2.返回token给前端
      const payload = {
        username,
      }

      // 签发Token
      const token = jwt.sign(payload, secret, {expiresIn: '1h'});
      const refresh_token = jwt.sign(payload, secret, {expiresIn: '2h'});

      ctx.body = {
        token,
        refresh_token
      }

    } catch (error) {
      ctx.status = 500;
      ctx.message = error;
    }

  }

  // async authToken(ctx) {
  //   let token = ctx.request.header.authorization;

    
  //   try {
  //     let payload = await jwt.verify(token, secret);
  //     ctx.body = {
  //       status: 1,
  //       message: 'success'
  //     }
      
  //   } catch (error) {
  //     console.log(error.message);
      
  //     if(error.message == 'jwt expired'){
  //       ctx.status = 406
  //       ctx.message = 'token expired'
  //     }
      
  //     if (error.message == 'invalid signature') {
  //       ctx.status = 403
  //     }
      
  //   }
  // }

  async authRefreshToken(ctx){
    let refreshToken = ctx.request.body.refresh_token;

   
    
    try {
      let decoded = await jwt.verify(refreshToken, secret);

      const payload = {
        username:decoded.username
      }
      //refresh_token未过期，返回新创建的token和refresh_token
      // 签发Token
      const token = jwt.sign(payload, secret, {expiresIn: '1h'});
      const refresh_token = jwt.sign(payload, secret, {expiresIn: '2h'});
      ctx.body = {
        token,
        refresh_token
      }

    } catch (error) {
      console.log(error.message);
      if(error.message == 'jwt expired'){
        ctx.status = 406;
        ctx.message = 'refresh_token expired';
        return;
      }

      if (error.message == 'invalid signature') {
        ctx.status = 406
      }

      
    }
  }
}

export default new V0();