import { useQuery } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';
import { client } from '@/lib/hono';

export type Project = InferResponseType<
  (typeof client.api.projects)[':id']['$get'],
  200
>;

export const useGetProject = (id: string) => {
  const mutation = useQuery({
    enabled: !!id,
    queryKey: ['project', { id }],
    queryFn: async () => {
      const response = await client.api.projects[':id'].$get({ param: { id } });
      if (!response.ok) {
        throw new Error('获取项目失败');
      }
      const { data } = await response.json();
      return data;
    },
  });

  return mutation;
};
