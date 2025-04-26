import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../common/swagger/init.swagger";
import authRouter from "./auth.router";
import photoRouter from "./photo.router";
import userRouter from "./user.router";
import likeRouter from "./like.router";
import commentRouter from "./comment.router";

const rootRouter = express.Router();
rootRouter.use("/api-docs", swaggerUi.serve);
rootRouter.get("/api-docs", swaggerUi.setup(swaggerDocument, { swaggerOptions: { persistAuthorization: true } }));
rootRouter.use('/auth', authRouter)
rootRouter.use('/photo' , photoRouter)
rootRouter.use('/user', userRouter)
rootRouter.use('/like', likeRouter)
rootRouter.use('/comment', commentRouter)

export default rootRouter