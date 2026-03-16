import express from "express";
import cors from "cors";
import { workdayRoutes } from "./modules/workday/workday.routes.js";
import { notFoundHandler } from "./shared/middlewares/not-found.js";
import { errorHandler } from "./shared/middlewares/error-handler.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "API base operativa",
  });
});

app.use("/api/workdays", workdayRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
