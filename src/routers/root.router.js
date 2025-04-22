import express from "express";
import authRouter from "./auth.router";
const rootRouter = express.Router();
rootRouter.use('/auth', authRouter)
export default rootRouter