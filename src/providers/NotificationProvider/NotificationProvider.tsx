import * as React from 'react';
import {
  Alert as MuiAlert,
  AlertProps,
  Color,
  AlertTitle,
} from '@material-ui/lab';
import { Snackbar, SnackbarOrigin } from '@material-ui/core';

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
}

interface NotificationParameters {
  title: string;
  description: string;
}

export interface NotificationActionProps {
  error: (notification: NotificationParameters) => void;
  info: (notification: NotificationParameters) => void;
  success: (notification: NotificationParameters) => void;
}

export interface ContextProps {
  notification: NotificationActionProps;
}

export const NotificationContext = React.createContext<ContextProps>(
  {} as ContextProps
);

export const NotificationProvider = ({ children }) => {
  const [isNotificationVisible, setIsNotificationVisible] =
    React.useState(false);
  const [notificationTitle, setNotificationTitle] = React.useState('');
  const [notificationDescription, setNotificationDescription] =
    React.useState('');
  const [notificationVariant, setNotificationVariant] = React.useState('');

  const setProperties = ({ title, description, variant }) => {
    setNotificationVariant(variant);
    setNotificationTitle(title);
    setNotificationDescription(description);
    setIsNotificationVisible(true);
  };

  const handleClose = () => {
    setIsNotificationVisible(false);
  };

  const contextValue = {
    notification: {
      error: React.useCallback(
        ({ title, description }) =>
          setProperties({ title, description, variant: 'error' }),
        []
      ),
      info: React.useCallback(
        ({ title, description }) =>
          setProperties({ title, description, variant: 'info' }),
        []
      ),
      success: React.useCallback(
        ({ title, description }) =>
          setProperties({ title, description, variant: 'success' }),
        []
      ),
    },
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <Snackbar
        open={isNotificationVisible}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity={notificationVariant as Color}>
          <AlertTitle>{notificationTitle}</AlertTitle>
          {notificationDescription}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};
