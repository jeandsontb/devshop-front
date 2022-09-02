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

const UPDATE_PASSWORD = `
  mutation changePasswordUser($id: String!, $password: String!) {
    changePasswordUser (input: {
      id: $id,
      password: $password
    })
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
    password: Yup.string()
      .min(6, "Mínimo 6 caracteres")
      .required("Campo requerido"),
  });

  const [updatedData, updateUser] = useMutation(UPDATE_PASSWORD);

  const form = useFormik({
    initialValues: {
      password: "",
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

  return (
    <Layout>
      <Title>Editar Senha: {data?.getUserById?.name}</Title>
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
                label="Nova senha"
                placeholder="Digite a nova senha"
                value={form.values.password}
                onChange={form.handleChange}
                name="password"
                errorMessage={form.errors.password}
              />
              <Button>Salvar senha</Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Edit;
