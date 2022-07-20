import { useFormik } from "formik";
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

  const form = useFormik({
    initialValues: {
      name: "",
      slug: "",
    },
    onSubmit: (values) => {
      console.log(values);
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
