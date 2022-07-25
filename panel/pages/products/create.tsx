import { useFormik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { Button, ButtonOutLine } from "../../components/button";
import { InputForm } from "../../components/input";
import { Layout } from "../../components/layout/index";
import { SelectForm } from "../../components/select";
import { Title } from "../../components/title/index";
import { useMutation, useQuery } from "../../hooks/graphql";

const GET_ALL_CATEGORIES = `{
  getAllCategories {
    id,
    name,
  }
}`;

const CREATE_PRODUCT = `
  mutation createProduct($name: String!, $slug: String!, $description: String!, $category: String!) {
    createProduct (input: {
      name: $name,
      slug: $slug,
      description: $description,
      category: $category
    }) {
      id
      name
      slug
    }
  }
`;

const Index = () => {
  const { data: categoryData } = useQuery(GET_ALL_CATEGORIES);
  const [data, createProduct] = useMutation(CREATE_PRODUCT);
  const router = useRouter();

  const form = useFormik({
    initialValues: {
      name: "",
      slug: "",
      description: "",
      category: "",
    },
    onSubmit: async (values) => {
      const data = await createProduct(values);
      if (data && !data.errors) {
        router.push("/products");
      }
    },
  });

  // TRATAR OS OPTIONS
  let options = [];
  if (categoryData && categoryData.getAllCategories) {
    options = categoryData.getAllCategories.map(
      (item: { id: string; name: string }) => ({ id: item.id, name: item.name })
    );
  }

  return (
    <Layout>
      <Title>Gerenciar produtos</Title>
      <div className="flex flex-col mt-8">
        <div className="mb-6">
          <ButtonOutLine href={"/products"}>Voltar</ButtonOutLine>
        </div>

        <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="align-middle inline-block bg-white min-w-full p-12 shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
            {data && !!data.errors && (
              <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                Ocorreu um erro ao salvar produto.
              </p>
            )}
            <form onSubmit={form.handleSubmit}>
              <InputForm
                label="Nome do produto"
                placeholder="Digite o nome do produto"
                value={form.values.name}
                onChange={form.handleChange}
                name="name"
              />

              <InputForm
                label="Slug"
                placeholder="Digite o slug do produto"
                value={form.values.slug}
                onChange={form.handleChange}
                name="slug"
                helpText="Slug é utilizado para url amigáveis."
              />

              <InputForm
                label="Descrição"
                placeholder="Digite a descrição do produto"
                value={form.values.description}
                onChange={form.handleChange}
                name="description"
              />

              <SelectForm
                label="Selecione uma categoria"
                name="category"
                onChange={form.handleChange}
                value={form.values.category}
                options={options}
              />
              <Button>Criar produto</Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default Index;
