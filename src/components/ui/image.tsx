
import React from 'react';
import { cn } from "@/lib/utils";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  alt: string;
  src: string;
  className?: string;
}

const Image: React.FC<ImageProps> = ({ 
  src, 
  alt, 
  className, 
  ...props 
}) => {
  return (
    <img 
      src={src} 
      alt={alt} 
      className={cn("", className)}
      {...props}
    />
  );
};

export default Image;
