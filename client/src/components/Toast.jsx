import { useState, useEffect } from "react";

export default function Toast({ message, type = "success", duration = 3000, onClose }) {
  const [isVisible, setIsVisible] = useState(!!message);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!isVisible || !message) return null;

  const bgColor = type === "success" ? "#d1fae5" : "#fee2e2";
  const textColor = type === "success" ? "#065f46" : "#991b1b";
  const borderColor = type === "success" ? "#6ee7b7" : "#fca5a5";

  return (
    <div
      style={{
        position: "fixed",
        top: "1rem",
        right: "1rem",
        background: bgColor,
        color: textColor,
        padding: "1rem 1.5rem",
        borderRadius: "8px",
        border: `2px solid ${borderColor}`,
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        fontWeight: 600,
        maxWidth: "400px",
        zIndex: 9999,
        animation: "slideIn 0.3s ease-out",
      }}
    >
      {message}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
