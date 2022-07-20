import { useFormik } from "formik";
import { useRouter } from "next/router";
import React from "react";
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

      console.log(data);
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
          <a href="">Criar categoria</a>
        </div>

        <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
            <form onSubmit={form.handleSubmit}>
              <input
                type="text"
                name="name"
                onChange={form.handleChange}
                value={form.values.name}
              />
              <input
                type="text"
                name="slug"
                onChange={form.handleChange}
                value={form.values.slug}
              />
              <button type="submit">Criar categoria</button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default Index;
