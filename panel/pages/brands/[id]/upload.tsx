import { useRouter } from "next/router";
import React from "react";
import { useUpload, useQuery } from "../../../hooks/graphql";
import { useFormik } from "formik";
import { Layout } from "../../../components/layout";
import { Title } from "../../../components/title";
import { Button } from "../../../components/button";

const UPLOAD_BRAND_LOGO = `
  mutation uploadBrandLogo($id: String!, $file: Upload!) {
    uploadBrandLogo (
      id: $id,
      file: $file
    )
}
`;

const Upload = () => {
  const router = useRouter();
  const { data } = useQuery(`
  query {
    getBrandById(id: "${router.query.id}") {
      id,
      name,
      slug
    }
  }
  `);

  const [updatedData, updateBrand] = useUpload(UPLOAD_BRAND_LOGO);

  const form = useFormik({
    initialValues: {
      id: router.query.id,
      file: "",
    },
    onSubmit: async (values) => {
      const brand = {
        ...values,
        id: router.query.id,
      };

      const responseData = await updateBrand(brand);
      if (responseData && !responseData.errors) {
        router.push("/brands");
      }
    },
  });

  return (
    <Layout>
      <Title>
        Upload logo da marca{" "}
        {data && data.getBrandById && data.getBrandById.name}{" "}
      </Title>
      <div className="flex flex-col mt-8">
        <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="align-middle inline-block bg-white p-12 min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
            {updatedData && !!updatedData.errors && (
              <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                Ocorreu um erro ao salvar dados.
              </p>
            )}
            <form onSubmit={form.handleSubmit}>
              <div className="flex flex-wrap -mx-3 mb-6">
                <input
                  type="file"
                  name="file"
                  onChange={(e) => {
                    form.setFieldValue("file", e.currentTarget.files);
                  }}
                />
              </div>
              <Button>Salvar marca</Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Upload;
