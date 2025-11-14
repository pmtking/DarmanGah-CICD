import { useState } from "react";

const useReseption = () => {
  const [success, setSuccess] = useState(false);
  const [msg, setMsg] = useState("");

  const checkNationalCode = (nationalCode: string) => {
    const isValid = /^\d{10}$/.test(nationalCode); // فقط ۱۰ رقم عددی

    if (!isValid) {
      setSuccess(false);
      setMsg("کد ملی باید دقیقاً ۱۰ رقم عددی باشد");
      return {
        success: false,
        msg: "کد ملی نامعتبر است (باید ۱۰ رقم عددی باشد)",
      };
    }

    setSuccess(true);
    setMsg("کد ملی معتبر است");
    return {
      success: true,
      msg: "کد ملی معتبر است",
    };
  };
  const findUserRepo = async () => {
    
  }

  return { checkNationalCode, success, msg  , findUserRepo};
};

export default useReseption;
