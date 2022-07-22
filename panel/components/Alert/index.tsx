import React from "react";

type AlertProps = {
  children: JSX.Element | string;
};

const AlertComponent = ({ children }: AlertProps) => {
  return (
    <div
      className="bg-orange-100 border-1-4 border-orange-500 text-orange-700 p-4"
      role="alert"
    >
      {children}
    </div>
  );
};
export { AlertComponent };
