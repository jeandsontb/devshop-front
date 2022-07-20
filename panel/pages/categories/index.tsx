import React from "react";
import { Card } from "../../components/card/index";
import { Layout } from "../../components/layout/index";
import { Table } from "../../components/table";
import { Title } from "../../components/title/index";
import { useQuery } from "../../hooks/graphql";

const query = {
  query: `{
    getAllCategories {
      id,
      name,
      slug
    }
  }`,
};

const Index = () => {
  const { data, error } = useQuery(query);

  return (
    <Layout>
      <Title>Gerenciar categorias</Title>
      <div className="flex flex-col mt-8">
        <div className="mb-6">
          <a href="/categories/create">Criar categoria</a>
        </div>

        <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
            <Table>
              <Table.Head>
                <Table.Th>Categorias</Table.Th>
                <Table.Th></Table.Th>
              </Table.Head>

              <Table.Body>
                {data &&
                  data.getAllCategories &&
                  data.getAllCategories.map(
                    (item: { id: string; name: string; slug: string }) => (
                      <Table.Tr key={item.id}>
                        <Table.Td>
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm leading-5 font-medium text-gray-900">
                                {item.name}
                              </div>
                              <div className="text-sm leading-5 text-gray-500">
                                {item.slug}
                              </div>
                            </div>
                          </div>
                        </Table.Td>

                        <Table.Td>
                          <a
                            href="#"
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                          </a>
                        </Table.Td>
                      </Table.Tr>
                    )
                  )}
              </Table.Body>
            </Table>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default Index;
