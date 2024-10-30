"use strict";
import{
    getProductService,
    getProductsService,
    deleteProductService,
    updateProductService,
} from "../services/product.service.js";
import{
    productBodyValidation,
    productQueryValidation,
}from "../validations/product.validation.js";
import{
    handleErrorClient,
    handleErrorServer,
    handleSuccess,
} from "../handlers/responseHandlers.js";

// Función para obtener un solo producto
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
  
  // Función para obtener todos los productos
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
  
  // Función para actualizar un producto
  export async function updateProduct(req, res) {
    try {
      const { id, codigoIdentificador } = req.query;
      const { body } = req;
  
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
  
      const { error: bodyError } = productBodyValidation.validate(body);
  
      if (bodyError)
        return handleErrorClient(
          res,
          400,
          "Error de validación en los datos enviados",
          bodyError.message,
        );
  
      const [product, productError] = await updateProductService(
        { id, codigoIdentificador },
        body,
      );
  
      if (productError)
        return handleErrorClient(res, 400, "Error modificando el producto", productError);
  
      handleSuccess(res, 200, "Producto modificado correctamente", product);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  }
  
  // Función para eliminar un producto
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
