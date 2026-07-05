import { PrismaClient } from '@prisma/client';

// Singleton instance of Prisma Client to prevent connection leaks
export const prisma = new PrismaClient();

// Connect on start
prisma.$connect()
  .then(() => {
    console.log('[DATABASE] PostgreSQL connected successfully via Prisma Client');
  })
  .catch((err) => {
    console.error('[DATABASE ERROR] Failed to connect to PostgreSQL:', err.message);
  });
