"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const loginSuperAdmin_1 = require("../controllers/loginSuperAdmin");
const verifySuperAdmin_1 = require("../middlewares/verifySuperAdmin ");
// import { router } from '.';
const router = express_1.default.Router();
router.get('/test', verifySuperAdmin_1.verifySuperAdmin, (req, res) => {
    return res.send("test router");
});
router.post('/v1/login', loginSuperAdmin_1.LoginSuperAdmin);
exports.default = router;
