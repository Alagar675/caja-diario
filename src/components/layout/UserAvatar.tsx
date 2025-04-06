
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  name: string;
  gender: "male" | "female";
}

const UserAvatar = ({ name, gender }: UserAvatarProps) => {
  return (
    <Avatar className="h-8 w-8 bg-blue-200">
      {gender === 'female' ? (
        <AvatarImage src="/avatar-female.png" alt="Female avatar" />
      ) : (
        <AvatarImage src="/avatar-male.png" alt="Male avatar" />
      )}
      <AvatarFallback className="text-blue-700">{name.charAt(0)}</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
