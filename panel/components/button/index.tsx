import React from "react";
import Link from "next/link";

type ButtonLinkProps = {
  children: JSX.Element | string;
  href: string;
};

type ButtonProps = {
  children: JSX.Element | string;
  type?: "submit" | "button" | "reset" | undefined;
};

const Button = ({ children, type = "submit", ...props }: ButtonProps) => {
  return (
    <button
      type={type}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      {...props}
    >
      {children}
    </button>
  );
};

const ButtonLink = ({ href, children }: ButtonLinkProps) => {
  return (
    <Link href={href}>
      <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        {children}
      </a>
    </Link>
  );
};

const ButtonOutLine = ({ href, children }: ButtonLinkProps) => {
  return (
    <Link href={href}>
      <a className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
        {children}
      </a>
    </Link>
  );
};

export { Button, ButtonLink, ButtonOutLine };
