"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { logo } from "./svg";

type Letter = {
  title: string;
  receiver: string;
  content: string;
  date: string;
  number: string;
  attachment: string;
};

const LetterForm = () => {
  const [title, setTitle] = useState("");
  const [receiver, setReceiver] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !receiver || !content) {
      toast.error("لطفاً همه فیلدها را پر کنید ❌");
      return;
    }

    const letter: Letter = {
      title,
      receiver,
      content,
      date: new Date().toLocaleDateString("fa-IR"),
      number: "----",
      attachment: "---",
    };

    handlePrint(letter);
  };

  const handlePrint = (letter: Letter) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html dir="rtl" lang="fa">
      <head>
        <meta charset="UTF-8">
        <title>${letter.title}</title>
        <link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazir-font@v30.1.0/dist/font-face.css" rel="stylesheet">
        <style>
          @page { size: auto; margin: 12mm; }
          body, html {
            font-family: "Vazir", sans-serif;
            margin: 0;
            padding: 0;
            background: #fff;
          }

          .page {
            position: relative;
            min-height: 100vh;
            padding: 14mm;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          /* هدر */
          .header {
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            align-items: start;
            width: 100%;
            max-width: 720px;
            margin-bottom: 20px;
            border-bottom: 1px solid #1976d2;
            padding-bottom: 8px;
            border-radius:10px;
          }

          .header-right {
            text-align: right;
            font-size: 11px;
            font-weight: bold;
            color: #333;
          }
          .header-left {
            text-align: left;
            font-size: 12px;
            color: #333;
            justify-self: end;
          }
          .header-center {
            text-align: center;
            font-size: 15px;
            font-weight: bold;
            color: #1976d2;
          }

          .logo-header {
            display: block;
            margin: 8px auto 0 auto;
            width: 90px;
            height: auto;
            opacity: 0.95;
          }

          /* واترمارک همیشه وسط */
          .watermark {
            position: fixed;
            top: 48%;
            left: 62%;
            transform: translate(-50%, -50%);
            z-index: 0;
            pointer-events: none;
          }
          .watermark svg {
            width: 420px;
            height: auto;
            opacity: 0.1;
          }

          /* متن نامه */
          .receiver,
          .title,
          .content {
            width: 100%;
            max-width: 720px;
            z-index: 1;
            position: relative;
          }
          .receiver {
            margin-top: 12px;
            font-weight: bold;
            font-size: 14px;
          }
          .title {
            text-align: right;
            font-weight: bold;
            font-size: 17px;
            text-decoration: underline;
            margin: 12px 0;
            color: #222;
          }
          .content {
            white-space: pre-wrap;
            text-align: justify;
            font-size: 14px;
            line-height: 1.9;
            color: #333;
          }

          /* فوتر سمت چپ پایین */
          .footer {
            position: fixed;
            bottom: 12mm;
            left: 14mm;
            text-align: center;
            z-index: 1;
            font-weight: bold;
            color: #444;
            // text-align:center;
          }
          .footer .manager {
            font-size: 16px;
            font-weight: bold;
          }
          .footer .title {
            font-size: 14px;
          }

          @media print {
            .page { padding: 10mm; }
            .watermark svg { opacity: 0.08; }
          }
        </style>
      </head>
      <body>
        <div class="page">
          <!-- واترمارک -->
          <div class="watermark">
            ${logo}
          </div>

          <!-- سربرگ -->
          <div class="header">
            <div class="header-right">
              جمهوری اسلامی ایران<br/>
              اداره آموزش و پرورش شهرستان نیشابور<br/>
              مرکز بهداشتی و درمانی فرهنگیان<br/>
              شهرستان نیشابور
            </div>
            <div class="header-center">
        
              ${logo.replace("<svg", '<svg class="logo-header"')}
            </div>
            <div class="header-left">
              شماره: ${letter.number}<br/>
              تاریخ: ${letter.date}<br/>
              پیوست: ${letter.attachment}
            </div>
          </div>

          <!-- متن نامه -->
          <div class="receiver">به: ${letter.receiver}</div>
          <div class="title">${letter.title}</div>
          <div class="content">${letter.content}</div>

          <!-- فوتر -->
          <div class="footer">
            <div class="manager">رسول پارسا</div>
            <div class="title">مدیریت درمانگاه فرهنگیان نیشابور</div>
          </div>
        </div>
      </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 bg-white/30 p-6 rounded-xl shadow-md w-full max-w-xl mx-auto"
    >
      <input
        type="text"
        placeholder="عنوان نامه"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="p-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <input
        type="text"
        placeholder="گیرنده"
        value={receiver}
        onChange={(e) => setReceiver(e.target.value)}
        className="p-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <textarea
        placeholder="متن نامه..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="p-2 rounded border h-40 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition-colors"
      >
        ثبت و چاپ نامه
      </button>
    </form>
  );
};

export default LetterForm;
