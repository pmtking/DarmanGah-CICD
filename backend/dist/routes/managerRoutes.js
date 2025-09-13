"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const managerController_1 = require("../controllers/managerController");
const verifySuperAdmin_1 = require("../middlewares/verifySuperAdmin ");
const router = express_1.default.Router();
router.post('/manager/add', verifySuperAdmin_1.verifySuperAdmin, managerController_1.createManagerController);
exports.default = router;
