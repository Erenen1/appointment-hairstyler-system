export interface Config {
  NODE_ENV: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_USER: string;
  DB_PASSWORD: string;
  PORT: number;
  JWT_SECRET: string;
  SUPER_ADMIN_API_KEY: string;
  SMTP_HOST: string;
  SMTP_PORT: number;
  SMTP_USER: string;
  SMTP_PASS: string;
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX_REQUESTS: number;
  DOMAIN: string;
  FRONTEND_DOMAIN: string;
  LOG_LEVEL: string;
  JWT_EXPIRES_IN: string;
  UPLOAD_DIR: string;
}

export interface LogConfig {
  level: string;
  format: string;
  directory: string;
} 