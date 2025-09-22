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
          @page { size: auto; margin: 10mm; }
          body, html {
            font-family: "Vazir", "IRANSans", sans-serif;
            margin: 0;
            padding: 0;
            background: #fff;
          }

          .page {
            position: relative;
            min-height: 100vh;
            padding: 10mm 10mm 10mm 10mm;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          /* سر برگ */
          .header {
            flex-shrink: 0;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border: 1px dashed #999;
            border-radius: 12px;
            padding: 12px;
            width: 100%;
            max-width: 600px;
            margin-bottom: 12px;
            font-size: 12px;
            background: rgba(255,255,255,0.85);
            z-index: 1;
          }

          .header-right { text-align: right; }
          .header-left { text-align: left; }
          .header-center {
            text-align: center;
            font-size: 14px;
            font-weight: bold;
          }

          .receiver,
          .title,
          .content {
            width: 100%;
            max-width: 600px;
            z-index: 1;
          }

          .receiver { margin-top: 10px; font-weight: bold; font-size: 14px; }
          .title { text-align: right; font-weight: bold; font-size: 16px; text-decoration: underline; margin: 8px 0; }
          .content { white-space: pre-wrap; text-align: justify; font-size: 14px; }

          /* لوگو بزرگ وسط زیر متن‌ها */
          .logo-center {
            position: absolute;
            top: 40%;
            left: 55%;
           
            transform: translate(-50%, -50%);
            width:500px;
            max-width: 500mm;
            height: auto;
            opacity: 0.25;
            z-index: 0;
          }

          /* فوتر */
          .footer {
            font-weight: bold;
            text-align: left;
            font-size: 18px;
            margin-top: 100px; /* فاصله از متن */
            z-index: 1;
            width: 100%;
            max-width: 600px;
          }

          @media print {
            .page { padding: 5mm; }
            .logo-center {
             position: absolute;
            top: 40%;
            left: 62%;
           
            // transform: translate(-50%, -50%);
            width:430px;
            max-width: 380mm;
            height: auto;
            opacity: 0.2;
            z-index: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="page">
          ${logo.replace("<svg", '<svg class="logo-center"')}

          <div class="header">
            <div class="header-right">
              جمهوری اسلامی ایران<br/>
              اداره آموزش و پرورش شهرستان نیشابور<br/>
              مرکز بهداشتی و درمانی فرهنگیان<br/>
              شهرستان نیشابور
            </div>
            <div class="header-center">بسمه تعالی</div>
            <div class="header-left">
              شماره: ${letter.number}<br/>
              تاریخ: ${letter.date}<br/>
              پیوست: ${letter.attachment}
            </div>
          </div>

          <div class="receiver">به: ${letter.receiver}</div>
          <div class="title">${letter.title}</div>
          <div class="content">${letter.content}</div>

          <div class="footer">
            رسول پارسا<br/>
            مدیریت درمانگاه
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
