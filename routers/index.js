import Router from 'koa-router';
import userRouter from './user';
import adminRouter from './admin';
import v0Router from './v0';

let router = new Router();

router.use('/api', userRouter.routes());
router.use('/api/admin', adminRouter.routes());
router.use('/api/v0', v0Router.routes());


export default (app) => {
  app.use(router.routes())
}