import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../shared/errors/AppError.js";
import { toColombiaDateTime } from "../../shared/utils/datetime.js";

type StartWorkdayInput = {
  workerCode: string;
  workerName?: string | undefined;
};

type EndWorkdayInput = {
  workerCode: string;
};

const calculateSeconds = (start: Date, end: Date): number => {
  const diffMs = end.getTime() - start.getTime();
  return Math.max(0, Math.floor(diffMs / 1000));
};

const toWorkdayResponse = (workday: {
  id: number;
  workerId: number;
  startTime: Date;
  endTime: Date | null;
  totalSeconds: number | null;
}) => ({
  id: workday.id,
  workerId: workday.workerId,
  startTime: toColombiaDateTime(workday.startTime),
  endTime: toColombiaDateTime(workday.endTime),
  totalSeconds: workday.totalSeconds,
});

export class WorkdayService {
  async start(input: StartWorkdayInput) {
    const workerCode = input.workerCode.trim();
    const workerName = input.workerName?.trim();

    let worker = await prisma.worker.findUnique({ where: { code: workerCode } });

    if (!worker) {
      worker = await prisma.worker.create({
        data: {
          code: workerCode,
          name: workerName && workerName.length > 0 ? workerName : `Trabajador ${workerCode}`,
        },
      });
    }

    const activeWorkday = await prisma.workday.findFirst({
      where: {
        workerId: worker.id,
        endTime: null,
      },
      orderBy: {
        startTime: "desc",
      },
    });

    if (activeWorkday) {
      throw new AppError("El trabajador ya tiene una jornada activa.", 409, "ACTIVE_WORKDAY_EXISTS");
    }

    const workday = await prisma.workday.create({
      data: {
        workerId: worker.id,
        startTime: new Date(),
      },
    });

    return {
      worker: {
        id: worker.id,
        code: worker.code,
        name: worker.name,
      },
      workday: toWorkdayResponse(workday),
    };
  }

  async end(input: EndWorkdayInput) {
    const workerCode = input.workerCode.trim();

    const worker = await prisma.worker.findUnique({ where: { code: workerCode } });

    if (!worker) {
      throw new AppError("No existe un trabajador con ese código.", 404, "WORKER_NOT_FOUND");
    }

    const activeWorkday = await prisma.workday.findFirst({
      where: {
        workerId: worker.id,
        endTime: null,
      },
      orderBy: {
        startTime: "desc",
      },
    });

    if (!activeWorkday) {
      throw new AppError("No hay una jornada activa para terminar.", 409, "ACTIVE_WORKDAY_NOT_FOUND");
    }

    const endTime = new Date();
    const totalSeconds = calculateSeconds(activeWorkday.startTime, endTime);

    const workday = await prisma.workday.update({
      where: {
        id: activeWorkday.id,
      },
      data: {
        endTime,
        totalSeconds,
      },
    });

    return {
      worker: {
        id: worker.id,
        code: worker.code,
        name: worker.name,
      },
      workday: toWorkdayResponse(workday),
    };
  }

  async status(workerCode: string) {
    const worker = await prisma.worker.findUnique({ where: { code: workerCode.trim() } });

    if (!worker) {
      throw new AppError("No existe un trabajador con ese código.", 404, "WORKER_NOT_FOUND");
    }

    const activeWorkday = await prisma.workday.findFirst({
      where: {
        workerId: worker.id,
        endTime: null,
      },
      orderBy: {
        startTime: "desc",
      },
    });

    if (!activeWorkday) {
      return {
        isActive: false,
        startTime: null,
        elapsedSeconds: 0,
      };
    }

    return {
      isActive: true,
      startTime: toColombiaDateTime(activeWorkday.startTime),
      elapsedSeconds: calculateSeconds(activeWorkday.startTime, new Date()),
    };
  }
}
