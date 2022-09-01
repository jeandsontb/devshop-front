import { useState } from "react";
import useSWR from "swr";

const getNewAccessToken = async () => {
  const accessToken = localStorage.getItem("accessToken");
  const getAccessToken = {
    query: `
      mutation accessToken($refreshToken: String!) {
        accessToken(refreshToken: $refreshToken)
      }
    `,
    variables: {
      refreshToken: localStorage.getItem("refreshToken"),
    },
  };

  const resAccessToken = await fetch(
    process.env.NEXT_PUBLIC_API ? process.env.NEXT_PUBLIC_API : "",
    {
      headers: {
        "Content-type": "application/json",
        authorization: accessToken ?? "Bearer " + accessToken,
      },
      method: "POST",
      body: JSON.stringify(getAccessToken),
    }
  );
  const jsonAccessToken = await resAccessToken.json();

  return jsonAccessToken;
};

const fetcher = async (query: any) => {
  const accessToken = localStorage.getItem("accessToken");
  const res = await fetch(
    process.env.NEXT_PUBLIC_API ? process.env.NEXT_PUBLIC_API : "",
    {
      headers: {
        "Content-type": "application/json",
        authorization: accessToken ?? "Bearer " + accessToken,
      },
      method: "POST",
      body: query,
    }
  );

  const json = await res.json();
  if (
    !(
      json.errors &&
      json.errors[0] &&
      json.errors[0].message === "Forbidden resource"
    )
  ) {
    return json;
  }

  //pegar um novo accessToken
  const jsonAccessToken = await getNewAccessToken();
  if (jsonAccessToken.data) {
    const newAccessToken = jsonAccessToken.data.accessToken;
    localStorage.setItem("accessToken", newAccessToken);

    const res2 = await fetch(
      process.env.NEXT_PUBLIC_API ? process.env.NEXT_PUBLIC_API : "",
      {
        headers: {
          "Content-type": "application/json",
          authorization: "Bearer " + newAccessToken,
        },
        method: "POST",
        body: query,
      }
    );

    const json2 = await res2.json();
    if (!json2.errors) {
      return json2;
    }
  }

  // enviar para login
  window.location.href = "/";
  return null;
};

const uploader = async (formData: any) => {
  const accessToken = localStorage.getItem("accessToken");
  const res = await fetch(
    process.env.NEXT_PUBLIC_API ? process.env.NEXT_PUBLIC_API : "",
    {
      headers: {
        authorization: "Bearer " + accessToken,
      },
      method: "POST",
      body: formData,
    }
  );

  const json = await res.json();
  if (!json) {
    return json;
  }

  //pegar um novo accessToken
  const jsonAccessToken = await getNewAccessToken();
  if (jsonAccessToken.data) {
    const newAccessToken = jsonAccessToken.data.accessToken;
    localStorage.setItem("accessToken", newAccessToken);

    const res2 = await fetch(
      process.env.NEXT_PUBLIC_API ? process.env.NEXT_PUBLIC_API : "",
      {
        headers: {
          authorization: "Bearer " + newAccessToken,
        },
        method: "POST",
        body: formData,
      }
    );

    const json2 = await res2.json();
    if (!json2.errors) {
      return json2;
    }
  }

  // enviar para login
  window.location.href = "/";
  return null;
};

const useQuery = (queryString: any) => {
  const query = {
    query: queryString,
  };

  const allData = useSWR(JSON.stringify(query), fetcher);
  const { data, ...rest } = allData;

  return { data: data?.data, ...rest };
};

const useMutation = (query: any) => {
  const [data, setData] = useState<any>(null);
  const mutate = async (variables: any) => {
    const mutation = {
      query,
      variables,
    };
    try {
      const returnData = await fetcher(JSON.stringify(mutation));
      setData(returnData);
      return returnData;
    } catch (err) {}
  };

  return [data, mutate];
};

const useUpload = (query: any) => {
  const [data, setData] = useState<any>(null);
  const mutate = async (variables: any) => {
    const mutation = {
      query,
      variables: {
        ...variables,
        file: null,
      },
    };

    const map = {
      "0": ["variables.file"],
    };

    const formData = new FormData();
    formData.append("operations", JSON.stringify(mutation));
    formData.append("map", JSON.stringify(map));
    formData.append("0", variables.file);

    try {
      const returnData = await uploader(formData);
      setData(returnData);
      return returnData;
    } catch (err) {}
  };

  return [data, mutate];
};

export { useQuery, useMutation, fetcher, useUpload };
