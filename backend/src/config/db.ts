import { PrismaClient } from '@prisma/client';

const realPrisma = new PrismaClient();
let dbConnected = false;

realPrisma.$connect()
  .then(() => {
    dbConnected = true;
    console.log('[DATABASE] PostgreSQL connected successfully via Prisma Client');
  })
  .catch((err) => {
    dbConnected = false;
    console.error('[DATABASE ERROR] Failed to connect to PostgreSQL. Gracefully switching to In-Memory database fallback.', err.message);
  });

// Simple In-Memory DB
const memoryDb: Record<string, any[]> = {};

const matchRelation = (relationName: string, modelName: string) => {
  const rel = relationName.toLowerCase();
  const mod = modelName.toLowerCase();
  return rel === mod ||
         rel === mod + 's' ||
         rel + 's' === mod ||
         rel === mod.replace(/y$/, 'ies') ||
         rel.replace(/ies$/, 'y') === mod;
};

// Helper to simulate prisma methods
const createMockCollection = (modelName: string) => {
  if (!memoryDb[modelName]) {
    memoryDb[modelName] = [];
  }
  const collection = memoryDb[modelName];

  return {
    findUnique: async (args: any) => {
      const { where } = args;
      const key = Object.keys(where)[0];
      const val = where[key];
      const record = collection.find(item => item[key] === val);
      if (!record) return null;
      // Handle includes if any
      if (args.include) {
        const copy = { ...record };
        Object.keys(args.include).forEach(relation => {
          if (args.include[relation]) {
            const targetCollectionName = Object.keys(memoryDb).find(k => matchRelation(relation, k));
            if (targetCollectionName) {
              const relatedItems = memoryDb[targetCollectionName].filter(
                (item: any) => item.organizationId === record.id || item.organizationId === record.organizationId
              );
              const isOneToOne = relation === 'businessProfile' || relation === 'kpiMetrics' || relation === 'kpiMetrics';
              copy[relation] = isOneToOne ? (relatedItems[0] || null) : relatedItems;
            } else {
              const isOneToOne = relation === 'businessProfile' || relation === 'kpiMetrics';
              copy[relation] = isOneToOne ? null : [];
            }
          }
        });
        return copy;
      }
      return record;
    },
    findUniqueOrThrow: async (args: any) => {
      const { where } = args;
      const key = Object.keys(where)[0];
      const val = where[key];
      const record = collection.find(item => item[key] === val);
      if (!record) throw new Error(`Record not found in mock collection: ${modelName}`);
      return record;
    },
    findFirst: async (args: any) => {
      const { where } = args;
      if (!where) return collection[0] || null;
      const keys = Object.keys(where);
      const record = collection.find(item => keys.every(key => item[key] === where[key]));
      return record || null;
    },
    findMany: async (args: any) => {
      if (!args || !args.where) return collection;
      const { where } = args;
      const keys = Object.keys(where);
      return collection.filter(item => keys.every(key => item[key] === where[key]));
    },
    create: async (args: any) => {
      const { data } = args;
      const id = data.id || Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const record = { id, createdAt: new Date(), updatedAt: new Date(), ...data };
      
      // Handle nested creates
      if (data.kpiMetrics?.create) {
        const kpi = { id: Math.random().toString(36).substring(2, 15), organizationId: id, createdAt: new Date(), updatedAt: new Date() };
        if (!memoryDb['kPIMetrics']) memoryDb['kPIMetrics'] = [];
        memoryDb['kPIMetrics'].push(kpi);
        record.kpiMetrics = kpi;
      }

      collection.push(record);
      return record;
    },
    update: async (args: any) => {
      const { where, data } = args;
      const key = Object.keys(where)[0];
      const val = where[key];
      const idx = collection.findIndex(item => item[key] === val);
      if (idx === -1) throw new Error(`Record not found in mock update: ${modelName}`);
      collection[idx] = { ...collection[idx], ...data, updatedAt: new Date() };
      return collection[idx];
    },
    upsert: async (args: any) => {
      const { where, update, create } = args;
      const key = Object.keys(where)[0];
      const val = where[key];
      let idx = -1;
      if (key.includes('_')) {
        const subKeys = Object.keys(where[key]);
        idx = collection.findIndex(item => subKeys.every(sk => item[sk] === where[key][sk]));
      } else {
        idx = collection.findIndex(item => item[key] === val);
      }

      if (idx !== -1) {
        collection[idx] = { ...collection[idx], ...update, updatedAt: new Date() };
        return collection[idx];
      } else {
        const id = Math.random().toString(36).substring(2, 15);
        const record = { id, createdAt: new Date(), updatedAt: new Date(), ...create };
        collection.push(record);
        return record;
      }
    },
    delete: async (args: any) => {
      const { where } = args;
      const key = Object.keys(where)[0];
      const val = where[key];
      const idx = collection.findIndex(item => item[key] === val);
      if (idx === -1) throw new Error(`Record not found in mock delete: ${modelName}`);
      const deleted = collection.splice(idx, 1)[0];
      return deleted;
    },
    deleteMany: async (args: any) => {
      if (!args || !args.where) {
        const count = collection.length;
        collection.length = 0;
        return { count };
      }
      const { where } = args;
      const keys = Object.keys(where);
      let count = 0;
      for (let i = collection.length - 1; i >= 0; i--) {
        if (keys.every(key => collection[i][key] === where[key])) {
          collection.splice(i, 1);
          count++;
        }
      }
      return { count };
    },
  };
};

const mockPrisma = new Proxy({}, {
  get(target, prop) {
    if (prop === '$connect') return async () => {};
    if (prop === '$disconnect') return async () => {};
    const modelName = prop as string;
    return createMockCollection(modelName);
  }
});

export const prisma = new Proxy(realPrisma, {
  get(target, prop) {
    if (prop === '$connect' || prop === '$disconnect') {
      return realPrisma[prop].bind(realPrisma);
    }
    if (dbConnected) {
      const val = realPrisma[prop as keyof typeof realPrisma];
      return typeof val === 'function' ? (val as Function).bind(realPrisma) : val;
    } else {
      return mockPrisma[prop as keyof typeof mockPrisma];
    }
  }
}) as unknown as PrismaClient;
