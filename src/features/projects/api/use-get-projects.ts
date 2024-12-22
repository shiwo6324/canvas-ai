import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';
import { client } from '@/lib/hono';

export type Project = InferResponseType<
  (typeof client.api.projects)['$get'],
  200
>;

export const useGetProjects = () => {
  const query = useInfiniteQuery<Project, Error>({
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    queryKey: ['projects'],
    queryFn: async ({ pageParam }) => {
      const response = await client.api.projects['$get']({
        query: {
          page: pageParam as string,
          limit: '5',
        },
      });
      if (!response.ok) {
        throw new Error('获取项目失败');
      }
      return response.json();
    },
  });

  return query;
};
