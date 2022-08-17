import { useFormik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import * as Yup from "yup";
import { Button, ButtonOutLine } from "../../components/button";
import { InputForm } from "../../components/input";
import { Layout } from "../../components/layout/index";
import { Title } from "../../components/title/index";
import { fetcher, useMutation } from "../../hooks/graphql";

const CREATE_BRAND = `
  mutation brandCreateInput($name: String!, $slug: String!) {
    brandCreateInput (input: {
      name: $name,
      slug: $slug
    }) {
      id
      name
      slug
    }
  }
`;

const BrandSchema = Yup.object().shape({
  name: Yup.string().min(3, "Mínimo 3 caracteres").required("Campo requerido"),
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
                  getBrandBySlug(slug:"${value}"){
                    id
                  }
                }
              `,
          })
        );
        if (ret.errors) {
          return true;
        }
        return false;
      }
    ),
});

const CreateBrand = () => {
  const [data, createBrand] = useMutation(CREATE_BRAND);
  const router = useRouter();

  const form = useFormik({
    initialValues: {
      name: "",
      slug: "",
    },
    validationSchema: BrandSchema,
    onSubmit: async (values) => {
      const data = await createBrand(values);
      if (data && !data.errors) {
        router.push("/brands");
      }
    },
  });

  return (
    <Layout>
      <Title>Gerenciar nova marca</Title>
      <div className="flex flex-col mt-8">
        <div className="mb-6">
          <ButtonOutLine href={"/brands"}>Voltar</ButtonOutLine>
        </div>

        <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="align-middle inline-block bg-white min-w-full p-12 shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
            {data && !!data.errors && (
              <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                Ocorreu um erro ao salvar dados.
              </p>
            )}

            <form onSubmit={form.handleSubmit}>
              <InputForm
                label="Marca"
                placeholder="Digite o nome da marca"
                value={form.values.name}
                onChange={form.handleChange}
                name="name"
                errorMessage={form.errors.name}
              />

              <InputForm
                label="Slug"
                placeholder="Digite o slug da marca"
                value={form.values.slug}
                onChange={form.handleChange}
                name="slug"
                helpText="Slug é utilizado para url amigáveis."
                errorMessage={form.errors.slug}
              />
              <Button>Criar marca</Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default CreateBrand;
