import { useContext } from 'react';
import { NotificationContext } from '../../providers/NotificationProvider';
import { ContextProps } from '../../providers/NotificationProvider/NotificationProvider';

function useNotification(): ContextProps {
  return useContext(NotificationContext);
}

export default useNotification;
