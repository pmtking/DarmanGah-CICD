"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { logo } from "./svg"; // svg باید رشته کامل SVG باشد

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
            @page { size: A5; margin: 15mm; }

            body {
              font-family: "Vazir", "IRANSans", sans-serif;
              color: #222;
              line-height: 1.8;
              font-size: 14px;
              position: relative;
              margin: 0;
              padding: 20px;
            }

            /* لوگوی پس‌زمینه به صورت نسبی */
            .watermark {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 50%;      /* اندازه نسبی برای همه صفحه‌ها */
              height: auto;
              max-width: 100mm; /* محدودیت حداکثر اندازه برای چاپ */
              opacity: 0.08;
              z-index: -1;
            }

            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              border-bottom: 2px solid #444;
              padding-bottom: 15px;
              margin-bottom: 20px;
            }

            .header-right, .header-left {
              font-size: 13px;
              line-height: 1.6;
            }

            .header-right { text-align: right; }
            .header-left { text-align: left; }
            .header-center {
              text-align: center;
              font-size: 18px;
              font-weight: bold;
              margin-top: 10px;
            }

            .receiver {
              margin-top: 15px;
              font-weight: bold;
              font-size: 15px;
            }

            .title {
              text-align: center;
              font-weight: bold;
              font-size: 16px;
              text-decoration: underline;
              margin: 15px 0;
            }

            .content {
              white-space: pre-wrap;
              text-align: justify;
              font-size: 14px;
              margin-top: 10px;
            }

            .footer {
              margin-top: 50px;
              font-weight: bold;
              text-align: left;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <!-- SVG لوگوی پس‌زمینه -->
          ${logo.replace('<svg', '<svg class="watermark"')}

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
