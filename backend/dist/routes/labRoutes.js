"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const LabController_1 = require("../controllers/LabController");
exports.router = express_1.default.Router();
// مسیر آپلود چند فایل
exports.router.post("/upload", LabController_1.upload.array("files"), LabController_1.uploadFiles);
exports.router.post("/get-files", LabController_1.getFilesByCodeMelli);
exports.default = exports.router;
