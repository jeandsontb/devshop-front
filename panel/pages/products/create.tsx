import { FieldArray, FormikProvider, useFormik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { Button, ButtonOutLine } from "../../components/button";
import { InputForm } from "../../components/input";
import { Layout } from "../../components/layout/index";
import { SelectForm } from "../../components/select";
import { Title } from "../../components/title/index";
import { fetcher, useMutation, useQuery } from "../../hooks/graphql";
import * as Yup from "yup";
import { useState } from "react";
import { Table } from "../../components/table";

const GET_ALL_CATEGORIES = `{
  getAllCategories {
    id,
    name,
  }
}`;

const CREATE_PRODUCT = `
  mutation createProduct($name: String!, $slug: String!, $description: String!, $category: String!, $sku: String, $price: Float, $weight: Float, $optionsNames: [String!], $variations: [VariationInput!]) {
    createProduct (input: {
      name: $name,
      slug: $slug,
      description: $description,
      category: $category,
      sku: $sku,
      price: $price,
      weight: $weight,
      optionsNames: $optionsNames,
      variations: $variations
    }) {
      id
      name
      slug
    }
  }
`;

type ObjectFormValues = {
  name: string;
  slug: string;
  description: string;
  category: string;
  sku: string;
  price: number;
  weight: number;
  optionName1: string;
  optionName2: string;
  variations: {
    optionName1: string;
    optionName2: string;
    sku: string;
    price: number;
    weight: number;
  }[];
  optionsNames: string[];
};

type ObjectVariations = {
  optionName1: string;
  optionName2: string;
  sku: string;
  price: string;
  weight: string;
};

const productSchema = Yup.object().shape({
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
                  getProductBySlug(slug:"${value}"){
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
  description: Yup.string()
    .min(10, "Mínimo 10 caracteres")
    .required("Campo requerido"),
  category: Yup.string()
    .min(1, "Mínimo 3 caracteres")
    .required("Campo requerido"),
});

const Index = () => {
  const { data: categoryData } = useQuery(GET_ALL_CATEGORIES);
  const [data, createProduct] = useMutation(CREATE_PRODUCT);
  const [variations, setVariations] = useState([] as ObjectVariations[]);
  const router = useRouter();

  const form = useFormik<ObjectFormValues>({
    initialValues: {
      name: "",
      slug: "",
      description: "",
      category: "",
      sku: "",
      price: 0,
      weight: 0,
      optionName1: "",
      optionName2: "",
      variations: [],
      optionsNames: [],
    },
    validationSchema: productSchema,
    onSubmit: async (values) => {
      const newValues = {
        ...values,
        price: Number(values.price),
        weight: Number(values.weight),
        optionsNames: [values.optionName1, values.optionName2],
        variations: values.variations.map((variation) => {
          return {
            ...variation,
            price: Number(variation.price),
            weight: Number(variation.weight),
          };
        }),
      };

      const data = await createProduct(newValues);
      if (data && !data.errors) {
        router.push("/products");
      }
    },
  });

  // TRATAR OS OPTIONS
  let options = [];
  if (categoryData && categoryData.getAllCategories) {
    options = categoryData.getAllCategories.map(
      (item: { id: string; name: string }) => ({ id: item.id, name: item.name })
    );
  }

  const addVariations = () => {
    setVariations((old) => {
      return [
        ...old,
        { optionName1: "", optionName2: "", sku: "", price: "", weight: "" },
      ];
    });
  };

  return (
    <Layout>
      <Title>Gerenciar produtos</Title>
      <div className="flex flex-col mt-8">
        <div className="mb-6">
          <ButtonOutLine href={"/products"}>Voltar</ButtonOutLine>
        </div>

        <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="align-middle inline-block bg-white min-w-full p-12 shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
            {data && !!data.errors && (
              <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                Ocorreu um erro ao salvar produto.
              </p>
            )}
            <form onSubmit={form.handleSubmit}>
              <InputForm
                label="Nome do produto"
                placeholder="Digite o nome do produto"
                value={form.values.name}
                onChange={form.handleChange}
                name="name"
                errorMessage={form.errors.name}
              />

              <InputForm
                label="Slug"
                placeholder="Digite o slug do produto"
                value={form.values.slug}
                onChange={form.handleChange}
                name="slug"
                helpText="Slug é utilizado para url amigáveis."
                errorMessage={form.errors.slug}
              />

              <InputForm
                label="Descrição"
                placeholder="Digite a descrição do produto"
                value={form.values.description}
                onChange={form.handleChange}
                name="description"
                errorMessage={form.errors.description}
              />

              <SelectForm
                label="Selecione uma categoria"
                name="category"
                onChange={form.handleChange}
                value={form.values.category}
                options={options}
                errorMessage={form.errors.category}
                initial={{ id: "", name: "Selecione..." }}
              />

              <InputForm
                label="SKU do produto"
                placeholder="Digite o SKU do produto"
                value={form.values.sku}
                onChange={form.handleChange}
                name="sku"
                errorMessage={form.errors.sku}
              />

              <InputForm
                label="Preço do produto"
                placeholder="Digite o proço do produto"
                value={String(form.values.price)}
                onChange={form.handleChange}
                name="price"
                errorMessage={form.errors.price}
              />

              <InputForm
                label="Tamanho do produto"
                placeholder="Digite o tamanho do produto"
                value={String(form.values.weight)}
                onChange={form.handleChange}
                name="weight"
                errorMessage={form.errors.weight}
              />

              <h3>Variações / Grade de produtos</h3>

              <InputForm
                label="Opção de variação 1"
                placeholder="Digite a primeira variação do produto"
                value={form.values.optionName1}
                onChange={form.handleChange}
                name="optionName1"
                errorMessage={form.errors.optionName1}
              />

              <InputForm
                label="Opção de variação 2"
                placeholder="Digite a segunda variação do produto"
                value={form.values.optionName2}
                onChange={form.handleChange}
                name="optionName2"
                errorMessage={form.errors.optionName2}
              />

              {form.values.optionName1 !== "" && (
                <>
                  {/* <pre>{JSON.stringify(form.values, null, 2)}</pre> */}

                  <FormikProvider value={form}>
                    <FieldArray
                      name="variations"
                      render={(arrayHelpers) => {
                        return (
                          <div className="shadow">
                            <button
                              type="button"
                              onClick={() =>
                                arrayHelpers.push({
                                  optionName1: "",
                                  optionName2: "",
                                  sku: "",
                                  price: 0,
                                  weight: 0,
                                })
                              }
                              style={{
                                height: 40,
                                width: 160,
                                borderRadius: 5,
                                color: "#FFFFFF",
                                fontWeight: "bold",
                                background: "#2f88d1",
                                marginRight: 20,
                                marginBottom: 10,
                              }}
                            >
                              Adicionar variação
                            </button>
                            <Table>
                              <Table.Head>
                                <Table.Th>{form.values.optionName1}</Table.Th>
                                {form.values.optionName2 !== "" && (
                                  <Table.Th>{form.values.optionName2}</Table.Th>
                                )}
                                <Table.Th>SKU</Table.Th>
                                <Table.Th>Preço</Table.Th>
                                <Table.Th>Tamanho</Table.Th>
                                <Table.Th></Table.Th>
                              </Table.Head>

                              <Table.Body>
                                {form.values.variations.map(
                                  (variation, index) => (
                                    <Table.Tr key={index}>
                                      <Table.Td>
                                        <InputForm
                                          label={form.values.optionName1}
                                          placeholder="Digite a primeira variação do produto"
                                          value={
                                            form.values.variations[index]
                                              .optionName1
                                          }
                                          onChange={form.handleChange}
                                          name={`variations.${index}.optionName1`}
                                        />
                                      </Table.Td>
                                      {form.values.optionName2 !== "" && (
                                        <Table.Td>
                                          <InputForm
                                            label={form.values.optionName2}
                                            placeholder="Digite a segunda variação do produto"
                                            value={
                                              form.values.variations[index]
                                                .optionName2
                                            }
                                            onChange={form.handleChange}
                                            name={`variations.${index}.optionName2`}
                                          />
                                        </Table.Td>
                                      )}

                                      <Table.Td>
                                        <InputForm
                                          label="SKU"
                                          placeholder="Digite o sku"
                                          value={
                                            form.values.variations[index].sku
                                          }
                                          onChange={form.handleChange}
                                          name={`variations.${index}.sku`}
                                        />
                                      </Table.Td>

                                      <Table.Td>
                                        <InputForm
                                          label="Preço"
                                          placeholder="Digite o preço"
                                          value={String(
                                            form.values.variations[index].price
                                          )}
                                          onChange={form.handleChange}
                                          name={`variations.${index}.price`}
                                        />
                                      </Table.Td>

                                      <Table.Td>
                                        <InputForm
                                          label="Peso"
                                          placeholder="Digite o peso"
                                          value={String(
                                            form.values.variations[index].weight
                                          )}
                                          onChange={form.handleChange}
                                          name={`variations.${index}.weight`}
                                        />
                                      </Table.Td>
                                      <Table.Td>
                                        <button
                                          style={{
                                            width: 35,
                                            height: 35,
                                            borderRadius: 20,
                                            justifyContent: "center",
                                            alignItems: "center",
                                            backgroundColor: "#FF0000",
                                            color: "#FFFFFF",
                                            fontSize: 9,
                                            fontWeight: "bold",
                                          }}
                                          type="button"
                                          onClick={() =>
                                            arrayHelpers.remove(index)
                                          }
                                        >
                                          Excluir
                                        </button>
                                      </Table.Td>
                                    </Table.Tr>
                                  )
                                )}
                              </Table.Body>
                            </Table>
                          </div>
                        );
                      }}
                    ></FieldArray>
                  </FormikProvider>
                </>
              )}

              <Button>Criar produto</Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default Index;
