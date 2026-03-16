import { Router } from "express";
import { z } from "zod";
import { WorkdayService } from "./workday.service.js";

export const workdayRoutes = Router();

const service = new WorkdayService();

const startSchema = z.object({
  workerCode: z.string().min(3).max(30),
  workerName: z.string().min(2).max(100).optional(),
});

const endSchema = z.object({
  workerCode: z.string().min(3).max(30),
});

const statusParamsSchema = z.object({
  workerCode: z.string().min(3).max(30),
});

workdayRoutes.post("/start", async (req, res, next) => {
  try {
    const input = startSchema.parse(req.body);
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
    const input = endSchema.parse(req.body);
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
