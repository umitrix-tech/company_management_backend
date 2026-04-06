import { defineConfig } from "prisma/config";


console.log(process.env.DATABASE_URL, 'DATABASE_URL');

export default defineConfig({
  schema: "packages/database/prisma/schema.prisma",

  migrate: {
    url: process.env.DATABASE_URL,
  },

  db: {
    url: process.env.DATABASE_URL,
  },
});