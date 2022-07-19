import React from "react";

type PropsChildren = {
  children: JSX.Element;
};

const Title = ({ children }: PropsChildren) => {
  return <h3 className="text-gray-700 text-3xl font-medium">{children}</h3>;
};
export { Title };
