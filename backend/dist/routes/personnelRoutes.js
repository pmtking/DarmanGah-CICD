"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const personnelController_1 = require("../controllers/personnelController");
const router = express_1.default.Router();
router.post('/add', personnelController_1.addPersonnelController);
router.post('/login', personnelController_1.loginPersonnelController);
router.get('/find', personnelController_1.findPersonel);
exports.default = router;
