import { useContext } from 'react';
import { UndoContext } from '../../providers/UndoProvider';
import { ContextProps } from '../../providers/UndoProvider/UndoProvider';

function useUndo(): ContextProps {
  return useContext(UndoContext);
}

export default useUndo;
