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
  TooltipItem,
} from "chart.js";
import "./style.scss";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// داده‌ها
const labels: string[] = [
  "پزشک عمومی",
  "متخصص داخلی",
  "متخصص قلب",
  "متخصص کودکان",
  "مامایی",
  "آزمایشگاه",
  "دندان‌پزشکی",
  "بینایی‌سنجی",
];

const visitCounts: number[] = [120, 80, 60, 90, 70, 150, 110, 50];
const visitFees: number[] = [50000, 80000, 100000, 90000, 60000, 40000, 70000, 30000];
const totalRevenue: number[] = visitCounts.map((count, i) => count * visitFees[i]);

// داده‌های نمودار
const data = {
  labels,
  datasets: [
    {
      label: "تعداد مراجعه",
      data: visitCounts,
      backgroundColor: "#4caf50",
      borderRadius: 4,
      yAxisID: "y1",
    },
    {
      label: "درآمد کسب‌شده",
      data: totalRevenue,
      backgroundColor: "#2196f3",
      borderRadius: 4,
      yAxisID: "y",
    },
  ],
};

// تنظیمات نمودار
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
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
        label: function (context: TooltipItem<"bar">) {
          const label = context.dataset.label || "";
          const value = context.raw as number;
          return label === "درآمد کسب‌شده"
            ? `${label}: ${value.toLocaleString()} تومان`
            : `${label}: ${value}`;
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
      type: "linear" as const,
      position: "left" as const,
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
        callback: function (value: number | string) {
          return Number(value).toLocaleString() + " تومان";
        },
      },
    },
    y1: {
      type: "linear" as const,
      position: "right" as const,
      title: {
        display: true,
        text: "تعداد مراجعه",
        font: {
          family: "Vazir",
          size: 16,
        },
      },
      grid: {
        drawOnChartArea: false,
      },
      ticks: {
        font: {
          family: "Vazir",
        },
      },
    },
  },
};

const MedicalRevenueChart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  const exportToExcelWithImage = async () => {
    if (!chartRef.current) return;

    const canvas = await html2canvas(chartRef.current);
    const image = canvas.toDataURL("image/png");

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("گزارش درآمد پزشکی");

    worksheet.addRow(["تخصص", "تعداد مراجعه", "مبلغ هر ویزیت", "درآمد کل"]);
    labels.forEach((label, i) => {
      worksheet.addRow([label, visitCounts[i], visitFees[i], totalRevenue[i]]);
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
