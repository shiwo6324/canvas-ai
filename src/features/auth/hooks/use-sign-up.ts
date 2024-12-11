// 导入所需依赖
import { useMutation } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';

import { client } from '@/lib/hono';
import { toast } from '@/hooks/use-toast';

// 定义 API 响应和请求的类型
type ResponseType = InferResponseType<(typeof client.api.users)['$post']>;
type RequestType = InferRequestType<(typeof client.api.users)['$post']>['json'];

/**
 * 用户注册功能的 Hook
 * @returns 用于管理注册状态和操作的 mutation 对象
 */
export const useSignUp = () => {
  // 创建用于注册 API 调用的 mutation
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      // 向用户端点发送 POST 请求
      const response = await client.api.users.$post({ json });
      if (!response.ok) {
        throw new Error('出错了~');
      }
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: '注册成功',
      });
    },
    // onError: (error) => {
    //   toast({
    //     title: '注册失败',
    //     description: error.message,
    //   });
    // },
  });

  return mutation;
};
