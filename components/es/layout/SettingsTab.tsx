import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Settings_tr } from "../../../lang/translations"; 

interface SettingsTabProps {
  onClose: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ onClose }) => {
  const tabRef = useRef<HTMLDivElement | null>(null);
  const language = "es";

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
    >
      <h2 className="text-lg font-semibold mb-4">{Settings_tr[language].title}</h2>

      <div className="mb-4 text-gray-700 font-roboto">
        <h3 className="text-md font-semibold">{Settings_tr[language].options}</h3>
        <p>{Settings_tr[language].description}</p>
      </div>

      <Button className="mt-4 bg-gray-500 text-white hover:bg-gray-600" onClick={onClose}>
        {Settings_tr[language].close}
      </Button>
    </div>
  );
};
