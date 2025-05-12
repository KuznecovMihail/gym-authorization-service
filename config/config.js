const path = require("path");
const { config } = require("dotenv");

const envFile =
  process.env.NODE_ENV === "production"
    ? ".production.env"
    : ".development.env";

config({ path: path.resolve(__dirname, "..", envFile) });

module.exports = {
  development: {
    dialect: "postgres",
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  },
  production: {
    dialect: "postgres",
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  },
};
