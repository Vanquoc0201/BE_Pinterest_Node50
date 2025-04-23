import express from 'express';
import photoController from '../controllers/photo.controller';
import protect from '../common/middleware/protect.middleware';
import uploadLocal from '../common/multer/local.multer';
const photoRouter = express.Router();

// Tạo route CRUD
photoRouter.post('/upload-images',protect,uploadLocal.single("avatar"), photoController.create);
photoRouter.get('/pagination',protect, photoController.findAll);
photoRouter.get('/:id', photoController.findOne);
photoRouter.delete('/:id',protect, photoController.remove);

export default photoRouter;