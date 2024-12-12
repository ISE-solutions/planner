import { useContext } from 'react';
import { ConfirmationContext } from '../../providers/ConfirmationProvider';
import { ContextProps } from '../../providers/ConfirmationProvider/ConfirmationProvider';

function useConfirmation(): ContextProps {
  return useContext(ConfirmationContext);
}

export default useConfirmation;
