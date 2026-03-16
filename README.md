Backend para registrar la jornada laboral de un trabajador:



## 1) Instalacion

En git
```bash
git clone https://github.com/juanescode/Backend-Node-TypeScript-Prisma-.git
```

En la terminal 
```bash
npm install
npm run prisma:migrate -- --name init_local
npm run prisma:generate
npm run dev
```

Ruta 
- `http://localhost:4000`

## 2) Variables de entorno

Archivo `.env`:

```env
PORT=4000
DATABASE_URL="postgresql://postgres:8323@localhost:5434/workDay1?schema=public"
```

## 3) Rutas principales

Base URL: `http://localhost:4000`

- `GET /health`
  - Para validar que el backend está arriba.

- `POST /api/workdays/start`
  - Inicia jornada.
  - Body ejemplo:

```json
{
  "workerCode": "EMP-001",
  "workerName": "Juan Perez"
}
```

- `POST /api/workdays/end`
  - Termina jornada.
  - Body ejemplo:

```json
{
  "workerCode": "EMP-001"
}
```

- `GET /api/workdays/status/:workerCode`
  - Consulta si el trabajador tiene jornada activa.
  - Ejemplo: `GET /api/workdays/status/EMP-001`

## 4) Errores

- `409 ACTIVE_WORKDAY_EXISTS`: ya tenía una jornada activa.
- `409 ACTIVE_WORKDAY_NOT_FOUND`: intentaste cerrar sin jornada activa.
- `404 WORKER_NOT_FOUND`: no existe ese trabajador.
- `400 VALIDATION_ERROR`: body o parámetros inválidos.

## 5) Diagrama de entidad y relación
<img width="1402" height="710" alt="image" src="https://github.com/user-attachments/assets/dd8a15d3-a291-44ea-8ad5-4f159f073efa" />

