import express from "express";
import { mongoConnected } from "./db";
import corse from "cors";
import { dotenvConfig } from "./config/dotenv";
import { router } from "./routes";
const fs = require("fs");
const path = "i:/auth.token"; // مسیر فلش (در ویندوز)
export const app = express();
app.use(corse());
app.use(express.json());
dotenvConfig();
app.use("/api", router);

export const startServer = async () => {
  try {
    mongoConnected();
    app.listen(process.env.PORT || 4000, "192.171.1.110", () => {
  console.log("🚀 Server is running on http://192.171.1.108:" + (process.env.PORT || 4000));
});

    console.log("🚀 server is runnig");
  } catch (error) {
    console.log("err");
  }
};
