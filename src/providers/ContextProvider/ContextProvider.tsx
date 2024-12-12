import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { setContext } from '~/store/modules/app/actions';

export interface ContextProps {
  context: WebPartContext;
}

export const ContextContext = React.createContext<ContextProps>(
  {} as ContextProps
);

export const ContextProvider = ({ children, context }) => {
  const dispatch = useDispatch();
  const contextValue = {
    context: context,
  };

  React.useEffect(() => {
    dispatch(setContext(context));
  }, []);
  return (
    <ContextContext.Provider value={contextValue}>
      {children}
    </ContextContext.Provider>
  );
};
