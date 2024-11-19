"use strict";
import User from "../entity/user.entity.js";
import Transaction from "../entity/transaction.entity.js";
import { AppDataSource } from "./configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";

async function initializeData() {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const transactionRepository = AppDataSource.getRepository(Transaction);

    // Crear usuarios si no existen
    const userCount = await userRepository.count();
    if (userCount === 0) {
      await Promise.all([
        userRepository.save(
          userRepository.create({
            nombreCompleto: "Diego Alexis Salazar Jara",
            rut: "21.308.770-3",
            email: "administrador2024@gmail.cl",
            password: await encryptPassword("admin1234"),
            rol: "administrador",
          })
        ),
        userRepository.save(
          userRepository.create({
            nombreCompleto: "Diego Sebastián Ampuero Belmar",
            rut: "21.151.897-9",
            email: "usuario1.2024@gmail.cl",
            password: await encryptPassword("user1234"),
            rol: "usuario",
          })
        ),
      ]);
      console.log("* => Usuarios creados exitosamente");
    } else {
      console.log(
        "* => Usuarios ya existen en la base de datos, omitiendo creación de usuarios."
      );
    }

    // Crear transacciones si no existen
    const transactionCount = await transactionRepository.count();
    if (transactionCount === 0) {
      await Promise.all([
        transactionRepository.save(
          transactionRepository.create({
            amount: 1200.50,
            description: "Venta de bebidas en el bar",
            source: "bar",
            type: "income",
          })
        ),
        transactionRepository.save(
          transactionRepository.create({
            amount: 2000.00,
            description: "Ingreso por eventos especiales",
            source: "otros",
            type: "income",
          })
        ),
        transactionRepository.save(
          transactionRepository.create({
            amount: 800.75,
            description: "Compra de ingredientes para la cocina",
            source: "cocina",
            type: "expense",
          })
        ),
        transactionRepository.save(
          transactionRepository.create({
            amount: 600.00,
            description: "Pago a proveedores de bebidas",
            source: "proveedor",
            type: "expense",
          })
        ),
      ]);
      console.log("* => Transacciones creadas exitosamente");
    } else {
      console.log(
        "* => Transacciones ya existen en la base de datos, omitiendo creación de transacciones."
      );
    }
  } catch (error) {
    console.error("Error al inicializar datos:", error);
  }
}

export { initializeData };
