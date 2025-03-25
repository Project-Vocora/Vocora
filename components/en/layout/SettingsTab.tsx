import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

interface SettingsTabProps {
  onClose: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ onClose }) => {
  const tabRef = useRef<HTMLDivElement | null>(null);

  // Close if user clicks outside the tab
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tabRef.current && !tabRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={tabRef}
      className="absolute top-16 left-1/2 transform -translate-x-1/2 w-[min(90vw,500px)] max-h-[80vh] p-4 bg-white shadow-lg rounded-md overflow-y-auto"
      style={{
        left: `min(50%, calc(100vw - 500px - 16px))`,
        transform: `translateX(-50%)`,
      }}
    >
      <h2 className="text-lg font-semibold mb-4">Settings</h2>

      <div className="mb-4 text-gray-700 font-roboto">
        <h3 className="text-md font-semibold">Settings Options:</h3>
        <p>⚙️ Settings here.</p>
      </div>

      <Button className="mt-4 bg-gray-500 text-white hover:bg-gray-600" onClick={onClose}>
        Close
      </Button>
    </div>
  );
};
