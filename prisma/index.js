
const { PrismaClient } = require("@prisma/client");
const { withAccelerate } = require("@prisma/extension-accelerate");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 3,                
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});


const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter }).$extends(withAccelerate());

module.exports = prisma;

// const { PrismaClient } = require("@prisma/client");

// const prisma = new PrismaClient({
//   accelerateUrl: process.env.ACCELERATE_KEY
// }).$extends(withAccelerate());

// module.exports = prisma;
