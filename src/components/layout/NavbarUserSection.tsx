
import React from "react";
import UserProfileDisplay from "./UserProfileDisplay";

interface NavbarUserSectionProps {
  user: any;
  formattedName: string;
  userGender: "male" | "female";
}

const NavbarUserSection = ({ user, formattedName, userGender }: NavbarUserSectionProps) => {
  if (!user) return null;

  return (
    <UserProfileDisplay
      name={formattedName}
      gender={userGender}
    />
  );
};

export default NavbarUserSection;
