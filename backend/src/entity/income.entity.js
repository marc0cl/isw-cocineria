"use strict";
import { EntitySchema } from "typeorm";

const IncomeSchema = new EntitySchema({
  name: "Income",
  tableName: "incomes",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    amount: {
      type: "decimal",
      nullable: false,
    },
    description: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    source: {
      type: "enum",
      enum: ["bar", "proveedor", "cocina", "otros"],
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
  indices: [
    {
      name: "IDX_INCOME",
      columns: ["id"],
      unique: true,
    },
    {
      name: "IDX_INCOME_UPDATEDAT",
      columns: ["updatedAt"],
    },
  ],
});

export default IncomeSchema;
