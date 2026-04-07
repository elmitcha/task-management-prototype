import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is missing in environment variables');
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const db = new PrismaClient({ adapter });

async function testConnection() {
  try {
    await db.$connect();
    console.log('✅ Connexion à PostgreSQL réussie via Prisma');
  } catch (error) {
    console.error('❌ Échec de la connexion à PostgreSQL:', error);
  }
}

testConnection();
