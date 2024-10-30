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

export async function getProvService(id) {
  try {
    const provRepository = AppDataSource.getRepository(Prov);

    const provFound = await provRepository.findOne({
      where: { id },
    });

    if (!provFound) {
      return [null, "Proveedor no encontrado"];
    }

    return [provFound, null];
  } catch (error) {
    console.error("Error al obtener el proveedor:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getProvsService() {
  try {
    const provRepository = AppDataSource.getRepository(Prov);

    const provs = await provRepository.find();

    if (!provs || provs.length === 0) {
      return [null, "No hay proveedores"];
    }

    return [provs, null];
  } catch (error) {
    console.error("Error al obtener los proveedores:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateProvService(id, dataprov) {
  try {
    const provRepository = AppDataSource.getRepository(Prov);

    const provFound = await provRepository.findOne({
      where: { id },
    });

    if (!provFound) {
      return [null, "Proveedor no encontrado"];
    }

    const updatedProv = {
      ...provFound,
      ...dataprov,
    };

    const provUpdated = await provRepository.save(updatedProv);

    return provUpdated;
  } catch (error) {
    console.error("Error al actualizar el proveedor:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteProvService(id) {
  try {
    const provRepository = AppDataSource.getRepository(Prov);

    const provFound = await provRepository.findOne({
      where: { id },
    });

    if (!provFound) {
      return [null, "Proveedor no encontrado"];
    }

    await provRepository.remove(provFound);

    return [null, null];
  } catch (error) {
    console.error("Error al eliminar el proveedor:", error);
    return [null, "Error interno del servidor"];
  }
}