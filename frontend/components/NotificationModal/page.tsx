import React from "react";
import "./style.scss";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}
const NotificationModal = ({ isOpen, onClose }: Props) => {
  if (!isOpen) return null;
  return(
    <>
      <main className="">
        <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="text-lg font-bold mb-4">اعلان‌ها</h2>
        <ul className="text-sm space-y-2">
          <li>📌 اعلان شماره ۱</li>
          <li>📌 اعلان شماره ۲</li>
          <li>📌 اعلان شماره ۳</li>
        </ul>
        <button className="modal-close-btn" onClick={onClose}>بستن</button>
      </div>
    </div>
      </main>
    </>
  );
};

export default NotificationModal;
