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

const UPDATE_USER = `
  mutation updateUser($id: String!, $name: String!, $email: String!, $role: String!) {
    updateUser (input: {
      id: $id,
      name: $name,
      email: $email,
      role: $role
    }) {
      id
      name
      email
    }
  }
`;

const Edit = () => {
  const router = useRouter();
  id = router?.query?.id ? router.query.id.toString() : "";
  const { data } = useQuery(`
  query {
    getUserById(id: "${router.query.id}") {
      id,
      name,
      email,
      role
    }
  }
  `);

  const UserSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "Mínimo 3 caracteres")
      .required("Campo requerido"),
    email: Yup.string()
      .email("E-mail inválido")
      .required("Campo requerido")
      .test(
        "is-unique",
        "Por favor, utilize outro e-mail. Este já está em uso.",
        async (value) => {
          const ret = await fetcher(
            JSON.stringify({
              query: `
              query{
                getUserByEmail(email:"${value}"){
                  id
                }
              }
            `,
            })
          );
          if (ret.errors) {
            return true;
          }

          if (ret.data.getUserByEmail.id === id) {
            return true;
          }

          return false;
        }
      ),
  });

  const [updatedData, updateUser] = useMutation(UPDATE_USER);

  const form = useFormik({
    initialValues: {
      name: "",
      email: "",
      role: "",
    },
    validationSchema: UserSchema,
    onSubmit: async (values) => {
      const user = {
        ...values,
        id: router.query.id,
      };

      const responseData = await updateUser(user);
      if (responseData && !responseData.errors) {
        router.push("/users");
      }
    },
  });

  useEffect(() => {
    if (data && data.getUserById) {
      form.setFieldValue("name", data.getUserById.name);
      form.setFieldValue("email", data.getUserById.email);
      form.setFieldValue("role", data.getUserById.role);
    }
  }, [data]);

  return (
    <Layout>
      <Title>Editar Usuário</Title>
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
                label="Usuário"
                placeholder="Digite o nome do usuário"
                value={form.values.name}
                onChange={form.handleChange}
                name="name"
                errorMessage={form.errors.name}
              />

              <InputForm
                label="E-mail"
                placeholder="Digite o e-mail"
                value={form.values.email}
                onChange={form.handleChange}
                name="email"
                // helpText="Slug é utilizado para url amigáveis."
                errorMessage={form.errors.email}
              />

              <InputForm
                label="Role"
                placeholder="Digite o role do usuário"
                value={form.values.role}
                onChange={form.handleChange}
                name="role"
                errorMessage={form.errors.role}
              />
              <Button>Salvar usuário</Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Edit;
