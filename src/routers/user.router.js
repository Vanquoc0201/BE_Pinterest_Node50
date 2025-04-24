import express from 'express';
import userController from '../controllers/user.controller';
import protect from '../common/middleware/protect.middleware';
const userRouter = express.Router();



userRouter.get('/saved-image', protect,userController.saveImage);


export default userRouter;