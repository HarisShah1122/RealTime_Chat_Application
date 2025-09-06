import { Sequelize } from "sequelize";
import config from "./config.js";

const sequelize = new Sequelize(
  config.db.name,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    dialect: config.db.dialect,
    port: config.db.port,
    logging: false,
  }
);

try {
  await sequelize.authenticate();
  console.log("Database connected successfully.");
} catch (err) {
  console.error("Unable to connect to the database:", err);
  process.exit(1);
}

export default sequelize;
