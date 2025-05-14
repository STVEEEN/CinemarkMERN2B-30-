import { Schema, model } from "mongoose";

const moviesSchema = new Schema(
  {
    title: {
      type: String,
      require: true,
    },
    description: {
        type: String,
        require: true,
    },
    director: {
        type: String,
        require: true,
    },
    gender: {
        type: String,
        require: true,
    },
    year: {
        type: Number,
        require: true,
    },
    duration:{
        type: String,
        require: true,
    },
    image:{
        type: String,
        require: true,
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("Movies", moviesSchema);