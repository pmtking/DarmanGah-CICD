"use client";

import React, { useRef } from "react";
import { Bar } from "react-chartjs-2";
import html2canvas from "html2canvas";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import "./style.scss";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// تخصص‌های پزشکی
const labels = [
  "پزشک عمومی",
  "متخصص داخلی",
  "متخصص قلب",
  "متخصص کودکان",
  "مامایی",
  "آزمایشگاه",
  "دندان‌پزشکی",
  "بینایی‌سنجی",
];

// تعداد مراجعه و مبلغ هر ویزیت
const visitCounts = [120, 80, 60, 90, 70, 150, 110, 50]; // تعداد مراجعه
const visitFees = [50000, 80000, 100000, 90000, 60000, 40000, 70000, 30000]; // مبلغ هر ویزیت (تومان)

// محاسبه درآمد کل
const totalRevenue = visitCounts.map((count, index) => count * visitFees[index]);

// داده‌های نمودار
// داده‌های نمودار با محور مشخص‌شده
const data = {
  labels,
  datasets: [
    {
      label: "تعداد مراجعه",
      data: visitCounts,
      backgroundColor: "#4caf50",
      borderRadius: 4,
      yAxisID: "y1", // محور سمت راست
    },
    {
      label: "درآمد کسب‌شده",
      data: totalRevenue,
      backgroundColor: "#2196f3",
      borderRadius: 4,
      yAxisID: "y", // محور سمت چپ
    },
  ],
};

// تنظیمات نمودار با دو محور Y
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
      labels: {
        font: {
          family: "Vazir",
          size: 14,
        },
      },
    },
    tooltip: {
      bodyFont: {
        family: "Vazir",
      },
      callbacks: {
        label: function (context) {
          const label = context.dataset.label || "";
          const value = context.raw;
          if (label === "درآمد کسب‌شده") {
            return `${label}: ${value.toLocaleString()} تومان`;
          }
          return `${label}: ${value}`;
        },
      },
    },
  },
  scales: {
    x: {
      ticks: {
        font: {
          family: "Vazir",
        },
      },
    },
    y: {
      type: "linear",
      position: "left",
      title: {
        display: true,
        text: "درآمد (تومان)",
        font: {
          family: "Vazir",
          size: 16,
        },
      },
      ticks: {
        font: {
          family: "Vazir",
        },
        callback: function (value) {
          return value.toLocaleString() + " تومان";
        },
      },
    },
    y1: {
      type: "linear",
      position: "right",
      title: {
        display: true,
        text: "تعداد مراجعه",
        font: {
          family: "Vazir",
          size: 16,
        },
      },
      grid: {
        drawOnChartArea: false, // جلوگیری از تداخل خطوط شبکه
      },
      ticks: {
        font: {
          family: "Vazir",
        },
      },
    },
  },
};


const MedicalRevenueChart = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  const exportToExcelWithImage = async () => {
    if (!chartRef.current) return;

    const canvas = await html2canvas(chartRef.current);
    const image = canvas.toDataURL("image/png");

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("گزارش درآمد پزشکی");

    worksheet.addRow(["تخصص", "تعداد مراجعه", "مبلغ هر ویزیت", "درآمد کل"]);
    labels.forEach((label, index) => {
      worksheet.addRow([
        label,
        visitCounts[index],
        visitFees[index],
        totalRevenue[index],
      ]);
    });

    const imageId = workbook.addImage({
      base64: image,
      extension: "png",
    });

    worksheet.addImage(imageId, {
      tl: { col: 5, row: 1 },
      ext: { width: 500, height: 300 },
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "medical-revenue-report.xlsx");
  };

  return (
    <div className="chart-container" ref={chartRef}>
      <h2 className="chart-title">نمودار درآمد و تعداد مراجعه تخصص‌های پزشکی</h2>
      <Bar data={data} options={options} />
      <button onClick={exportToExcelWithImage} className="export-button">
        دانلود اکسل با نمودار
      </button>
    </div>
  );
};

export default MedicalRevenueChart;
