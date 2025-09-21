# استفاده از نسخه رسمی Node.js
FROM node:18-alpine

# تنظیم دایرکتوری کاری
WORKDIR /app

# فقط فایل‌های مربوط به نصب پکیج‌ها رو کپی کن
COPY package*.json ./

# نصب وابستگی‌ها بدون cache اضافی
RUN npm ci --omit=dev

# حالا بقیه فایل‌ها رو کپی کن
COPY . .

# تنظیم متغیر محیطی برای production
ENV NODE_ENV=production

# باز کردن پورت
EXPOSE 3000

# اجرای اپلیکیشن
CMD ["node", "server.js"]
