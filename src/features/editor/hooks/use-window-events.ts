import { useEventListener } from 'ahooks';

export const useWindowEvents = () => {
  useEventListener('beforeunload', (event) => {
    (event || window.event).preventDefault();
    return ((event || window.event).returnValue = '您确定要离开此页面吗？');
  });
};
