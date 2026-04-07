import * as dotenv from 'dotenv';
import { type PrismaConfig } from 'prisma/config';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in .env file');
}

export default {
  datasource: {
    url: process.env.DATABASE_URL,
  },
} satisfies PrismaConfig;
