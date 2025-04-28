import express from "express";
import logger from "./src/common/winston/init.winston";
import logApi from "./src/common/morgan/init.morgan";
import cors from "cors";
import { handleError } from "./src/common/helpers/error.helper";
import rootRouter from "./src/routers/root.router";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "https://google.com"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logApi());
app.use(express.static("."));
app.use(rootRouter);
app.use(handleError);

const PORT = 3069;
app.listen(PORT, () => {
  logger.info(`Server online at http://localhost:${PORT}`, { tag: "SERVER" });
});
