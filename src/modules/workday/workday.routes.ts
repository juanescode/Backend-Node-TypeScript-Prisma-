import { Router } from "express";

export const workdayRoutes = Router();

workdayRoutes.post("/start", (_req, res) => {
  res.status(501).json({
    message: "Pendiente implementación de iniciar jornada",
    code: "NOT_IMPLEMENTED",
  });
});

workdayRoutes.post("/end", (_req, res) => {
  res.status(501).json({
    message: "Pendiente implementación de terminar jornada",
    code: "NOT_IMPLEMENTED",
  });
});

workdayRoutes.get("/status/:workerCode", (_req, res) => {
  res.status(501).json({
    message: "Pendiente implementación de estado de jornada",
    code: "NOT_IMPLEMENTED",
  });
});
