"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import html2canvas from "html2canvas";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import HeaderAdmin from "@/components/HeaderAdmin/page";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

interface User {
  name: string;
  status: "online" | "idle" | "offline";
}

interface Task {
  title: string;
  done: boolean;
  reminder?: string;
}

const AdminDashboard = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  // بخش تسک‌ها
  const [tasks, setTasks] = useState<Task[]>([
    { title: "بررسی نوبت‌ها", done: false },
    { title: "گزارش مالی روزانه", done: false },
    { title: "بازبینی تسک‌ها", done: false },
  ]);
  const [newTask, setNewTask] = useState("");

  // بخش کاربران
  const [users, setUsers] = useState<User[]>([
    { name: "کاربر ۱", status: "online" },
    { name: "کاربر ۲", status: "online" },
    { name: "کاربر ۳", status: "idle" },
    { name: "کاربر ۴", status: "offline" },
    { name: "کاربر ۵", status: "online" },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setUsers(prev =>
        prev.map(u => {
          const rand = Math.random();
          if (rand < 0.7) return { ...u, status: "online" };
          if (rand < 0.9) return { ...u, status: "idle" };
          return { ...u, status: "offline" };
        })
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const appointmentsData = {
    labels: ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه"],
    datasets: [
      { label: "رزرو شده", data: [20, 30, 25, 40, 35], backgroundColor: "#4f46e5" },
      { label: "تکمیل شده", data: [15, 25, 20, 35, 30], backgroundColor: "#10b981" },
    ],
  };

  const revenueData = {
    labels: ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه"],
    datasets: [
      { label: "درآمد روزانه", data: [12, 15, 14, 18, 16], borderColor: "#ef4444", backgroundColor: "rgba(239,68,68,0.2)", tension: 0.3 },
    ],
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Dashboard");
    sheet.addRow(["روز", "رزرو شده", "تکمیل شده", "درآمد"]);
    appointmentsData.labels.forEach((day, i) => {
      sheet.addRow([
        day,
        appointmentsData.datasets[0].data[i],
        appointmentsData.datasets[1].data[i],
        revenueData.datasets[0].data[i],
      ]);
    });
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), "Dashboard.xlsx");
  };

  const exportAsImage = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current, { scale: 2 });
      canvas.toBlob(blob => blob && saveAs(blob, "Dashboard.png"));
    }
  };

  const statusColor = (status: User["status"]) => {
    switch (status) {
      case "online": return "bg-green-500 animate-pulse";
      case "idle": return "bg-yellow-400 animate-pulse";
      case "offline": return "bg-red-500";
    }
  };

  const statusText = (status: User["status"]) => {
    switch (status) {
      case "online": return "فعال";
      case "idle": return "بی‌کار";
      case "offline": return "آفلاین";
    }
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks(prev => [...prev, { title: newTask, done: false }]);
    setNewTask("");
  };

  const removeTask = (index: number) => {
    setTasks(prev => prev.filter((_, i) => i !== index));
  };

  const toggleDone = (index: number) => {
    setTasks(prev => {
      const copy = [...prev];
      copy[index].done = !copy[index].done;
      return copy;
    });
  };

  return (
    <main className="mt-6 min-h-[90vh] w-full p-6 flex flex-col gap-6 ">
      <HeaderAdmin />

      <div className="flex justify-end gap-4">
        <button onClick={exportToExcel} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow">خروجی اکسل</button>
        <button onClick={exportAsImage} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow">خروجی تصویر</button>
      </div>

      <div ref={chartRef} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* نمودار نوبت‌ها */}
        <div className="bg-white/20 backdrop-blur-md rounded-xl shadow-lg p-4 h-52 overflow-hidden">
          <h2 className="text-gray-100 font-bold mb-1 text-sm truncate">وضعیت نوبت‌ها</h2>
          <Bar data={appointmentsData} options={{ responsive: true, plugins: { legend: { position: "top" } }, maintainAspectRatio: false }} />
        </div>

        {/* نمودار درآمد */}
        <div className="bg-white/20 backdrop-blur-md rounded-xl shadow-lg p-4 h-52 overflow-hidden">
          <h2 className="text-gray-100 font-bold mb-1 text-sm truncate">درآمد روزانه</h2>
          <Line data={revenueData} options={{ responsive: true, plugins: { legend: { position: "top" } }, maintainAspectRatio: false }} />
        </div>

        {/* کاربران مانیتورینگ */}
        <div className="bg-white/20 backdrop-blur-md rounded-xl shadow-lg p-4 h-52 flex flex-col">
          <h2 className="text-gray-100 font-bold mb-1 text-sm">کاربران فعال / مانیتورینگ</h2>
          <ul className="flex flex-col gap-2 flex-1 overflow-y-auto">
            {users.map((u, i) => (
              <li key={i} className="flex items-center justify-between p-2 rounded-lg border border-gray-500">
                <span>{u.name}</span>
                <div className="flex items-center gap-2">
                  <span className={`w-4 h-4 rounded-full ${statusColor(u.status)}`}></span>
                  <span className="text-gray-200 text-xs">{statusText(u.status)}</span>
                </div>
              </li>
            ))}
          </ul>
          <p className="text-gray-400 text-xs mt-1">وضعیت لحظه‌ای کاربران (Ping سیستم)</p>
        </div>

        {/* تسک‌ها */}
        <div className="bg-white/20 backdrop-blur-md rounded-xl shadow-lg p-4 flex flex-col h-52 overflow-y-auto">
          <h2 className="text-gray-100 font-bold mb-2 text-sm">تسک‌ها / فعالیت‌ها</h2>
          <ul className="flex flex-col gap-2 flex-1">
            {tasks.map((task, i) => (
              <li key={i} className={`flex items-center justify-between p-2 rounded-lg border transition-all duration-300 ${task.done ? "border-green-500 bg-green-600/20" : "border-gray-400"}`}>
                <span>{task.title}</span>
                <div className="flex items-center gap-2">
                  {task.done && <span className="text-green-500 font-bold animate-pulse">✓</span>}
                  <button onClick={() => removeTask(i)} className="text-red-400 text-xs hover:text-red-600">حذف</button>
                  <button onClick={() => toggleDone(i)} className="text-blue-400 text-xs hover:text-blue-600">{task.done ? "بازنشانی" : "تیک"}</button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              placeholder="تسک جدید..."
              value={newTask}
              onChange={e => setNewTask(e.target.value)}
              className="flex-1 p-1 rounded border border-gray-400 text-sm"
            />
            <button onClick={addTask} className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded">اضافه</button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;
