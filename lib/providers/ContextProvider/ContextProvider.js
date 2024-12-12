import * as React from 'react';
import { useDispatch } from 'react-redux';
import { setContext } from '~/store/modules/app/actions';
export const ContextContext = React.createContext({});
export const ContextProvider = ({ children, context }) => {
    const dispatch = useDispatch();
    const contextValue = {
        context: context,
    };
    React.useEffect(() => {
        dispatch(setContext(context));
    }, []);
    return (React.createElement(ContextContext.Provider, { value: contextValue }, children));
};
//# sourceMappingURL=ContextProvider.js.map