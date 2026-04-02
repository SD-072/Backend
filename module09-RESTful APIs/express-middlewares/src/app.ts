import express from "express";
import "#db";
import { userRouter, postRouter } from "#routes";
import { logger, errorHandler } from "#middlewares";

const app = express();
const port = 3000;

app.use(express.json());

app.use(logger);

app.get("/", logger, logger, logger, (req, res) => {
  res.send("hello world");
});

app.get("/test", (req, res, next) => {
  res.send("hello world");
});

app.use("/users", userRouter);
app.use("/posts", postRouter);

app.use("*splat", (req, res, next) => {
  throw new Error("Not Found", { cause: { status: 404 } });
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
