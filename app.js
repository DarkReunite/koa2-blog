import koa from 'koa';
import koaBody from 'koa-body';
import logger from 'koa-logger';
import cors from 'koa2-cors';
import jwt from 'koa-jwt';
import path from 'path';
import router from './routers/index';
import db from './DB/db';
import config from './config';
import { secret, port } from "./config/index";

const app = new koa();

// // logger
// app.use(async (ctx, next) => {
//   await next();
//   const rt = ctx.response.get('X-Response-Time');
//   console.log(`${ctx.method} ${ctx.url} - ${rt}`);
// });

// // x-response-time
// app.use(async (ctx, next) => {
//   const start = Date.now();
//   await next();
//   const ms = Date.now() - start;
//   ctx.set('X-Response-Time', `${ms}ms`);
// });

//捕获jwt的错误码并且加工
app.use(function (ctx, next) {
  return next().catch((err) => {
    if (err.status === 401) {
      ctx.status = 401;
      ctx.body = {
        error: err.originalError ? err.originalError.message : err.message
      };
    } else {
      throw err;
    }
  });
});

app.use(logger());


app.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: 1024*1024*20, //设置可接受的文件最大为20M
    uploadDir: path.join(__dirname, 'uploads'),
  }

}))

// 设置跨域
app.use(cors());

//token拦截器
app.use(jwt({
  secret
}).unless({
  path: /^(?!.*admin).*/ //除了/admin 的API需要认证token，其他的API都不需要认证
}))





router(app);

app.listen(port, () => console.log(`✅  The server is running at http://localhost:${port}/`));
