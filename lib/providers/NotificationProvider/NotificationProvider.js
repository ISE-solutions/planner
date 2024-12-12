import * as React from 'react';
import { Alert as MuiAlert, AlertTitle, } from '@material-ui/lab';
import { Snackbar } from '@material-ui/core';
function Alert(props) {
    return React.createElement(MuiAlert, Object.assign({ elevation: 6, variant: 'filled' }, props));
}
export const NotificationContext = React.createContext({});
export const NotificationProvider = ({ children }) => {
    const [isNotificationVisible, setIsNotificationVisible] = React.useState(false);
    const [notificationTitle, setNotificationTitle] = React.useState('');
    const [notificationDescription, setNotificationDescription] = React.useState('');
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
            error: React.useCallback(({ title, description }) => setProperties({ title, description, variant: 'error' }), []),
            info: React.useCallback(({ title, description }) => setProperties({ title, description, variant: 'info' }), []),
            success: React.useCallback(({ title, description }) => setProperties({ title, description, variant: 'success' }), []),
        },
    };
    return (React.createElement(NotificationContext.Provider, { value: contextValue },
        children,
        React.createElement(Snackbar, { open: isNotificationVisible, autoHideDuration: 6000, onClose: handleClose, anchorOrigin: { vertical: 'top', horizontal: 'center' } },
            React.createElement(Alert, { onClose: handleClose, severity: notificationVariant },
                React.createElement(AlertTitle, null, notificationTitle),
                notificationDescription))));
};
//# sourceMappingURL=NotificationProvider.js.map