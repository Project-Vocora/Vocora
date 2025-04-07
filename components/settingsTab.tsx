import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"; // Adjust the import according to your component structure
import { useLanguage } from "@/lang/LanguageContext"; // Ensure to import the useLanguage hook
import { Button } from "@/components/ui/button"; // Make sure you import the Button component

// Define props interface
interface SettingsTabProps {
  onClose: () => void; // Define the onClose prop type as a function
}

export function SettingsTab({ onClose }: SettingsTabProps) { // Use the props interface
  const { language, setLanguage } = useLanguage(); // Access the current language and the function to set it

  const handleLanguageChange = (lang: "en" | "es" | "zh") => {
    setLanguage(lang); // Change the language in the context
    onClose(); // Optionally close the settings tab after changing the language
  };

  return (
    <div className="settings-tab">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button className="bg-gray-500 text-white hover:bg-gray-600">Select Language</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => handleLanguageChange("en")}>English</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleLanguageChange("es")}>Español</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleLanguageChange("zh")}>中文</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Other settings options can go here */}
    </div>
  );
}
