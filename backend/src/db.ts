import mongoose from "mongoose";
import dotenv from "dotenv";
import { dotenvConfig } from "./config/dotenv";
dotenvConfig();
export const mongoConnected = () => {
    
  mongoose
    .connect(process.env.MONGO_URI!)
    .then(() => {
      console.log("✅ mongoo is connected ");
    })
    .catch((err) => {
      if (err) {
        console.log(`error ${err}`);
      }
    });
};
