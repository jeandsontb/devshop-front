import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { fetcher, useMutation, useQuery } from "../../../hooks/graphql";
import { useFormik } from "formik";
import { Layout } from "../../../components/layout";
import { Title } from "../../../components/title";
import { InputForm } from "../../../components/input";
import { Button } from "../../../components/button";
import * as Yup from "yup";

let id = "";

const UPDATE_CATEGORY = `
  mutation updateCategory($id: String!, $name: String!, $slug: String!) {
    updateCategory (input: {
      id: $id,
      name: $name,
      slug: $slug
    }) {
      id,
      name,
      slug
    }
  }
`;

const Edit = () => {
  const router = useRouter();
  id = router?.query?.id ? router.query.id.toString() : "";
  const { data } = useQuery(`
  query {
    getCategoryById(id: "${router.query.id}") {
      id,
      name,
      slug
    }
  }
  `);

  const CategorySchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "Mínimo 3 caracteres")
      .required("Campo requerido"),
    slug: Yup.string()
      .min(3, "Mínimo 3 caracteres")
      .required("Campo requerido")
      .test(
        "is-unique",
        "Por favor, utilize outro slug. Este já está em uso.",
        async (value) => {
          const ret = await fetcher(
            JSON.stringify({
              query: `
                  query{
                    getCategoryBySlug(slug:"${value}"){
                      id
                    }
                  }
                `,
            })
          );
          if (ret.errors) {
            return true;
          }
          if (ret.data.getCategoryBySlug.id === id) {
            return true;
          }
          return false;
        }
      ),
  });

  const [updatedData, updateCategory] = useMutation(UPDATE_CATEGORY);

  const form = useFormik({
    initialValues: {
      name: "",
      slug: "",
    },
    validationSchema: CategorySchema,
    onSubmit: async (values) => {
      const category = {
        ...values,
        id: router.query.id,
      };

      const responseData = await updateCategory(category);
      if (responseData && !responseData.errors) {
        router.push("/categories");
      }
    },
  });

  useEffect(() => {
    if (data && data.getCategoryById) {
      form.setFieldValue("name", data.getCategoryById.name);
      form.setFieldValue("slug", data.getCategoryById.slug);
    }
  }, [data]);

  return (
    <Layout>
      <Title>Editar categoria</Title>
      <div className="flex flex-col mt-8">
        <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="align-middle inline-block bg-white p-12 min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
            {updatedData && !!updatedData.errors && (
              <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                Ocorreu um erro ao salvar dados.
              </p>
            )}
            <form onSubmit={form.handleSubmit}>
              <InputForm
                label="Categoria"
                placeholder="Digite o nome da categoria"
                value={form.values.name}
                onChange={form.handleChange}
                name="name"
                errorMessage={form.errors.name}
              />

              <InputForm
                label="Slug"
                placeholder="Digite o slug da categoria"
                value={form.values.slug}
                onChange={form.handleChange}
                name="slug"
                helpText="Slug é utilizado para url amigáveis."
                errorMessage={form.errors.slug}
              />
              <Button>Salvar categoria</Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Edit;
