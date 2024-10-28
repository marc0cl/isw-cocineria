"use strict";
import Prov from "../entity/prov.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function createProvService(dataprov) {
  try {
    const provRepository = AppDataSource.getRepository(Prov);

    const newProv = {
        nombre: dataprov.nombre,
        email: dataprov.email,
        telefono: dataprov.telefono,
        direccion: dataprov.direccion,
        medioPago: dataprov.medioPago,
        productos: dataprov.productos
    }

    const provSaved = await provRepository.save(newProv);

    return provSaved;
  } catch (error) {
    console.error("Error al crear el proveedor:", error);
    return [null, "Error interno del servidor"];
  }
}

