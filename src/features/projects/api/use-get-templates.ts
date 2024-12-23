import { client } from '@/lib/hono';
import { useQuery } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';

export type Template = InferResponseType<
  typeof client.api.projects.templates.$get,
  200
>;

export type TemplatesResponseType = InferRequestType<
  typeof client.api.projects.templates.$get
>['query'];

export const useGetTemplates = (apiQuery: TemplatesResponseType) => {
  const query = useQuery({
    queryKey: ['templates', { page: apiQuery.page, limit: apiQuery.limit }],
    queryFn: async () => {
      const response = await client.api.projects.templates.$get({
        query: apiQuery,
      });

      if (!response.ok) {
        throw new Error('获取模板失败');
      }
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};
