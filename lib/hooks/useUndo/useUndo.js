import { useContext } from 'react';
import { UndoContext } from '../../providers/UndoProvider';
function useUndo() {
    return useContext(UndoContext);
}
export default useUndo;
//# sourceMappingURL=useUndo.js.map