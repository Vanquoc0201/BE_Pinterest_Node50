import express from 'express';
import userController from '../controllers/user.controller';
import protect from '../common/middleware/protect.middleware';

const userRouter = express.Router();

userRouter.post("/", protect, userController.create);
userRouter.get("/",protect, userController.findAll);
userRouter.get("/:id", userController.findOne);
userRouter.put("/:id", protect, userController.update);
userRouter.delete("/:id", protect, userController.remove);
userRouter.get('/saved-image', protect,userController.saveImage);
userRouter.get('/:id/like', protect, userController.getLike);


export default userRouter;