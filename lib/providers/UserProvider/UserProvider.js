import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PREFIX } from '~/config/database';
import { EFatherTag } from '~/config/enums';
import { setCurrentUser } from '~/store/modules/app/actions';
import { fetchAllPerson } from '~/store/modules/person/actions';
import { fetchAllTags } from '~/store/modules/tag/actions';
import checkPermitionByTag from '~/utils/checkPermitionByTag';
export const UserContext = React.createContext({});
export const UserProvider = ({ children, context }) => {
    const dispatch = useDispatch();
    const { tag, person } = useSelector((state) => state);
    const { tagsActive } = tag;
    const { personsActive } = person;
    React.useEffect(() => {
        if (!(tagsActive === null || tagsActive === void 0 ? void 0 : tagsActive.length) && !tag.loading) {
            dispatch(fetchAllTags({}));
        }
        if (!(personsActive === null || personsActive === void 0 ? void 0 : personsActive.length) && !person.loading) {
            dispatch(fetchAllPerson({ active: 'Ativo' }));
        }
    }, []);
    const currentUser = React.useMemo(() => {
        if ((personsActive === null || personsActive === void 0 ? void 0 : personsActive.length) && (tagsActive === null || tagsActive === void 0 ? void 0 : tagsActive.length)) {
            const people = personsActive === null || personsActive === void 0 ? void 0 : personsActive.find((pe) => {
                var _a, _b;
                return ((_a = pe === null || pe === void 0 ? void 0 : pe[`${PREFIX}email`]) === null || _a === void 0 ? void 0 : _a.toLocaleLowerCase()) ===
                    ((_b = (context.pageContext.user.email || context.pageContext.user.loginName)) === null || _b === void 0 ? void 0 : _b.toLocaleLowerCase());
            });
            return Object.assign(Object.assign({}, people), { isPlanning: checkPermitionByTag(tagsActive, people === null || people === void 0 ? void 0 : people[`${PREFIX}Pessoa_Etiqueta_Etiqueta`], EFatherTag.PLANEJAMENTO), isAdmission: checkPermitionByTag(tagsActive, people === null || people === void 0 ? void 0 : people[`${PREFIX}Pessoa_Etiqueta_Etiqueta`], EFatherTag.ADMISSOES) });
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
    return (React.createElement(UserContext.Provider, { value: contextValue }, children));
};
//# sourceMappingURL=UserProvider.js.map