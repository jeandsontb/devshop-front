import { useRouter } from "next/router";
import React from "react";
import { AlertComponent } from "../../../components/Alert";
import { Layout } from "../../../components/layout/index";
import { Table } from "../../../components/table";
import { Title } from "../../../components/title/index";
import { useMutation, useQuery } from "../../../hooks/graphql";
import { ptBR } from "date-fns/locale";
import { formatDistance, subDays } from "date-fns";

const INVALIDATE_USER_SESSION = `
  mutation invalidateUserSession($id: String!) {
    invalidateUserSession (id: $id) 
  }`;

const Sessions = () => {
  const router = useRouter();
  const [deleteData, deleteUserSession] = useMutation(INVALIDATE_USER_SESSION);
  const { data, mutate } = useQuery(`
  query {
    getAllUsersSessions(id: "${router.query.id}") {
      id,
      userAgent,
      lastUsedAt,
      active
    }
  }
  `);

  const remove = async (id: string) => {
    await deleteUserSession({ id });
    mutate();
  };

  return (
    <Layout>
      <Title>Gerenciar sessões de usuários</Title>
      <div className="flex flex-col mt-8">
        <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          {data &&
            data.getAllUsersSessions &&
            data.getAllUsersSessions.length == 0 && (
              <AlertComponent>
                <p>Usuário ainda não autenticou-se.</p>
              </AlertComponent>
            )}

          {data &&
            data.getAllUsersSessions &&
            data.getAllUsersSessions.length > 0 && (
              <div className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
                <Table>
                  <Table.Head>
                    <Table.Th>Sessões</Table.Th>
                    <Table.Th>Usado</Table.Th>
                    <Table.Th></Table.Th>
                  </Table.Head>

                  <Table.Body>
                    {data &&
                      data.getAllUsersSessions &&
                      data.getAllUsersSessions.map(
                        (item: {
                          id: string;
                          userAgent: string;
                          lastUsedAt: string;
                          active: string;
                        }) => (
                          <Table.Tr key={item.id}>
                            <Table.Td>
                              <div className="flex items-center">
                                <div>
                                  <div className="text-sm leading-5 font-medium text-gray-900">
                                    {item.id}
                                  </div>
                                  <div className="text-sm leading-5 text-gray-500">
                                    {item.userAgent}
                                  </div>
                                </div>
                              </div>
                            </Table.Td>

                            <Table.Td>
                              {formatDistance(
                                new Date(item.lastUsedAt),
                                new Date(),
                                {
                                  locale: ptBR,
                                }
                              )}
                            </Table.Td>

                            <Table.Td>
                              {item.active && (
                                <a
                                  href="#"
                                  className="text-indigo-600 hover:text-indigo-900"
                                  onClick={() => remove(item.id)}
                                >
                                  Remove
                                </a>
                              )}
                              {!item.active && <span>Inativo</span>}
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
export default Sessions;
