import type { DataProvider } from "@refinedev/core";
import { fetchApi } from "./lib/utils";

export const dataProvider = (apiUrl: string): DataProvider => ({
  getList: async ({ resource }) => {
    const { items: data } = await fetchApi(`${import.meta.env.VITE_API_ORIGIN}/${resource}`);
    return {
      data,
      total: data.length,
    };
  },
  getOne: async ({ resource, id }) => {
    const data = await fetchApi(`${import.meta.env.VITE_API_ORIGIN}/${resource}/${id}`);
    return {
      data,
    };
  },
  create: async ({ resource, variables, meta }) => {
    const formData = variables instanceof FormData ? variables : undefined;

    const data = await fetchApi(`api/${resource}`, {
      method: "POST",
      body: formData ?? JSON.stringify(variables),
      headers: meta?.headers ?? {
        "Content-Type": "application/json",
      },
    });
    return {
      data,
    };
  },
  update: async ({ resource, id, variables }) => {
    const data = await fetchApi(`api/${resource}/${id}`, {
      method: "PUT",
      body: JSON.stringify(variables),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return {
      data,
    };
  },
  deleteOne: async ({ resource, id }) => {
    const data = await fetchApi(`api/${resource}/${id}`, {
      method: "DELETE",
    });
    return {
      data,
    };
  },
  getApiUrl: () => apiUrl,
});
