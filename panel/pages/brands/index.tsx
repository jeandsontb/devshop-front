import Link from "next/link";
import React from "react";
import { AlertComponent } from "../../components/Alert";
import { ButtonLink } from "../../components/button";
import { Layout } from "../../components/layout/index";
import { Table } from "../../components/table";
import { Title } from "../../components/title/index";
import { useMutation, useQuery } from "../../hooks/graphql";

const GET_ALL_BRANDS = `{
    getAllBrands {
      id,
      name,
      slug,
      logo
    }
  }`;

const DELETE_BRAND = `
  mutation deleteBrand($id: String!) {
    deleteBrand (id: $id) 
  }`;

const REMOVE_BRAND_LOGO = `
  mutation removeBrandLogo($id: String!) {
    removeBrandLogo (id: $id) 
  }`;

const Index = () => {
  const { data, mutate } = useQuery(GET_ALL_BRANDS);
  const [deleteData, deleteBrand] = useMutation(DELETE_BRAND);
  const [removeBrandLogoData, deleteBrandLogo] = useMutation(REMOVE_BRAND_LOGO);

  const remove = async (id: string) => {
    await deleteBrand({ id });
    mutate();
  };

  const removeBrandLogo = async (id: string) => {
    await deleteBrandLogo({ id });
    mutate();
  };

  return (
    <Layout>
      <Title>Gerenciar marcas</Title>
      <div className="flex flex-col mt-8">
        <div className="mb-6">
          <ButtonLink href="/brands/create">Criar marca</ButtonLink>
        </div>

        <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          {data && data.getAllBrands && data.getAllBrands.length == 0 && (
            <AlertComponent>
              <p>Nenhuma marca criada até o momento!</p>
            </AlertComponent>
          )}

          {data && data.getAllBrands && data.getAllBrands.length > 0 && (
            <div className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
              <Table>
                <Table.Head>
                  <Table.Th>Marcas</Table.Th>
                  <Table.Th></Table.Th>
                </Table.Head>

                <Table.Body>
                  {data &&
                    data.getAllBrands &&
                    data.getAllBrands.map(
                      (item: {
                        id: string;
                        name: string;
                        slug: string;
                        logo: string;
                      }) => (
                        <Table.Tr key={item.id}>
                          <Table.Td>
                            {item.logo && (
                              <img
                                src={item.logo}
                                alt={item.name}
                                className="h-20"
                              />
                            )}
                          </Table.Td>

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
                            {item.logo && (
                              <>
                                <a
                                  href="#"
                                  className="text-indigo-600 hover:text-indigo-900"
                                  onClick={() => removeBrandLogo(item.id)}
                                >
                                  Remove Logo
                                </a>
                                {" | "}
                              </>
                            )}
                            <Link href={`/brands/${item.id}/upload`}>
                              <a className="text-indigo-600 hover:text-indigo-900">
                                Upload logo
                              </a>
                            </Link>
                            {" | "}
                            <Link href={`/brands/${item.id}/edit`}>
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
