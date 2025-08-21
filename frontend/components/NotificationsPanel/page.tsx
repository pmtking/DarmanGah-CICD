import React from "react";
import "./notifications.scss";

interface NotificationType {
  id: number;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  read: boolean;
  timestamp: string;
}

interface Props {
  notifications: NotificationType[];
  onMarkAsRead: (id: number) => void;
}

const NotificationsPanel = ({ notifications, onMarkAsRead }: Props) => {
  return (
    <div className="notifications-panel">
      <h2>اعلان‌ها</h2>
      {notifications.length === 0 ? (
        <p>هیچ اعلان جدیدی وجود ندارد.</p>
      ) : (
        <ul>
          {notifications.map((notif) => (
            <li
              key={notif.id}
              className={`notif ${notif.type} ${
                notif.read ? "read" : "unread"
              }`}
            >
              <div className="notif-header">
                <strong>{notif.title}</strong>
                <span>{notif.timestamp}</span>
              </div>
              <p>{notif.message}</p>
              {!notif.read && (
                <button onClick={() => onMarkAsRead(notif.id)}>
                  علامت‌گذاری به عنوان خوانده‌شده
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationsPanel;
