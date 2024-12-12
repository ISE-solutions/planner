import * as React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';

interface ConfirmationParameters {
  title: React.ReactNode;
  description: React.ReactNode;
  yesLabel?: string;
  noLabel?: string;
  showCancel?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
}

export interface ConfirmationActionProps {
  openConfirmation: (confirmation: ConfirmationParameters) => void;
  closeConfirmation: () => void;
}

export interface ContextProps {
  confirmation: ConfirmationActionProps;
}

export const ConfirmationContext = React.createContext<ContextProps>(
  {} as ContextProps
);

export const ConfirmationProvider = ({ children }) => {
  const [isConfirmationVisible, setIsConfirmationVisible] =
    React.useState(false);
  const [confirmationTitle, setConfirmationTitle] = React.useState('');
  const [yesLabel, setYesLabel] = React.useState('');
  const [noLabel, setNoLabel] = React.useState('');
  const [confirmationDescription, setConfirmationDescription] =
    React.useState('');
  const [onSuccessConfirmation, setSuccessConfirmation] = React.useState(
    () => undefined
  );
  const [onCancelConfirmation, setCancelConfirmation] = React.useState(
    () => undefined
  );
  const [showCancel, setShowCancel] = React.useState(true);

  const handleOpenConfirmation = ({
    title,
    description,
    onConfirm,
    onCancel,
    yesLabel,
    noLabel,
    showCancel = true,
  }) => {
    setConfirmationTitle(title);
    setConfirmationDescription(description);
    setIsConfirmationVisible(true);
    setYesLabel(yesLabel || 'Confirmar');
    setNoLabel(noLabel || 'Cancelar');
    setShowCancel(showCancel);
    setSuccessConfirmation(() => () => {
      handleClose();
      setTimeout(() => onConfirm?.(), 300);
    });
    setCancelConfirmation(() => () => {
      onCancel?.();
      handleClose();
    });
  };

  const handleClose = () => {
    onCancelConfirmation?.();
    setIsConfirmationVisible(false);
  };

  const contextValue = {
    confirmation: {
      openConfirmation: handleOpenConfirmation,
      closeConfirmation: handleClose,
    },
  };

  return (
    <ConfirmationContext.Provider value={contextValue}>
      {children}
      <Dialog open={isConfirmationVisible} maxWidth='sm' fullWidth>
        <DialogTitle>
          {confirmationTitle}
          <IconButton
            aria-label='close'
            onClick={handleClose}
            style={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>{confirmationDescription}</DialogContent>
        <DialogActions>
          <Box
            style={{ gap: '10px' }}
            mt={2}
            display='flex'
            alignItems='end'
            justifyContent='flex-end'
          >
            {showCancel ? (
              <Button color='primary' onClick={onCancelConfirmation}>
                {noLabel}
              </Button>
            ) : null}
            <Button
              onClick={onSuccessConfirmation}
              variant='contained'
              color='primary'
            >
              {yesLabel}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </ConfirmationContext.Provider>
  );
};
