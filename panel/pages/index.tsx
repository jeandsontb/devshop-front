import React from "react";
import { InputForm } from "../components/input";
import { useFormik } from "formik";
import { Button } from "../components/button";
import { useMutation } from "../hooks/graphql";
import { useRouter } from "next/router";

const AUTH = `
  mutation auth($email: String!, $password: String!) {
    auth (input: {
      email: $email,
      password: $password
    }) {
      refreshToken,
      accessToken
    }
  }
`;

const Index = () => {
  const [authData, auth] = useMutation(AUTH);
  const router = useRouter();

  const form = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      const data = await auth(values);
      if (data && data.data) {
        localStorage.setItem("refreshToken", data.data.auth.refreshToken);
        localStorage.setItem("accessToken", data.data.auth.accessToken);
        router.push("/dashboard");
      } else {
        console.log("error");
      }
    },
  });

  return (
    <div className="bg-grey-lighter min-h-screen flex flex-col">
      <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
        <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
          <h1 className="mb-8 text-3xl text-center">Sign in</h1>

          <form onSubmit={form.handleSubmit}>
            <InputForm
              label="E-mail"
              placeholder="Digite o e-mail"
              value={form.values.email}
              onChange={form.handleChange}
              name="email"
              errorMessage={form.errors.email}
            />

            <InputForm
              label="Senha"
              placeholder="Digite sua senha"
              value={form.values.password}
              onChange={form.handleChange}
              name="password"
              errorMessage={form.errors.password}
            />

            <Button>Entrar</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Index;
