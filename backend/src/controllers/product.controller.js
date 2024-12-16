"use strict";
import {
  createProductService,
  deleteProductService,
  getProductService,
  getProductsService,
  updateProductService,
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
    const { nombreProducto } = req.query;

    const { error } = productQueryValidation.validate({ nombreProducto });

    if (error) return handleErrorClient(res, 400, error.message);

    const [product, errorProduct] = await getProductService({ nombreProducto });

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

// Actualizar un producto
export async function updateProduct(req, res) {
  try {
    const { nombreProducto } = req.query;
    const { body } = req;

    const { error: queryError } = productQueryValidation.validate({ nombreProducto });
    if (queryError) {
      return handleErrorClient(
        res,
        400,
        "Error de validación en la consulta",
        queryError.message
      );
    }

    const { error: bodyError } = productBodyUpdateValidation.validate(body);
    if (bodyError) {
      return handleErrorClient(
        res,
        400,
        "Error de validación en los datos enviados",
        bodyError.message
      );
    }

    const [product, productError] = await updateProductService({ nombreProducto }, body);
    if (productError) {
      return handleErrorClient(res, 400, "Error modificando el producto", productError);
    }

    handleSuccess(res, 200, "Producto modificado correctamente", product);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Eliminar un producto
export async function deleteProduct(req, res) {
  try {
    const { nombreProducto } = req.query;

    const { error: queryError } = productQueryValidation.validate({
      nombreProducto,
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
      nombreProducto,
    });

    if (errorProductDelete)
      return handleErrorClient(res, 404, "Error eliminando el producto", errorProductDelete);

    handleSuccess(res, 200, "Producto eliminado correctamente", productDelete);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Crear un producto
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