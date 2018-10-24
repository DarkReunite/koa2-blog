import Router from 'koa-router';
import User from '../controllers/user/user';

let router = new Router();

router.get('/', ctx => {
  ctx.body = "hello world"
})

router.get('/page/:page', User.getSummary);
router.get('/get/total/page', User.getTotalPage);
router.get('/article/:id', User.getArticle);

export default router;