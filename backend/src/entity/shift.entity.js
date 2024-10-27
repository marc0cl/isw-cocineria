"use strict"
import { EntitySchema, JoinColumn } from "typeorm";
import UserSchema from "./user.entity.js";

const ShiftSchema = new EntitySchema({
    name: "Shift",
    tableName:"Shifts",
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true,
        },
        date:{
            type: "date",
            nullable: false
        },
        startTime: {
            type:"timestamp with time zone",
            nullable: false,
        },
        endTime: {
            type:"timestamp with time zone",
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
    relations:{
        users:{
            target: UserSchema,
            type: "Many-to-Many",
            joinTable: true,
            cascade:true,
        },
        manager:{
            target: UserSchema,
            type: "Many-to-One",
            JoinColumn: {
                name: "managerId",
                referencedColumnName: "id",
            },
            cascade: true,
            nullable: true,
        },
    },
});
export default ShiftSchema;