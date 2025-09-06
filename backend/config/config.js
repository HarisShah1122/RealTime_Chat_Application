export default {
  port: process.env.PORT || 8081,
  db: {
    name: process.env.DB_NAME || "chat_app",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "medimpact_mysql_user",
    host: process.env.DB_HOST || "localhost",
    dialect: process.env.DB_DIALECT || "mysql",
    port: process.env.DB_PORT || 3306,
  },
  jwtSecret: process.env.JWT_SECRET || "8Kj9mPq2v",
};
