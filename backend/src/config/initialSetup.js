"use strict";
import User from "../entity/user.entity.js";
import Expense from "../entity/expense.entity.js";
import Income from "../entity/income.entity.js";
import { AppDataSource } from "./configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";

async function initializeData() {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const expenseRepository = AppDataSource.getRepository(Expense);
    const incomeRepository = AppDataSource.getRepository(Income);

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
      console.log("* => Usuarios ya existen en la base de datos, omitiendo creación de usuarios.");
    }

    const expenseCount = await expenseRepository.count();
    if (expenseCount === 0) {
      await expenseRepository.save(
        expenseRepository.create({
          amount: 500.25,
          description: "Compra de insumos de cocina",
          source: "bar",
        })
      );
      console.log("* => Gasto creado exitosamente");
    } else {
      console.log("* => Gastos ya existen en la base de datos, omitiendo creación de gastos.");
    }

    const incomeCount = await incomeRepository.count();
    if (incomeCount === 0) {
      await incomeRepository.save(
        incomeRepository.create({
          amount: 1000.50,
          description: "Ingreso del bar",
          source: "bar",
        })
      );
      console.log("* => Ingreso creado exitosamente");
    } else {
      console.log("* => Ingresos ya existen en la base de datos, omitiendo creación de ingresos.");
    }

  } catch (error) {
    console.error("Error al inicializar datos:", error);
  }
}

export { initializeData };
