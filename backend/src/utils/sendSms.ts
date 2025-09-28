// smsService.ts
import fetch from "node-fetch";

const BASE_URL = "https://edge.ippanel.com/v1/api/send";
const TOKEN = "9UuMXe-r8_2YJba3zR6dStU1Q3O48DodhQnS2bero20="; // توکن شما
const PATTERN_CODE = "59szjmh8dalaked"; // پترن فعال
const FROM_NUMBER = "+983000505"; // شماره فرستنده

interface SMSParams {
  phoneNumber: string;  // شماره گیرنده با +98
  day: string;          // YYYY/MM/DD
  time: string;         // HH:MM
}

export const sendAppointmentSMS = async ({ phoneNumber, day, time }: SMSParams) => {
  console.log("📌 sendAppointmentSMS called with:", { phoneNumber, day, time });

  try {
    const body = {
      sending_type: "pattern",
      from_number: FROM_NUMBER,
      code: PATTERN_CODE,
      recipients: [phoneNumber],
      params: {
        day,
        time,
      }
    };

    console.log("📨 Sending SMS body:", JSON.stringify(body, null, 2));

    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: TOKEN // فقط توکن
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error("❌ HTTP Error:", response.status, response.statusText);
      const text = await response.text();
      console.error("❌ Response body:", text);
      return null;
    }

    const data = await response.json();
    console.log("✅ SMS Response:", data);
    return data;

  } catch (error) {
    console.error("❌ Error sending SMS:", error);
    return null;
  }
};
