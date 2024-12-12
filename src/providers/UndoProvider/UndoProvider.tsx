import * as React from 'react';
import { Button, Slide, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

export interface UndoActionProps {
  open: (description: string, onUndo: () => void) => void;
  close: () => void;
}

export interface ContextProps {
  undo: UndoActionProps;
}

export const UndoContext = React.createContext<ContextProps>(
  {} as ContextProps
);

export const UndoProvider = ({ children }) => {
  const [isUndoVisible, setIsUndoVisible] = React.useState(false);
  const [undoDescription, setUndoDescription] = React.useState('');
  const [onUndoClick, setOnUndoClick] = React.useState<[() => void]>([
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
      open: React.useCallback(
        (description, onUndo) => setProperties(description, onUndo),
        [onUndoClick]
      ),
      close: handleClose,
    },
  };

  return (
    <UndoContext.Provider value={contextValue}>
      {children}
      <Snackbar
        open={isUndoVisible}
        onClose={handleClose}
        autoHideDuration={10000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        ClickAwayListenerProps={{
          onClickAway: () => null,
        }}
      >
        <Slide direction='up'>
          <Alert
            severity='info'
            action={
              <Button
                onClick={() => {
                  onUndoClick[0]();
                  handleClose();
                }}
                color='inherit'
                size='small'
              >
                Desfazer
              </Button>
            }
          >
            {undoDescription}
          </Alert>
        </Slide>
      </Snackbar>
    </UndoContext.Provider>
  );
};
