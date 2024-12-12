import * as React from 'react';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';

interface ModalCreateModelProps {
  open: boolean;
  values: any;
  setFieldValue: any;
  onClose: () => void;
  onSave: () => void;
}

const ModalCreateModel: React.FC<ModalCreateModelProps> = ({
  open,
  onClose,
  onSave,
  values,
  setFieldValue,
}) => {
  return (
    <>
      <Dialog open={open} fullWidth maxWidth='sm'>
        <DialogTitle>
          Deseja preservar os recursos?
          <IconButton
            aria-label='close'
            onClick={onClose}
            style={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <FormControlLabel
            control={
              <Checkbox
                checked={values.loadSpaces}
                onChange={(event) =>
                  setFieldValue('loadSpaces', event.target.checked)
                }
                name='loadSpaces'
                color='primary'
              />
            }
            label='Espaços'
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={values.loadPerson}
                onChange={(event) =>
                  setFieldValue('loadPerson', event.target.checked)
                }
                name='loadPerson'
                color='primary'
              />
            }
            label='Pessoas'
          />
        </DialogContent>

        <DialogActions>
          <Box display='flex' justifyContent='flex-end' style={{ gap: '10px' }}>
            <Button color='primary' onClick={onClose}>
              Cancelar
            </Button>
            <Button
              variant='contained'
              color='primary'
              onClick={() => onSave()}
            >
              Criar
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalCreateModel;
