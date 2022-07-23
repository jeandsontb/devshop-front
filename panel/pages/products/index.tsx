import Link from "next/link";
import React from "react";
import { AlertComponent } from "../../components/Alert";
import { ButtonLink } from "../../components/button";
import { Layout } from "../../components/layout/index";
import { Table } from "../../components/table";
import { Title } from "../../components/title/index";
import { useMutation, useQuery } from "../../hooks/graphql";

const GET_ALL_PRODUCTS = `{
    getAllProducts{
      id,
      name,
      slug,
      description,
    }
  }`;

const DELETE_PRODUCT = `
  mutation deleteProduct($id: String!) {
    deleteProduct (id: $id) 
  }`;

const Index = () => {
  const { data, mutate } = useQuery(GET_ALL_PRODUCTS);
  const [deleteData, deleteProduct] = useMutation(DELETE_PRODUCT);

  const remove = async (id: string) => {
    await deleteProduct({ id });
    mutate();
  };

  return (
    <Layout>
      <Title>Gerenciar produtos</Title>
      <div className="flex flex-col mt-8">
        <div className="mb-6">
          <ButtonLink href="/products/create">Criar produto</ButtonLink>
        </div>

        <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          {data && data.getAllProducts && data.getAllProducts.length === 0 && (
            <AlertComponent>
              <p>Nenhum produto criado até o momento!</p>
            </AlertComponent>
          )}

          {data && data.getAllProducts && data.getAllProducts.length > 0 && (
            <div className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
              <Table>
                <Table.Head>
                  <Table.Th>Produtos</Table.Th>
                  <Table.Th></Table.Th>
                </Table.Head>

                <Table.Body>
                  {data &&
                    data.getAllProducts &&
                    data.getAllProducts.map(
                      (item: {
                        id: string;
                        name: string;
                        description: string;
                      }) => (
                        <Table.Tr key={item.id}>
                          <Table.Td>
                            <div className="flex items-center">
                              <div>
                                <div className="text-sm leading-5 font-medium text-gray-900">
                                  {item.name}
                                </div>
                                <div className="text-sm leading-5 text-gray-500">
                                  {item.description}
                                </div>
                              </div>
                            </div>
                          </Table.Td>

                          <Table.Td>
                            <Link href={`/products/${item.id}/edit`}>
                              <a className="text-indigo-600 hover:text-indigo-900">
                                Edit
                              </a>
                            </Link>
                            {" | "}
                            <a
                              href="#"
                              className="text-indigo-600 hover:text-indigo-900"
                              onClick={() => remove(item.id)}
                            >
                              Remove
                            </a>
                          </Table.Td>
                        </Table.Tr>
                      )
                    )}
                </Table.Body>
              </Table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
export default Index;
