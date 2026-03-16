const parsePort = (value: string | undefined): number => {
  const port = Number(value ?? 4000);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("Invalid PORT value");
  }

  return port;
};

export const env = {
  port: parsePort(process.env.PORT),
};
