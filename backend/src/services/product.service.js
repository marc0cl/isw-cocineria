"user strict";
import Product from"../entity/product.entity.js";
import { AppDataSource } from "../config/configDb.js"; 

export async function getProductService(query) {
    try {
        const { id, codigoIdentificador } = query;

        const productRepository = AppDataSource.getRepository(Product);

        const productFound = await productRepository.findOne({
            where: [{ id:id }, {codigoIdentificador: codigoIdentificador}],
        });
        if (!productFound) return [null , "producto no encontrado"];
        return [productFound, null];

    } catch (error) {
        console.error("Error al obtener el producto:", error);
        return[null, "error interno del servidor "];
    }
}

export async function getProductsService() {
    try {
        const productRepository = AppDataSource.getRepository(Product);
        const products = await productRepository.find();
        if (!products || products.length === 0) return [null, "no hay productos "];
        return[products, null]; 
    } catch (error) {
        console.error("error al obtener los productos", error);
        return[null, "error interno del servidor"];
    }
}
export async function updateProductService(query, body) {
  try {
    const { codigoIdentificador } = query; // Solo usamos el codigoIdentificador para encontrar el producto
    const productRepository = AppDataSource.getRepository(Product);

    if (!codigoIdentificador) {
      return [null, "El código identificador es requerido para actualizar el producto"];
    }

    // Buscar el producto por codigoIdentificador
    const productFound = await productRepository.findOne({
      where: { codigoIdentificador },
    });

    if (!productFound) {
      return [null, "Producto no encontrado"];
    }

    // Validar que el codigoIdentificador no se esté intentando modificar
    if (body.codigoIdentificador && body.codigoIdentificador !== codigoIdentificador) {
      return [null, "No se permite cambiar el código identificador"];
    }

    // Crear el objeto de datos para la actualización (sin incluir codigoIdentificador)
    const dataProductUpdate = {
      nombreProducto: body.nombreProducto || productFound.nombreProducto,
      cantidadProducto: body.cantidadProducto || productFound.cantidadProducto,
      fechaDeCaducidad: body.fechaDeCaducidad || productFound.fechaDeCaducidad,
      tipoDeProducto: body.tipoDeProducto || productFound.tipoDeProducto,
      updatedAt: new Date(), // Marca el tiempo de la actualización
    };

    // Actualizar el producto
    await productRepository.update({ codigoIdentificador }, dataProductUpdate);

    // Retornar el producto actualizado
    const updatedProduct = await productRepository.findOne({
      where: { codigoIdentificador },
    });
    
    return [updatedProduct, null];
  } catch (error) {
    console.error("Error al modificar el producto:", error);
    return [null, "Error interno del servidor"];
  }
}


export async function deleteProductService(query) {
    try {
      const { id, codigoIdentificador } = query;
  
      const productRepository = AppDataSource.getRepository(Product);
  
      const productFound = await productRepository.findOne({
        where: [{ id: id }, { codigoIdentificador: codigoIdentificador }],
      });
  
      if (!productFound) return [null, "Producto no encontrado"];
  
      const productDeleted = await productRepository.remove(productFound);
  
      return [productDeleted, null];
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      return [null, "Error interno del servidor"];
    }
  }

export async function createProductService(productData) {
  try {
    const productRepository = AppDataSource.getRepository(Product);
    const { codigoIdentificador, nombreProducto, cantidadProducto, fechaDeCaducidad, tipoDeProducto } = productData;

    const createErrorMessage = (dataInfo, message) => ({
      dataInfo,
      message,
    });

    const existingProduct = await productRepository.findOne({
      where: { codigoIdentificador },
    });
    if (existingProduct) {
      return [null, createErrorMessage("codigoIdentificador", "Código identificador en uso")];
    }

    const newProduct = productRepository.create({
      codigoIdentificador,
      nombreProducto,
      cantidadProducto,
      fechaDeCaducidad,
      tipoDeProducto,
    });

    await productRepository.save(newProduct);

    return [newProduct, null];
  } catch (error) {
    console.error("Error al crear el producto:", error);
    return [null, "Error interno del servidor"];
  }
}