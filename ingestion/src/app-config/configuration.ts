export const getConfig = (): AppConfig => {
  return {
    port: parseInt(process.env.PORT as string, 10) || 3000,
    appEnv: process.env.APP_ENV as AppEnv,
    database: {
      host: process.env.DB_HOST as string,
      port: parseInt(process.env.DB_PORT as string, 10) || 5432,
      user: process.env.POSTGRES_USER as string,
      password: process.env.POSTGRES_PASSWORD as string,
      dbName: process.env.POSTGRES_DB as string,
    },
    redis: {
      host: process.env.REDIS_HOST as string,
      port: parseInt(process.env.REDIS_PORT as string, 10) || 6379,
      password: process.env.REDIS_PASSWORD as string,
    },
    upload: {
      path: process.env.UPLOAD_PATH as string,
      maxFileSize:
        parseInt(process.env.UPLOAD_MAX_FILE_SIZE as string, 10) || 1024 * 1024,
    },
  };
};

export interface AppConfig {
  port: number;
  appEnv: AppEnv;
  database: DbConfig;
  redis: RedisConfig;
  upload: UploadConfig;
}

export enum AppEnv {
  DEV = 'dev',
  TEST = 'test',
  PROD = 'production',
}

export interface DbConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  dbName: string;
}

export interface RedisConfig {
  host: string;
  port: number;
  password: string;
}

export interface JwtConfig {
  expiry: string;
  secret: string;
}

export interface UploadConfig {
  path: string;
  maxFileSize: number;
}
