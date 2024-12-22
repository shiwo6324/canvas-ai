import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

// 确认弹窗的属性接口
interface UseConfirmProps {
  title: string; // 弹窗标题
  message: string; // 弹窗消息内容
}

/**
 * 确认弹窗 Hook
 * @param title - 弹窗标题
 * @param message - 弹窗消息内容
 * @returns [ConfirmDialog组件, confirm函数] - 返回确认弹窗组件和触发函数
 */
export const useConfirm = ({
  title,
  message,
}: UseConfirmProps): [() => JSX.Element, () => Promise<unknown>] => {
  // 存储 Promise 的 resolve 函数
  const [promise, setPromise] = React.useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  // 创建并返回一个新的 Promise
  const confirm = () => {
    return new Promise((resolve) => {
      setPromise({ resolve });
    });
  };

  // 关闭弹窗时清空 promise
  const handleClose = () => {
    if (promise) {
      setPromise(null);
    }
  };

  // 确认按钮点击处理
  const handleConfirm = (value: boolean) => {
    if (promise) {
      promise.resolve(value);
      handleClose();
    }
  };

  // 取消按钮点击处理
  const handleCancel = () => {
    if (promise) {
      promise.resolve(false);
      handleClose();
    }
  };

  // 确认弹窗组件
  const ConfirmDialog = () => (
    <Dialog open={promise !== null} onOpenChange={handleCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={handleCancel}>
            取消
          </Button>
          <Button onClick={() => handleConfirm(true)}>确认</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return [ConfirmDialog, confirm];
};
