import * as React from 'react';
import {
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from '@material-ui/core';
import { CheckBox, CheckBoxOutlineBlank, Close } from '@material-ui/icons';
import { PREFIX } from '~/config/database';
import { EFatherTag, ETypeTag } from '~/config/enums';
import { Autocomplete } from '@material-ui/lab';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '~/store';
import {
  addOrUpdatePerson,
  fetchAllPerson,
} from '~/store/modules/person/actions';
import { useNotification } from '~/hooks';

interface IAddProperty {
  open: boolean;
  onAddProperty: (activity: any) => void;
  onClose: () => void;
}

const AddProperty: React.FC<IAddProperty> = ({
  open,
  onClose,
  onAddProperty,
}) => {
  const [tagFilter, setTagFilter] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [itemSelected, setItemSelected] = React.useState(null);

  const dispatch = useDispatch();
  const { notification } = useNotification();

  const { person, tag } = useSelector((state: AppState) => state);
  const { tags, dictTag } = tag;
  const { personsActive: persons } = person;

  const property = tags.find(
    (e) =>
      !e?.[`${PREFIX}excluido`] &&
      e?.[`${PREFIX}ativo`] &&
      e?.[`${PREFIX}nome`] === ETypeTag.PROPRIETARIO
  );

  const handleClose = () => {
    setTagFilter(null);
    setItemSelected(null);
    onClose();
  };

  const handleSuccess = () => {
    handleClose();
    setLoading(false);
    dispatch(fetchAllPerson({}));
    notification.success({
      title: 'Sucesso',
      description: person
        ? 'Atualizado com sucesso'
        : 'Cadastro realizado com sucesso',
    });
  };

  const handleError = (error) => {
    setLoading(false);
    notification.error({
      title: 'Falha',
      description: error?.data?.error?.message,
    });
  };

  const handleNext = () => {
    if (!itemSelected || !Object.keys(itemSelected).length) {
      notification.error({
        title: 'Campo Pessoa',
        description: 'Selecione uma pessoa!',
      });
      return;
    }
    setLoading(true);

    const newPerson = {
      name: itemSelected[`${PREFIX}nome`] || '',
      lastName: itemSelected[`${PREFIX}sobrenome`] || '',
      favoriteName: itemSelected[`${PREFIX}nomepreferido`] || '',
      email: itemSelected[`${PREFIX}email`] || '',
      emailSecondary: itemSelected[`${PREFIX}emailsecundario`] || '',
      phone: itemSelected[`${PREFIX}celular`] || '',
      school: dictTag[itemSelected?.[`_${PREFIX}escolaorigem_value`]],
      areaChief: person[`${PREFIX}Pessoa_AreaResponsavel`]?.length
        ? person[`${PREFIX}Pessoa_AreaResponsavel`]?.map(
            (e) => dictTag[e?.[`${PREFIX}etiquetaid`]]
          )
        : [],
      title: itemSelected[`${PREFIX}Titulo`]
        ? {
            value:
              itemSelected[`${PREFIX}Titulo`]?.[`${PREFIX}categoriaetiquetaid`],
            label: itemSelected[`${PREFIX}Titulo`]?.[`${PREFIX}nome`],
          }
        : null,
      tag: itemSelected?.[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]?.length
        ? [...itemSelected[`${PREFIX}Pessoa_Etiqueta_Etiqueta`], property]?.map(
            (e) => dictTag[e?.[`${PREFIX}etiquetaid`]]
          )
        : [property],
    };

    dispatch(
      addOrUpdatePerson(
        {
          ...newPerson,
          id: itemSelected[`${PREFIX}pessoaid`],
          previousTag: itemSelected[`${PREFIX}Pessoa_Etiqueta_Etiqueta`],
        },
        {
          onSuccess: handleSuccess,
          onError: handleError,
        }
      )
    );
  };

  const peopleFilterOptions = React.useMemo(
    () =>
      tags.filter(
        (tag) =>
          !tag?.[`${PREFIX}excluido`] &&
          tag?.[`${PREFIX}ativo`] &&
          tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
            (e) => e?.[`${PREFIX}nome`] === EFatherTag.FUNCAO
          )
      ),
    []
  );

  const peopleOptions = React.useMemo(() => {
    if (tagFilter) {
      return persons?.filter((spc) =>
        spc?.[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]?.some(
          (tg) =>
            // @ts-ignore
            tg?.[`${PREFIX}etiquetaid`] === tagFilter?.[`${PREFIX}etiquetaid`]
        )
      );
    }

    return persons;
  }, [tagFilter]);

  return (
    <Dialog open={open} fullWidth maxWidth='md'>
      <DialogTitle>
        Vincular proprietário
        <IconButton
          aria-label='close'
          onClick={handleClose}
          style={{ position: 'absolute', right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box display='flex' flexDirection='column' style={{ gap: '1rem' }}>
          <Box
            display='flex'
            flexDirection='column'
            borderRadius='10px'
            border='1px solid #0063a5'
            padding='10px'
            style={{ gap: '1rem' }}
          >
            <Box display='flex' alignItems='center' style={{ gap: '1rem' }}>
              <Typography
                variant='body2'
                color='primary'
                style={{ fontWeight: 'bold' }}
              >
                Filtro
              </Typography>
            </Box>

            <Autocomplete
              fullWidth
              options={peopleFilterOptions}
              noOptionsText={'Sem opções'}
              value={tagFilter}
              getOptionLabel={(option) => option?.[`${PREFIX}nome`] || ''}
              onChange={(event: any, newValue: any | null) =>
                setTagFilter(newValue)
              }
              renderInput={(params) => (
                <TextField {...params} fullWidth label='Etiqueta' />
              )}
            />
          </Box>

          <Autocomplete
            fullWidth
            options={peopleOptions || []}
            noOptionsText={'Sem opções'}
            value={itemSelected}
            getOptionLabel={(option) => option?.label || ''}
            onChange={(event: any, newValue: any) => setItemSelected(newValue)}
            renderInput={(params) => (
              <TextField {...params} fullWidth label='Pessoa' />
            )}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color='primary'>
          Cancelar
        </Button>
        <Button
          onClick={() => !loading && handleNext()}
          variant='contained'
          color='primary'
        >
          {loading ? (
            <CircularProgress size={20} style={{ color: '#fff' }} />
          ) : (
            'Salvar'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProperty;
