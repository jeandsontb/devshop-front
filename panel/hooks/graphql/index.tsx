import { useState } from "react";
import useSWR from "swr";

const fetcher = async (query: any) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API ? process.env.NEXT_PUBLIC_API : "",
    {
      headers: {
        "Content-type": "application/json",
      },
      method: "POST",
      body: query,
    }
  );

  const json = await res.json();
  return json;
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

const uploader = async (formData: any) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API ? process.env.NEXT_PUBLIC_API : "",
    {
      headers: {},
      method: "POST",
      body: formData,
    }
  );

  const json = await res.json();
  return json;
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
