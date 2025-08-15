const logger = {
  info: (message: string, meta?: any) => console.log(`[info] ${message}`, meta || ''),
  error: (message: string, meta?: any) => console.error(`[error] ${message}`, meta || ''),
};

export const loggerHelpers = {
  system: (message: string, meta?: any) => logger.info(message, meta),
};

export default logger;


