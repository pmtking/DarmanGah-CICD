"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { logo } from "./svg"; // SVG رشته کامل باشد

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
              padding: 15px;
            }

            /* SVG پس‌زمینه بزرگ‌تر */
            .watermark {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 70%;       /* بزرگ‌تر */
              height: auto;
              max-width: 130mm;  /* محدودیت برای چاپ */
              opacity: 0.08;
              z-index: -1;
            }

            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              border-bottom: 1px solid #444;
              padding-bottom: 10px;
              margin-bottom: 15px;
              font-size: 11px; /* کوچک‌تر برای فضای بیشتر */
            }

            .header-right { text-align: right; }
            .header-left { text-align: left; }
            .header-center {
              text-align: center;
              font-size: 14px;
              font-weight: bold;
              margin-top: 5px;
            }

            .receiver {
              margin-top: 10px;
              font-weight: bold;
              font-size: 14px;
            }

            /* عنوان نامه سمت راست */
            .title {
              text-align: right;
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
              min-height: 120mm; /* فضای کافی برای بادی نامه */
            }

            .footer {
              margin-top: 30px;
              font-weight: bold;
              text-align: left;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <!-- SVG بزرگ در پس‌زمینه -->
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
