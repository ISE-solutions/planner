import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PREFIX } from '~/config/database';
import { EFatherTag } from '~/config/enums';
import { AppState } from '~/store';
import { setCurrentUser } from '~/store/modules/app/actions';
import { fetchAllPerson } from '~/store/modules/person/actions';
import { fetchAllTags } from '~/store/modules/tag/actions';
import checkPermitionByTag from '~/utils/checkPermitionByTag';

export interface UserProps {
  currentUser: any;
  persons: any[];
  tags: any[];
}

export const UserContext = React.createContext<UserProps>({} as UserProps);

export const UserProvider = ({ children, context }) => {
  const dispatch = useDispatch();
  const { tag, person } = useSelector((state: AppState) => state);
  const { tagsActive } = tag;
  const { personsActive } = person;

  React.useEffect(() => {
    if (!tagsActive?.length && !tag.loading) {
      dispatch(fetchAllTags({}));
    }

    if (!personsActive?.length && !person.loading) {
      dispatch(fetchAllPerson({ active: 'Ativo' }));
    }
  }, []);

  const currentUser = React.useMemo(() => {
    if (personsActive?.length && tagsActive?.length) {
      const people = personsActive?.find(
        (pe) =>
          pe?.[`${PREFIX}email`]?.toLocaleLowerCase() ===
          (
            context.pageContext.user.email || context.pageContext.user.loginName
          )?.toLocaleLowerCase()
      );

      return {
        ...people,
        isPlanning: checkPermitionByTag(
          tagsActive,
          people?.[`${PREFIX}Pessoa_Etiqueta_Etiqueta`],
          EFatherTag.PLANEJAMENTO
        ),
        isAdmission: checkPermitionByTag(
          tagsActive,
          people?.[`${PREFIX}Pessoa_Etiqueta_Etiqueta`],
          EFatherTag.ADMISSOES
        ),
      };
    }
  }, [tagsActive, personsActive]);

  React.useEffect(() => {
    dispatch(setCurrentUser(currentUser));
  }, [currentUser]);

  const contextValue = {
    currentUser: currentUser,
    persons: personsActive,
    tags: tagsActive,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
