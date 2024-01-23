import { EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";
import { BaseQueryFn } from "@reduxjs/toolkit/query";
import QueryString from "qs";

export const statusApis = (builder: EndpointBuilder<BaseQueryFn, any, "api">) => ({
  getStatus: builder.query({
    query: (filter?: any) => (filter ? `status?${QueryString.stringify(filter)}` : `status`),
    providesTags: (result: any) => {
      const defaultTag = { type: "Status", id: "LIST" };
      if (result) {
        const resultTags = result.map(({ id }: any) => ({
          type: "Status" as const,
          id,
        }));
        return [...resultTags, defaultTag];
      }
      return [defaultTag];
    },
    transformResponse: (response: any) => response.data,
  }),
  getStatusById: builder.query({
    query: (id) => `status/${id}`,
    providesTags: (_result, _error, id) => [{ type: "Status", id }],
    transformResponse: (response: ObjectType) => response.data,
  }),
  deleteStatus: builder.mutation({
    query: (id: number) => ({ url: `status/${id}`, method: "DELETE" }),
    invalidatesTags: (_result, _error, id) => [{ type: "Status", id }],
    transformResponse: (response: ObjectType) => response.data,
  }),
  createStatus: builder.mutation({
    query: (body) => ({ url: `status`, method: "POST", body }),
    invalidatesTags: [{ type: "Status", id: "LIST" }],
  }),
  updateStatus: builder.mutation({
    query: ({ id, ...body }) => ({ url: `status/${id}`, method: "PATCH", body }),
    invalidatesTags: (_result, _error, { id }: any) => [{ type: "Status", id }],
  }),
});
