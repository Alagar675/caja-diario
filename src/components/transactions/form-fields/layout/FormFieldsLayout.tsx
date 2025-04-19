
import React from "react";

interface FormFieldsLayoutProps {
  children: React.ReactNode;
}

export const FormFieldsLayout: React.FC<FormFieldsLayoutProps> = ({ children }) => {
  return (
    <div className="space-y-6">
      {children}
    </div>
  );
};
