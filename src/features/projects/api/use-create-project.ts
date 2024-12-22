import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';
import { client } from '@/lib/hono';
type ResponseType = InferResponseType<
  (typeof client.api.projects)['$post'],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.projects)['$post']
>['json'];

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.projects.$post({ json });
      if (!response.ok) {
        throw new Error('创建失败');
      }
      return await response.json();
    },
    onSuccess: () => {
      toast('创建成功');
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: () => {
      toast('创建失败');
    },
  });

  return mutation;
};
