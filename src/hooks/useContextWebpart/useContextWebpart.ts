import { useContext } from 'react';
import { ContextContext } from '../../providers/ContextProvider';
import { ContextProps } from '../../providers/ContextProvider/ContextProvider';

function useContextWebpart(): ContextProps {
  return useContext(ContextContext);
}

export default useContextWebpart;
