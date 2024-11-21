import { client } from '@/lib/hono';
import { useMutation } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';

// API响应类型
type ResponseType = InferResponseType<
  (typeof client.api.ai)['generate-image']['$post']
>;

// API请求类型
type RequestType = InferRequestType<
  (typeof client.api.ai)['generate-image']['$post']
>['json'];

export const useGenerateImage = () => {
  // 创建mutation实例
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      // 调用API生成图片
      const response = await client.api.ai['generate-image'].$post({ json });
      return await response.json();
    },
  });

  return mutation;
};
