import type { NextPage } from "next";
import { Layout } from "./components/Layout";
import { Seo } from "./components/Seo";
import { fetcher, useQuery } from "./lib/graphql";
import { gql } from "graphql-request";
import { GetServerSideProps } from "next";
import { Brands } from "./components/Home/Brands";

const GET_ALL_BRANDS = gql`
  query {
    brands: getAllBrands {
      id
      name
      slug
      logo
    }
  }
`;

type BrandsProps = {
  brands: any;
};

const Home: NextPage<BrandsProps> = ({ brands }) => {
  return (
    <>
      <Layout>
        <Seo />
        <h1>DevShop</h1>
        <Brands brands={brands} />
      </Layout>
    </>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { brands } = await fetcher(GET_ALL_BRANDS);

  return {
    props: {
      brands,
    },
  };
};
