"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoConnected = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = require("./config/dotenv");
(0, dotenv_1.dotenvConfig)();
const mongoConnected = () => {
    mongoose_1.default
        .connect(process.env.MONGO_URI)
        .then(() => {
        console.log("✅ mongoo is connected ");
    })
        .catch((err) => {
        if (err) {
            console.log(`error ${err}`);
        }
    });
};
exports.mongoConnected = mongoConnected;
