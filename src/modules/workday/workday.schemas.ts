import { z } from "zod";

const workerCodeSchema = z
  .string()
  .trim()
  .toUpperCase()
  .min(3, "El código debe tener al menos 3 caracteres")
  .max(30, "El código no puede superar 30 caracteres")
  .regex(/^[A-Z0-9-]+$/, "El código solo permite letras, números y guion");

export const startWorkdaySchema = z.object({
  workerCode: workerCodeSchema,
  workerName: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede superar 100 caracteres")
    .optional(),
});

export const endWorkdaySchema = z.object({
  workerCode: workerCodeSchema,
});

export const statusParamsSchema = z.object({
  workerCode: workerCodeSchema,
});

export type StartWorkdayInput = z.infer<typeof startWorkdaySchema>;
export type EndWorkdayInput = z.infer<typeof endWorkdaySchema>;
