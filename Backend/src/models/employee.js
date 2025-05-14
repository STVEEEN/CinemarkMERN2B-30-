import { Schema, model } from "mongoose";

const employeesSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    telephone: {
        type: String,
        require: true,
    },
    address: {
        type: String,
        require: true,
    },
    chargue:{
        type: String,
        require: true,
    },
    hireDate:{
        type: Date,
        require: true,
    },
    salary:{
        type: String,
        require: true,
    },
    status:{
        type: Boolean,
        require: true,
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("Employee", employeesSchema);