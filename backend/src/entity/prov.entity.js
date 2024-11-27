"use strict"
import { EntitySchema } from "typeorm";

const ProvSchema = new EntitySchema({
    name: "Prov",
    tableName: "proveedores",
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true,
        },
        nombre: {
            type: "varchar",
            length: 255,
            nullable: false,
        },
        email: {
            type: "varchar",
            length: 255,
            nullable: false,
            unique: true,
        },
        telefono: {
            type: "varchar",
            length: 50,
            nullable: false,
        },
        direccion: {
            type: "varchar",
            length: 255,
            nullable: false,
        },
        medioPago: {
            type: "varchar",
            length: 255,
            nullable: false,
        },
        productos: {
            type: "varchar",
            length: 255,
            nullable: false,
        },
        createdAt: {
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
});

export default ProvSchema;