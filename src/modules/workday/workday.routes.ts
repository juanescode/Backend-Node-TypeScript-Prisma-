import { Router } from "express";
import { WorkdayService } from "./workday.service.js";
import { endWorkdaySchema, startWorkdaySchema, statusParamsSchema } from "./workday.schemas.js";

export const workdayRoutes = Router();

const service = new WorkdayService();

workdayRoutes.post("/start", async (req, res, next) => {
  try {
    const input = startWorkdaySchema.parse(req.body);
    const data = await service.start(input);

    res.status(201).json({
      message: "Jornada iniciada",
      data,
    });
  } catch (error) {
    next(error);
  }
});

workdayRoutes.post("/end", async (req, res, next) => {
  try {
    const input = endWorkdaySchema.parse(req.body);
    const data = await service.end(input);

    res.status(200).json({
      message: "Jornada finalizada",
      data,
    });
  } catch (error) {
    next(error);
  }
});

workdayRoutes.get("/status/:workerCode", async (req, res, next) => {
  try {
    const params = statusParamsSchema.parse(req.params);
    const data = await service.status(params.workerCode);

    res.status(200).json({
      message: "Estado consultado",
      data,
    });
  } catch (error) {
    next(error);
  }
});
