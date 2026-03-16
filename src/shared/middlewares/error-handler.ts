import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/AppError.js";

export const errorHandler = (error: unknown, _req: Request, res: Response, _next: NextFunction): void => {
  if (error instanceof ZodError) {
    res.status(400).json({
      message: "Datos inválidos",
      code: "VALIDATION_ERROR",
      details: error.issues,
    });
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      message: error.message,
      code: error.code,
    });
    return;
  }

  res.status(500).json({
    message: "Error interno del servidor",
    code: "INTERNAL_SERVER_ERROR",
  });
};
