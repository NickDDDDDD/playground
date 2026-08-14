import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type PlaygroundStatus = {
  status: "ready";
  source: "rtk-query";
};

export const playgroundApi = createApi({
  reducerPath: "playgroundApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  endpoints: (builder) => ({
    getPlaygroundStatus: builder.query<PlaygroundStatus, void>({
      queryFn: () => ({
        data: {
          status: "ready",
          source: "rtk-query"
        }
      })
    })
  })
});

export const { useGetPlaygroundStatusQuery } = playgroundApi;
