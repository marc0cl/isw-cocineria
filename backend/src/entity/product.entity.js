"use strict";
import { EntitySchema } from "typeorm";

const ProductSchema = new EntitySchema({
  name: "Product",
  tableName: "products",
  columns: {
    id: {
        type: "int",
        primary: true,
        generated: true,
    },
    
    codigoIdentificador: {
        type: "varchar",
        length: 20,
        nullable: false,
        unique: true,
    },

    nombreProducto:{
        type: "varchar",
        length: 255,
        nullable: false,
        unique: true,

    },

    cantidadProducto:{
        type: "int",
        nullable: false,
    },

    fechaDeCaducidad:{
        type: "date",
        nullable: false,
    },

    tipoDeProducto:{
        type: "varchar",
        length: 255,
        nullable: false 
    },
    
    createdAt:{
        type: "timestamp with time zone",
        default: () => "CURRENT_TIMESTAMP",
        nullable: false,
    },
    
    updatedAt: {
        type: "timestamp with time zone",
        default: () => "CURRENT_TIMESTAMP",
        onUpdate: "CURRENT_TIMESTAMP",
        nullable: false,
      },
  },
  indices: [
    {
        name: "IDX_PRODUCT_ID",
        columns: ["id"],
        unique:true,
    },
    {
        name: "IDX_PRODUCT_CODIGO",
        columns: ["codigoIdentificador"],
        unique:true
    },
  ],  
});
export default ProductSchema;