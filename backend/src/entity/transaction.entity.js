"use strict";
import { EntitySchema } from "typeorm";

const TransactionSchema = new EntitySchema({
  name: "Transaction",
  tableName: "transactions",
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
    type: {
      type: "enum",
      enum: ["income", "expense"],
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
      name: "IDX_TRANSACTION",
      columns: ["id"],
      unique: true,
    },
    {
      name: "IDX_TRANSACTION_UPDATEDAT",
      columns: ["updatedAt"],
    },
  ],
});

export default TransactionSchema;
