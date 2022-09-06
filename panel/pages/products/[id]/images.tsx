import { useRouter } from "next/router";
import React from "react";
import { useUpload, useQuery, useMutation } from "../../../hooks/graphql";
import { useFormik } from "formik";
import { Layout } from "../../../components/layout";
import { Title } from "../../../components/title";
import { Button } from "../../../components/button";

const UPLOAD_BRAND_IMAGE = `
  mutation uploadProductImage($id: String!, $file: Upload!) {
    uploadProductImage (
      id: $id,
        file: $file
      )
    }
  `;

const DELETE_IMAGE = `
  mutation deleteProductImage($id: String!, $url: String!) {
    deleteProductImage (id: $id, url: $url) 
  }`;

const Upload = () => {
  const router = useRouter();
  const [deleteData, deleteImage] = useMutation(DELETE_IMAGE);
  const { data, mutate } = useQuery(`
  query {
    getProductById(id: "${router.query.id}") {
      id,
      name,
      slug,
      images
    }
  }
  `);

  const [updatedData, uploadProductImage] = useUpload(UPLOAD_BRAND_IMAGE);

  const form = useFormik({
    initialValues: {
      id: router.query.id,
      file: "",
    },
    onSubmit: async (values) => {
      const product = {
        ...values,
        id: router.query.id,
      };

      const responseData = await uploadProductImage(product);
      if (responseData && !responseData.errors) {
        mutate();
        // router.push("/products");
      }
    },
  });

  const deleteImageProduct = async (url: string) => {
    await deleteImage({ id: router.query.id, url });
    mutate();
  };

  return (
    <Layout>
      <Title>Upload imagens do produto: {data?.getProductById?.name}</Title>
      <div className="flex flex-col mt-8">
        {data?.getProductById?.images?.length === 0 && (
          <p className="rounded bg-white shadow py-2 px-4 mb-4">
            Nenhuma imagem adicionada ao produto.
          </p>
        )}
        {data?.getProductById?.images?.map((item: string) => (
          <div className="p-2 m-1 border border-gray-500 rounded hover:bg-gray-400">
            <img
              src={item}
              key={item}
              alt="Imagens do produto selecionado"
              className="rounded"
            />
            <button
              onClick={() => deleteImageProduct(item)}
              className="bg-red-400 text-white font-bold p-2 rounded mt-1"
            >
              Remover
            </button>
          </div>
        ))}

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
                  onChange={(evt) => {
                    form.setFieldValue("file", evt.currentTarget.files?.[0]);
                  }}
                />
              </div>
              <Button>Enviar imagem</Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Upload;
