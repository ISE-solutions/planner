import * as React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  IconButton,
  DialogActions,
  Button,
  CircularProgress,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { Close } from '@material-ui/icons';
import { useSelector } from 'react-redux';
import { AppState } from '~/store';
import { EFatherTag } from '~/config/enums';
import { PREFIX } from '~/config/database';

interface IShareModelProps {
  open: boolean;
  currentValue?: any[];
  loading: boolean;
  onClose: () => void;
  handleShare: (items: any[]) => void;
}

const ShareModel: React.FC<IShareModelProps> = ({
  open,
  currentValue,
  loading,
  handleShare,
  onClose,
}) => {
  const [functionToShare, setFunctionToShare] = React.useState([]);
  const { tag } = useSelector((state: AppState) => state);
  const { tags, dictTag } = tag;

  React.useEffect(() => {
    if (currentValue && currentValue?.length) {
      const defaultValue = currentValue.map(
        (e) => dictTag?.[e?.[`${PREFIX}etiquetaid`]]
      );

      setFunctionToShare(defaultValue);
    }
  }, [currentValue]);

  const functionOptions = React.useMemo(
    () =>
      tags.filter(
        (tag) =>
          !tag?.[`${PREFIX}excluido`] &&
          tag?.[`${PREFIX}ativo`] &&
          tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
            (e) => e?.[`${PREFIX}nome`] === EFatherTag.FUNCAO
          )
      ),
    [tags]
  );

  const handleShareClick = () => {
    handleShare(functionToShare);
  };

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={onClose}
      maxWidth='sm'
      disableBackdropClick
    >
      <DialogTitle>
        Compartilhar modelo para edição
        <IconButton
          aria-label='close'
          onClick={onClose}
          style={{ position: 'absolute', right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Autocomplete
          multiple
          noOptionsText='Sem Opções'
          options={functionOptions}
          onChange={(event: any, newValue: any[] | null) =>
            setFunctionToShare(newValue)
          }
          getOptionLabel={(option: any) => option?.label || ''}
          renderInput={(params) => (
            <TextField {...params} fullWidth label='Etiqueta' />
          )}
          value={functionToShare}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color='primary'>
          Cancelar
        </Button>
        <Button variant='contained' color='primary' onClick={handleShareClick}>
          {loading ? (
            <CircularProgress size={20} style={{ color: '#fff' }} />
          ) : (
            'Compartilhar'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShareModel;
