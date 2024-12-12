import * as React from 'react';
import { Button, Slide, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
export const UndoContext = React.createContext({});
export const UndoProvider = ({ children }) => {
    const [isUndoVisible, setIsUndoVisible] = React.useState(false);
    const [undoDescription, setUndoDescription] = React.useState('');
    const [onUndoClick, setOnUndoClick] = React.useState([
        () => null,
    ]);
    const setProperties = (description, onUndo) => {
        setIsUndoVisible(true);
        setUndoDescription(description);
        setOnUndoClick([onUndo]);
    };
    const handleClose = () => {
        setIsUndoVisible(false);
    };
    const contextValue = {
        undo: {
            open: React.useCallback((description, onUndo) => setProperties(description, onUndo), [onUndoClick]),
            close: handleClose,
        },
    };
    return (React.createElement(UndoContext.Provider, { value: contextValue },
        children,
        React.createElement(Snackbar, { open: isUndoVisible, onClose: handleClose, autoHideDuration: 10000, anchorOrigin: { vertical: 'bottom', horizontal: 'center' }, ClickAwayListenerProps: {
                onClickAway: () => null,
            } },
            React.createElement(Slide, { direction: 'up' },
                React.createElement(Alert, { severity: 'info', action: React.createElement(Button, { onClick: () => {
                            onUndoClick[0]();
                            handleClose();
                        }, color: 'inherit', size: 'small' }, "Desfazer") }, undoDescription)))));
};
//# sourceMappingURL=UndoProvider.js.map