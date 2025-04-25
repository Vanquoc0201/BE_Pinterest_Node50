import express from 'express';
import likeController from '../controllers/like.controller';
import protect from '../common/middleware/protect.middleware';
const likeRouter = express.Router();

// Tạo route CRUD
likeRouter.post('/', protect,likeController.like); // User like 1 ảnh
likeRouter.delete('/', protect,likeController.unLike); // User bỏ like 1 ảnh

export default likeRouter;