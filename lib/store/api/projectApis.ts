import { ObjectType } from "@lib/shared/interfaces/base";
import { BaseQueryFn } from "@reduxjs/toolkit/dist/query";
import { EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";
import QueryString from "qs";

export const projectApis = (builder: EndpointBuilder<BaseQueryFn, any, "api">) => ({
  getProjects: builder.query({
    query: (filter?: any) => {
      return filter ? `projects?${QueryString.stringify(filter)}` : `projects`;
    },
    providesTags: (result: any) => {
      const defaultTag = { type: "Project", id: "LIST" };
      if (result) {
        const resultTags = result.map(({ id }: ObjectType) => ({
          type: "Project" as const,
          id,
        }));
        return [...resultTags, defaultTag];
      }
      return [defaultTag];
    },
    transformResponse: (response: ObjectType) => response.data,
  }),
  getProject: builder.query({
    query: (id) => `projects/${id}`,
    providesTags: (_result, _error, id) => [{ type: "Project", id }],
    transformResponse: (response: ObjectType) => response.data,
  }),
  createProject: builder.mutation<any, any>({
    query: (body) => ({ url: "projects", method: "POST", body }),
    invalidatesTags: ["Project"],
  }),
  updateProject: builder.mutation<any, any>({
    query: ({ id, body }) => ({ url: `projects/${id}`, method: "PATCH", body }),
    invalidatesTags: (_result, _error, { id }) => [{ type: "Project", id }],
  }),
  deleteProject: builder.mutation({
    query: (id) => ({ url: `projects/${id}`, method: "DELETE" }),
    invalidatesTags: (_result, _error, { id }: any) => [{ type: "Project", id }],
  }),
});
