import { useFormik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import * as Yup from "yup";
import { Button, ButtonOutLine } from "../../components/button";
import { InputForm } from "../../components/input";
import { Layout } from "../../components/layout/index";
import { Title } from "../../components/title/index";
import { fetcher, useMutation } from "../../hooks/graphql";

const CREATE_USER = `
  mutation UserCreateInput($name: String!, $email: String!, $password: String!, $role: String!) {
    UserCreateInput (input: {
      name: $name,
      email: $email,
      password: $password,
      role: $role
    }) {
      id
      name
      email
    }
  }
`;

const UserSchema = Yup.object().shape({
  name: Yup.string().min(3, "Mínimo 3 caracteres").required("Campo requerido"),
  email: Yup.string().email("E-mail inválido").required("Campo requerido"),
  password: Yup.string()
    .min(6, "Mínimo 6 caracteres")
    .required("Campo requerido"),
});

const Index = () => {
  const [data, createUser] = useMutation(CREATE_USER);
  const router = useRouter();

  const form = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      role: "",
    },
    validationSchema: UserSchema,
    onSubmit: async (values) => {
      const data = await createUser(values);
      if (data && !data.errors) {
        router.push("/users");
      }
    },
  });

  return (
    <Layout>
      <Title>Gerenciar usuários</Title>
      <div className="flex flex-col mt-8">
        <div className="mb-6">
          <ButtonOutLine href={"/users"}>Voltar</ButtonOutLine>
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
                label="Senha"
                placeholder="Digite a senha"
                value={form.values.password}
                onChange={form.handleChange}
                name="password"
                errorMessage={form.errors.password}
              />

              <InputForm
                label="Role"
                placeholder="Digite o role do usuário"
                value={form.values.role}
                onChange={form.handleChange}
                name="role"
                errorMessage={form.errors.role}
              />
              <Button>Criar usuário</Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default Index;
