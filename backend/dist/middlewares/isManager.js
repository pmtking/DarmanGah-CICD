"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isManager = isManager;
function isManager(req, res, next) {
    const user = req.user; // فرض بر اینه که auth middleware قبلاً اجرا شده
    if (!user || user.role !== "MANAGER") {
        return res
            .status(403)
            .json({ message: "دسترسی غیرمجاز. فقط مدیر مجاز است." });
    }
    next();
}
