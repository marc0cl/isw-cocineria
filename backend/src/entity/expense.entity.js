"use strict";
import { EntitySchema } from "typeorm";

const ExpenseSchema = new EntitySchema({
  name: "Expense",
  tableName: "expenses",
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
      name: "IDX_EXPENSE",
      columns: ["id"],
      unique: true,
    },
  ],
});

export default ExpenseSchema;
