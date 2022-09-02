import Link from "next/link";
import React from "react";
import { AlertComponent } from "../../components/Alert";
import { ButtonLink } from "../../components/button";
import { Layout } from "../../components/layout/index";
import { Table } from "../../components/table";
import { Title } from "../../components/title/index";
import { useMutation, useQuery } from "../../hooks/graphql";

const GET_ALL_USERS = `{
  getAllUsers {
      id,
      name,
      email
    }
  }`;

const DELETE_USER = `
  mutation deleteUser($id: String!) {
    deleteUser (id: $id) 
  }`;

const Index = () => {
  const { data, mutate } = useQuery(GET_ALL_USERS);
  const [deleteData, deleteUser] = useMutation(DELETE_USER);

  const remove = async (id: string) => {
    await deleteUser({ id });
    mutate();
  };

  return (
    <Layout>
      <Title>Gerenciar usuários</Title>
      <div className="flex flex-col mt-8">
        <div className="mb-6">
          <ButtonLink href="/users/create">Criar usuário</ButtonLink>
        </div>

        <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          {data && data.getAllUsers && data.getAllUsers.length == 0 && (
            <AlertComponent>
              <p>Nenhum usuário criado até o momento!</p>
            </AlertComponent>
          )}

          {data && data.getAllUsers && data.getAllUsers.length > 0 && (
            <div className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
              <Table>
                <Table.Head>
                  <Table.Th>Usuários</Table.Th>
                  <Table.Th></Table.Th>
                </Table.Head>

                <Table.Body>
                  {data &&
                    data.getAllUsers &&
                    data.getAllUsers.map(
                      (item: { id: string; name: string; email: string }) => (
                        <Table.Tr key={item.id}>
                          <Table.Td>
                            <div className="flex items-center">
                              <div>
                                <div className="text-sm leading-5 font-medium text-gray-900">
                                  {item.name}
                                </div>
                                <div className="text-sm leading-5 text-gray-500">
                                  {item.email}
                                </div>
                              </div>
                            </div>
                          </Table.Td>

                          <Table.Td>
                            <Link href={`/users/${item.id}/edit`}>
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
