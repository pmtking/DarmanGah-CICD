"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReceptionController = void 0;
const reseptionService_1 = require("../services/reseptionService");
// import { registerNewReception } from "../services/receptionService";
const createReceptionController = async (req, res) => {
    try {
        const data = req.body;
        const { reception, totalAmount } = await (0, reseptionService_1.registerNewReception)(data);
        return res.status(200).json({
            reception,
            totalAmount
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createReceptionController = createReceptionController;
