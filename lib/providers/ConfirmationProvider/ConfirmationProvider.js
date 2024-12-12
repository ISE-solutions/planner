import * as React from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, } from '@material-ui/core';
import { Close } from '@material-ui/icons';
export const ConfirmationContext = React.createContext({});
export const ConfirmationProvider = ({ children }) => {
    const [isConfirmationVisible, setIsConfirmationVisible] = React.useState(false);
    const [confirmationTitle, setConfirmationTitle] = React.useState('');
    const [yesLabel, setYesLabel] = React.useState('');
    const [noLabel, setNoLabel] = React.useState('');
    const [confirmationDescription, setConfirmationDescription] = React.useState('');
    const [onSuccessConfirmation, setSuccessConfirmation] = React.useState(() => undefined);
    const [onCancelConfirmation, setCancelConfirmation] = React.useState(() => undefined);
    const [showCancel, setShowCancel] = React.useState(true);
    const handleOpenConfirmation = ({ title, description, onConfirm, onCancel, yesLabel, noLabel, showCancel = true, }) => {
        setConfirmationTitle(title);
        setConfirmationDescription(description);
        setIsConfirmationVisible(true);
        setYesLabel(yesLabel || 'Confirmar');
        setNoLabel(noLabel || 'Cancelar');
        setShowCancel(showCancel);
        setSuccessConfirmation(() => () => {
            handleClose();
            setTimeout(() => onConfirm === null || onConfirm === void 0 ? void 0 : onConfirm(), 300);
        });
        setCancelConfirmation(() => () => {
            onCancel === null || onCancel === void 0 ? void 0 : onCancel();
            handleClose();
        });
    };
    const handleClose = () => {
        onCancelConfirmation === null || onCancelConfirmation === void 0 ? void 0 : onCancelConfirmation();
        setIsConfirmationVisible(false);
    };
    const contextValue = {
        confirmation: {
            openConfirmation: handleOpenConfirmation,
            closeConfirmation: handleClose,
        },
    };
    return (React.createElement(ConfirmationContext.Provider, { value: contextValue },
        children,
        React.createElement(Dialog, { open: isConfirmationVisible, maxWidth: 'sm', fullWidth: true },
            React.createElement(DialogTitle, null,
                confirmationTitle,
                React.createElement(IconButton, { "aria-label": 'close', onClick: handleClose, style: { position: 'absolute', right: 8, top: 8 } },
                    React.createElement(Close, null))),
            React.createElement(DialogContent, null, confirmationDescription),
            React.createElement(DialogActions, null,
                React.createElement(Box, { style: { gap: '10px' }, mt: 2, display: 'flex', alignItems: 'end', justifyContent: 'flex-end' },
                    showCancel ? (React.createElement(Button, { color: 'primary', onClick: onCancelConfirmation }, noLabel)) : null,
                    React.createElement(Button, { onClick: onSuccessConfirmation, variant: 'contained', color: 'primary' }, yesLabel))))));
};
//# sourceMappingURL=ConfirmationProvider.js.map