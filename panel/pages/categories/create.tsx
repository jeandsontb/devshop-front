import { useFormik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { Button, ButtonOutLine } from "../../components/button";
import { InputForm } from "../../components/input";
import { Layout } from "../../components/layout/index";
import { Title } from "../../components/title/index";
import { useMutation } from "../../hooks/graphql";

const CREATE_CATEGORY = `
  mutation CategoryCreateInput($name: String!, $slug: String!) {
    CategoryCreateInput (input: {
      name: $name,
      slug: $slug
    }) {
      id
      name
      slug
    }
  }
`;

const Index = () => {
  const [data, createCategory] = useMutation(CREATE_CATEGORY);
  const router = useRouter();

  const form = useFormik({
    initialValues: {
      name: "",
      slug: "",
    },
    onSubmit: async (values) => {
      const data = await createCategory(values);
      if (data && !data.errors) {
        router.push("/categories");
      }
    },
  });

  return (
    <Layout>
      <Title>Gerenciar categorias</Title>
      <div className="flex flex-col mt-8">
        <div className="mb-6">
          <ButtonOutLine href={"/categories"}>Voltar</ButtonOutLine>
        </div>

        <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="align-middle inline-block bg-white min-w-full p-12 shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
            <form onSubmit={form.handleSubmit}>
              <InputForm
                label="Categoria"
                placeholder="Digite o nome da categoria"
                value={form.values.name}
                onChange={form.handleChange}
                name="name"
              />

              <InputForm
                label="Slug"
                placeholder="Digite o slug da categoria"
                value={form.values.slug}
                onChange={form.handleChange}
                name="slug"
                helpText="Slug é utilizado para url amigáveis."
              />
              <Button>Criar categoria</Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default Index;
