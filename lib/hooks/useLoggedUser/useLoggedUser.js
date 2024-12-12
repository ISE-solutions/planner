import { useContext } from 'react';
import { UserContext } from '../../providers/UserProvider';
function useLogedUser() {
    return useContext(UserContext);
}
export default useLogedUser;
//# sourceMappingURL=useLoggedUser.js.map