"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessKey = void 0;
const generateAccessKey = () => {
    return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
};
exports.generateAccessKey = generateAccessKey;
