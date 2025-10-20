"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAndPrintReceipt = generateAndPrintReceipt;
// services/receiptPrinter.ts
const jspdf_1 = __importDefault(require("jspdf"));
const jspdf_autotable_1 = __importDefault(require("jspdf-autotable"));
const Vazir_Regular_normal_js_1 = __importDefault(require("@/fonts/Vazir-Regular-normal.js")); // فونت وزیر Base64
function generateAndPrintReceipt(data) {
    if (!data || !Array.isArray(data.services)) {
        console.error("داده پذیرش معتبر نیست:", data);
        return;
    }
    const doc = new jspdf_1.default({ orientation: "portrait", unit: "pt", format: "a4" });
    // اضافه کردن فونت وزیر
    doc.addFileToVFS("Vazir-Regular.ttf", Vazir_Regular_normal_js_1.default);
    doc.addFont("Vazir-Regular.ttf", "Vazir", "normal");
    doc.setFont("Vazir");
    const rightMargin = 550; // راست‌چین
    let y = 40;
    const toPersianNumber = (n) => n.toString().replace(/[0-9]/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d)]);
    const drawText = (txt, offsetY, fontSize = 12) => {
        doc.setFontSize(fontSize);
        doc.text(txt, rightMargin, y, { align: "right" });
        y += offsetY;
    };
    // عنوان
    doc.setFontSize(18);
    doc.text("فیش پذیرش درمانگاه", 300, y, { align: "center" });
    y += 30;
    drawText(`نام بیمار: ${data.patient_name}`, 15);
    drawText(`کد ملی: ${data.national_code}`, 15);
    drawText(`نوبت: ${data.turn_number}`, 15);
    drawText(`نوع ویزیت: ${data.visit_type}`, 15);
    drawText(`پزشک: ${data.doctor_name} - ${data.doctor_specialty}`, 15);
    drawText(`کاربر پذیرش: ${data.reception_user}`, 15);
    drawText(`تاریخ: ${data.date}    ساعت: ${data.time}`, 15);
    drawText(`شماره فیش: ${data.bill_number}`, 15);
    y += 10;
    // جدول خدمات
    const serviceRows = data.services.length > 0
        ? data.services.map((s) => [s.name, toPersianNumber(s.price)])
        : [["هیچ خدمتی انتخاب نشده است", "-"]];
    (0, jspdf_autotable_1.default)(doc, {
        startY: y,
        head: [["نام خدمت", "قیمت (تومان)"]],
        body: serviceRows,
        styles: { font: "Vazir", halign: "right" },
        headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold" },
    });
    // بررسی lastAutoTable
    y = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 20 : y + 100;
    drawText(`جمع کل: ${toPersianNumber(data.total_payment)} تومان`, 15, 14);
    drawText(`بیمه پایه: ${toPersianNumber(data.insurance_base)} تومان`, 12);
    drawText(`بیمه تکمیلی: ${toPersianNumber(data.insurance_extra)} تومان`, 12);
    // فوتر
    y += 30;
    doc.setFontSize(12);
    doc.text(data.footer_text, 300, y, { align: "center" });
    // چاپ PDF در مرورگر
    const pdfBlob = doc.output("blob");
    const pdfURL = URL.createObjectURL(pdfBlob);
    const pdfWindow = window.open(pdfURL);
    if (pdfWindow)
        pdfWindow.onload = () => pdfWindow.print();
}
