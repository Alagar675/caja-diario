
import React from "react";
import UserAvatar from "./UserAvatar";

interface UserProfileDisplayProps {
  name: string;
  gender: "male" | "female";
  isMobile?: boolean;
}

const UserProfileDisplay = ({ name, gender, isMobile = false }: UserProfileDisplayProps) => {
  return (
    <div className={isMobile ? "flex items-center space-x-2 py-2 mb-2 justify-center" : "hidden md:flex items-center justify-center space-x-2 bg-blue-50 px-4 py-2 rounded-full"}>
      <UserAvatar name={name} gender={gender} />
      <span className="text-sm font-medium text-blue-700">
        {name}
      </span>
    </div>
  );
};

export default UserProfileDisplay;
