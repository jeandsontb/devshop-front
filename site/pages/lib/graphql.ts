import { request } from "graphql-request";
import useSWR from "swr";

const connections = process.env.NEXT_PUBLIC_API
  ? process.env.NEXT_PUBLIC_API
  : "";

export const fetcher = (query: any) => request(connections, query);

export const useQuery = (query: any) => {
  return useSWR(query, fetcher);
};
