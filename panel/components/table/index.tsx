import React from "react";

const Table = ({ children }: any) => {
  return <table className="min-w-full">{children}</table>;
};

const TableHead = ({ children }: any) => {
  return (
    <thead>
      <tr>{children}</tr>
    </thead>
  );
};
const TableTh = ({ children }: any) => {
  return (
    <th className="px-6 py-3 border-b border-gray-200 bg-blue-100 text-left text-xs leading-4 font-medium text-gray-700 uppercase tracking-wider">
      {children}
    </th>
  );
};
const TableBody = ({ children }: any) => {
  return <tbody className="bg-white">{children}</tbody>;
};
const TableTr = ({ children }: any) => <tr>{children}</tr>;
const TableTd = ({ children }: any) => (
  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
    {children}
  </td>
);
Table.Head = TableHead;
Table.Th = TableTh;
Table.Body = TableBody;
Table.Tr = TableTr;
Table.Td = TableTd;

export { Table };
