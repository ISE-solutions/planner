import { useContext } from 'react';
import { UserContext } from '../../providers/UserProvider';
import { UserProps } from '../../providers/UserProvider/UserProvider';

function useLogedUser(): UserProps {
  return useContext(UserContext);
}

export default useLogedUser;
