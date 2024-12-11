"user strict";
import Product from"../entity/product.entity.js";
import { AppDataSource } from "../config/configDb.js"; 

export async function getProductService(query) {
    try {
        const { nombreProducto } = query;

        const productRepository = AppDataSource.getRepository(Product);

        const productFound = await productRepository.findOne({
            where: { nombreProducto: nombreProducto },
        });
        if (!productFound) return [null, "producto no encontrado"];
        return [productFound, null];

    } catch (error) {
        console.error("Error al obtener el producto:", error);
        return [null, "error interno del servidor"];
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
    const { nombreProducto } = query;  // Buscamos el producto por nombreProducto
    const productRepository = AppDataSource.getRepository(Product);

    if (!nombreProducto) {
      return [null, "El nombre del producto es requerido para actualizar el producto"];
    }

    // Buscar el producto por nombreProducto
    const productFound = await productRepository.findOne({
      where: { nombreProducto },
    });

    if (!productFound) {
      return [null, "Producto no encontrado"];
    }

    // Función para determinar el estado del producto según el stock
    const getProductStatus = (cantidadProducto) => {
      if (cantidadProducto > 50) {
        return 'excelente'; // Si hay más de 50 unidades, el estado es 'excelente'
      } else if (cantidadProducto <= 50 && cantidadProducto > 10) {
        return 'estable'; // Si hay entre 10 y 50 unidades, el estado es 'estable'
      } else {
        return 'critico'; // Si hay 10 o menos unidades, el estado es 'critico'
      }
    };

    // Crear el objeto de datos para la actualización
    const dataProductUpdate = {
      stock: body.stock !== undefined ? body.stock : productFound.stock,  // Solo actualizar el stock
      estado: body.stock !== undefined ? getProductStatus(body.stock) : productFound.estado,  // Actualiza el estado basado en el nuevo stock
      updatedAt: new Date(),  
    };

    await productRepository.update({ nombreProducto }, dataProductUpdate);

    
    const updatedProduct = await productRepository.findOne({
      where: { nombreProducto },
    });

    return [updatedProduct, null];
  } catch (error) {
    console.error("Error al modificar el producto:", error);
    return [null, "Error interno del servidor"];
  }
}


export async function deleteProductService(query) {
  try {
      const { nombreProducto } = query;

      const productRepository = AppDataSource.getRepository(Product);

      const productFound = await productRepository.findOne({
          where: { nombreProducto: nombreProducto },
      });

      if (!productFound) return [null, "Producto no encontrado"];

      const productDeleted = await productRepository.remove(productFound);

      return [productDeleted, null];
  } catch (error) {
      console.error("Error al eliminar el producto:", error);
      return [null, "Error interno del servidor"];
  }
}





function generateCodigoIdentificador() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const length = 20; // Longitud del codigoIdentificador
  for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
  }
  return result;
}


export async function createProductService(productData) {
  try {
    const productRepository = AppDataSource.getRepository(Product);
    const { nombreProducto, cantidadProducto, fechaDeCaducidad, tipoDeProducto, estado } = productData;

    const createErrorMessage = (dataInfo, message) => ({
      dataInfo,
      message,
    });

    // Generar el codigoIdentificador automáticamente
    const codigoIdentificador = generateCodigoIdentificador();

    const existingProduct = await productRepository.findOne({
      where: { codigoIdentificador },
    });
    if (existingProduct) {
      return [null, createErrorMessage("codigoIdentificador", "Código identificador en uso")];
    }

    // Asignar stock igual a cantidadProducto y estado predeterminado si no se proporciona
    const newProduct = productRepository.create({
      codigoIdentificador,
      nombreProducto,
      cantidadProducto,
      stock: cantidadProducto,  // Asigna 'stock' igual a 'cantidadProducto'
      estado: estado || 'excelente',  // Si no se pasa 'estado', se asigna 'excelente'
      fechaDeCaducidad,
      tipoDeProducto,
    });

    // Guardamos el nuevo producto en la base de datos
    await productRepository.save(newProduct);

    return [newProduct, null];
  } catch (error) {
    console.error("Error al crear el producto:", error);
    return [null, "Error interno del servidor"];
  }
}
