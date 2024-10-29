"user strict"
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
        const {id, codigoIdentificador} = query;
        const productRepository = AppDataSource.getRepository(Product);
        const productFound = await productRepository.findOne({
            where: [{id: id} ,{codigoIdentificador: codigoIdentificador}] 
        });

        if (!productFound) return [null, "producto no encontrado"];

        const existingProduct = await productRepository.findOne({
            where: [{codigoIdentificador : body.codigoIdentificador}],
        });
        if(existingProduct && existingProduct.id !== productFound.id){
            return[null, "ya existe un producto con el mismo codigo identificador "];
        }
        const dataProductUpdate = {
            nombreProducto: body.nombreProducto,
            cantidadProducto: body.cantidadProducto,
            fechaDeCaducidad: body.fechaDeCaducidad,
            tipoDeProducto: body.tipoDeProducto,
            updatedAt: new Date(),
        };
        await productRepository.update({ id: productFound.id }, dataProductUpdate);
        
        const updatedProduct = await productRepository.findOne({
            where: { id: productFound.id },
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