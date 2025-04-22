
import React from "react";
import { Button } from "@/components/ui/button";
import Image from "@/components/ui/image";

interface NavbarLogoProps {
  onLogoClick: (event?: React.MouseEvent) => void;
}

const NavbarLogo = ({ onLogoClick }: NavbarLogoProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Image 
        src="/lovable-uploads/1dd588be-cbaf-47c8-8924-e510ea18d27f.png" 
        alt="Daily Cash Report Logo" 
        className="h-8 w-8 object-cover cursor-pointer"
        onClick={onLogoClick}
      />
      <Button
        variant="ghost"
        className="font-bold text-blue-700 text-md"
        onClick={onLogoClick}
      >
        Daily Cash Report
      </Button>
    </div>
  );
};

export default NavbarLogo;
