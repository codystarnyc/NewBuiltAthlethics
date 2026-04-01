import dotenv from 'dotenv';
dotenv.config();

export const env = {
  port: parseInt(process.env.PORT ?? '5000', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  isDev: process.env.NODE_ENV !== 'production',

  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
    region: process.env.AWS_REGION ?? 'us-east-1',
    s3BucketUploads: process.env.S3_BUCKET_UPLOADS ?? 'built-athletics-uploads',
    s3BucketProcessed: process.env.S3_BUCKET_PROCESSED ?? 'built-athletics-processed',
  },

  database: {
    url: process.env.DATABASE_URL ?? '',
  },

  jwt: {
    secret: process.env.JWT_SECRET ?? 'dev-secret-change-me',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  },

  openai: {
    apiKey: process.env.OPENAI_API_KEY ?? '',
  },

  gemini: {
    apiKey: process.env.GEMINI_API_KEY ?? '',
  },

  visionProvider: (process.env.VISION_PROVIDER ?? 'gemini') as 'gemini' | 'openai',

  edamam: {
    appId: process.env.EDAMAM_APP_ID ?? '',
    appKey: process.env.EDAMAM_APP_KEY ?? '',
  },

  backendMasterUrl: process.env.BACKEND_MASTER_URL ?? 'https://builtathletix.com',
} as const;
