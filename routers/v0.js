import Router from 'koa-router';
import Auth from '../controllers/v0/auth';

let router = new Router();

router.post('/login', Auth.login);
router.post('/refresh/token', Auth.authRefreshToken);


export default router;