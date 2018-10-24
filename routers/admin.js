import Router from 'koa-router';
import Admin from '../controllers/admin/admin';
let router = new Router();


router.post('/upload/file', Admin.receiveFile);
router.post('/upload/info', Admin.receiveMdInfo);
router.post('/update/file', Admin.updateMdFile);

router.get('/remove/article/:id', Admin.removeMdFile);
router.get('/article/list', Admin.getArticleList);

export default router;