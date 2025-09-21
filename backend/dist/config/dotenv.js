"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dotenvConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const dotenvConfig = () => dotenv_1.default.config();
exports.dotenvConfig = dotenvConfig;
