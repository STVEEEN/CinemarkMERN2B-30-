import { Schema, model } from "mongoose";

const clientsSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
      maxLength: 100,
    },
    email: {
        type: String,
        require: true,
        maxLength: 100,
    },
    password: {
        type: String,
        require: true,
        maxLength: 100,
    },
    telephone: {
        type: String,
        require: true,
    },
    address: {
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

export default model("client", clientsSchema);