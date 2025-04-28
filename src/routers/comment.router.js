import express from "express";
import { commentController } from "../controllers/comment.controller";
import protect from "../common/middleware/protect.middleware";

const commentRouter = express.Router();

// Tạo route CRUD
commentRouter.post("/",protect, commentController.create);
commentRouter.get("/",protect, commentController.findAll);
commentRouter.get("/:id", commentController.findOne);
commentRouter.put("/:id",protect, commentController.update);
commentRouter.delete("/:id",protect, commentController.remove);

export default commentRouter;
