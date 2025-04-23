import express from "express";
import authRouter from "./auth.router";
import photoRouter from "./photo.router";
const rootRouter = express.Router();
rootRouter.use('/auth', authRouter)
rootRouter.use('/photo' , photoRouter)
export default rootRouter