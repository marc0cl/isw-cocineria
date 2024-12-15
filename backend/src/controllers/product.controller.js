"use strict";
import {
  checkAvailabilityService,
  createProductService,
  deleteProductService,
  getCriticalProductsService,
  getProductService,
  getProductsService,
  updateProductService,
  updateStockService
} from "../services/product.service.js";
import {
  productBodyUpdateValidation,
  productBodyValidation,
  productQueryValidation,
} from "../validations/product.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

// Obtener un producto
export async function getProduct(req, res) {
  try {
    const { id, codigoIdentificador } = req.query;
    const { error } = productQueryValidation.validate({ id, codigoIdentificador });

    if (error) return handleErrorClient(res, 400, error.message);

    const [product, errorProduct] = await getProductService({ id, codigoIdentificador });

    if (errorProduct) return handleErrorClient(res, 404, errorProduct);

    handleSuccess(res, 200, "Producto encontrado", product);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Obtener todos los productos
export async function getProducts(req, res) {
  try {
    const [products, errorProducts] = await getProductsService();

    if (errorProducts) return handleErrorClient(res, 404, errorProducts);

    products.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Productos encontrados", products);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Obtener productos críticos
export async function getCriticalProducts(req, res) {
  try {
    const [criticalProducts, errorCritical] = await getCriticalProductsService();
    if (errorCritical) return handleErrorClient(res, 404, errorCritical);
    handleSuccess(res, 200, "Productos críticos encontrados", criticalProducts);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Actualizar un producto
export async function updateProduct(req, res) {
  try {
    const { codigoIdentificador } = req.query;
    const { body } = req;

    const { error: bodyError } = productBodyUpdateValidation.validate(body);

    if (bodyError) {
      return handleErrorClient(
        res,
        400,
        "Error de validación en los datos enviados",
        bodyError.message
      );
    }

    const [product, productError] = await updateProductService(
      { codigoIdentificador },
      body
    );

    if (productError) {
      return handleErrorClient(
        res,
        400,
        "Error modificando el producto",
        productError
      );
    }

    handleSuccess(res, 200, "Producto modificado correctamente", product);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Eliminar un producto
export async function deleteProduct(req, res) {
  try {
    const { id, codigoIdentificador } = req.query;

    const { error: queryError } = productQueryValidation.validate({
      id,
      codigoIdentificador,
    });

    if (queryError) {
      return handleErrorClient(
        res,
        400,
        "Error de validación en la consulta",
        queryError.message,
      );
    }

    const [productDelete, errorProductDelete] = await deleteProductService({
      id,
      codigoIdentificador,
    });

    if (errorProductDelete)
      return handleErrorClient(res, 404, "Error eliminando el producto", errorProductDelete);

    handleSuccess(res, 200, "Producto eliminado correctamente", productDelete);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function createProduct(req, res) {
  try {
    const { body } = req;
    const { error } = productBodyValidation.validate(body);
    if (error)
      return handleErrorClient(res, 400, "Error de validación", error.message);

    const [newProduct, errorNewProduct] = await createProductService(body);

    if (errorNewProduct)
      return handleErrorClient(res, 400, "Error al insertar el producto", errorNewProduct.message || errorNewProduct);

    handleSuccess(res, 201, "Producto insertado con éxito", newProduct);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function updateStockAfterSale(req, res) {
  try {
    const { ingredients } = req.body;
    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return handleErrorClient(res, 400, "No se proporcionaron ingredientes.");
    }

    const [updated, errorUpdate] = await updateStockService(ingredients);
    if (errorUpdate) return handleErrorClient(res, 400, errorUpdate);

    handleSuccess(res, 200, "Stock actualizado correctamente", updated);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}


export async function checkAvailability(req, res) {
  try {
    const { products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return handleErrorClient(res, 400, "Debes proporcionar un arreglo de productos");
    }

    const [results, errorResults] = await checkAvailabilityService(products);
    if (errorResults) return handleErrorClient(res, 400, errorResults);

    handleSuccess(res, 200, "Disponibilidad verificada", results);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

