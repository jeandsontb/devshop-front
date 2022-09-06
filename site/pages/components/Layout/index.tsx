import { ReactNode } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";

type LayoutProps = {
  children?: JSX.Element | JSX.Element[] | ReactNode | ReactNode[];
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Header />
      <div className="container px-5 py-8 mx-auto">{children}</div>
      <Footer />
    </>
  );
};

export { Layout };
