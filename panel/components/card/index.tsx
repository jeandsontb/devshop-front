import React from "react";

type PropsChildren = {
  children: JSX.Element;
};

const Card = ({ children }: PropsChildren) => {
  return (
    <div className="w-full mt-6 px-6 sm:w-1/2 xl:w-1/3 xl:mt-0">
      <div className="flex items-center px-5 py-6 shadow-sm rounded-md bg-white">
        {children}
      </div>
    </div>
  );
};

const CardIcon = ({ children }: PropsChildren) => {
  return (
    <div className="p-3 rounded-full bg-pink-600 bg-opacity-75">{children}</div>
  );
};
const CardData = ({ children }: PropsChildren) => {
  return <div className="mx-5">{children}</div>;
};
const CardTitle = ({ children }: PropsChildren) => {
  return <h4 className="text-2xl font-semibold text-gray-700">{children}</h4>;
};
const CardDescription = ({ children }: PropsChildren) => {
  return <div className="text-gray-500">{children}</div>;
};
Card.Icon = CardIcon;
Card.Data = CardData;
Card.Title = CardTitle;
Card.Description = CardDescription;
export { Card };
