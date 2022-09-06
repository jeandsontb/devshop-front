import Head from "next/head";

type SeoProps = {
  title?: string;
  description?: string;
};

const Seo = ({ title = "DevShop", description = "Loja virtual" }: SeoProps) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link
        rel="icon"
        href="/favicon-16x16.png"
        type="image/gif"
        sizes="16x16"
      />
    </Head>
  );
};

export { Seo };
