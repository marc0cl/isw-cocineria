"use strict";
import { DataSource } from "typeorm";
import { DATABASE, DB_USERNAME, HOST, PASSWORD, PORT } from "./configEnv.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: `${HOST}`,
  port: `${PORT}`,
  username: `${DB_USERNAME}`,
  password: `${PASSWORD}`,
  database: `${DATABASE}`,
  entities: ["src/entity/**/*.js"],
  synchronize: true,
  logging: false,
  ssl: {
      rejectUnauthorized: false,
    }

  });

export async function connectDB() {
  try {
    await AppDataSource.initialize();
    console.log("=> Conexión exitosa a la base de datos!");
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
    process.exit(1);
  }
}