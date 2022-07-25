import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useMutation, useQuery } from "../../../hooks/graphql";
import { useFormik } from "formik";
import { Layout } from "../../../components/layout";
import { Title } from "../../../components/title";
import { InputForm } from "../../../components/input";
import { Button } from "../../../components/button";
import { SelectForm } from "../../../components/select";

const GET_ALL_CATEGORIES = `{
  getAllCategories {
    id,
    name,
  }
}`;

const UPDATE_PRODUCT = `
  mutation updateProduct($id: String!, $name: String!, $slug: String!, $description: String!, $category: String!) {
    updateProduct(input: {
      id: $id,
      name: $name,
      slug: $slug,
      description: $description,
      category: $category
    }) {
      id,
      name,
      slug,
      description,
      category
    }
  }
`;

const Edit = () => {
  const router = useRouter();
  const { data } = useQuery(`
  query {
    getProductById(id: "${router.query.id}") {
      id, 		
      name, 
      slug,
      description
    }
  }
  `);

  const { data: categoryData } = useQuery(GET_ALL_CATEGORIES);
  const [updatedData, updateProduct] = useMutation(UPDATE_PRODUCT);

  const form = useFormik({
    initialValues: {
      name: "",
      slug: "",
      description: "",
      category: "",
    },
    onSubmit: async (values) => {
      const category = {
        ...values,
        id: router.query.id,
      };

      const responseData = await updateProduct(category);
      if (responseData && !responseData.errors) {
        router.push("/products");
      }
    },
  });

  useEffect(() => {
    if (data && data.getProductById) {
      form.setFieldValue("name", data.getProductById.name);
      form.setFieldValue("slug", data.getProductById.slug);
      form.setFieldValue("description", data.getProductById.description);
      form.setFieldValue("category", data.getProductById.category);
    }
  }, [data]);

  // TRATAR OS OPTIONS
  let options = [];
  if (categoryData && categoryData.getAllCategories) {
    options = categoryData.getAllCategories.map(
      (item: { id: string; name: string }) => ({ id: item.id, name: item.name })
    );
  }

  return (
    <Layout>
      <Title>Editar produto</Title>
      <div className="flex flex-col mt-8">
        <div className="mb-6">
          <a href="">Editar produto</a>
        </div>

        <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="align-middle inline-block bg-white p-12 min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
            {updatedData && !!updatedData.errors && (
              <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                Ocorreu um erro ao salvar dados.
              </p>
            )}
            <form onSubmit={form.handleSubmit}>
              <InputForm
                label="Produto"
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
              <Button>Salvar produto</Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Edit;
