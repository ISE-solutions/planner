import * as React from 'react';
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from '@material-ui/core';
import {
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  Close,
} from '@material-ui/icons';
import { PREFIX } from '~/config/database';
import { EFatherTag } from '~/config/enums';
import { Autocomplete } from '@material-ui/lab';
import { useSelector } from 'react-redux';
import { AppState } from '~/store';

interface IFilterSpace {
  open: boolean;
  currentSpaces: any[];
  onFilterSpace: (activity: any) => void;
  onClose: () => void;
}

const FilterSpace: React.FC<IFilterSpace> = ({
  open,
  currentSpaces,
  onClose,
  onFilterSpace,
}) => {
  const [tagFilter, setTagFilter] = React.useState();
  const [itemsSelected, setItemsSelected] = React.useState([]);

  const { space, tag } = useSelector((state: AppState) => state);
  const { tags } = tag;
  const { spaces } = space;

  const handleClose = () => {
    setTagFilter(null);
    setItemsSelected([]);
    onClose();
  };

  const handleNext = () => {
    onFilterSpace(itemsSelected);
    handleClose();
  };

  const spaceFilterOptions = React.useMemo(
    () =>
      tags.filter(
        (tag) =>
          !tag?.[`${PREFIX}excluido`] &&
          tag?.[`${PREFIX}ativo`] &&
          tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
            (e) => e?.[`${PREFIX}nome`] === EFatherTag.TIPO_ESPACO
          )
      ),
    []
  );

  const spaceOptions = React.useMemo(() => {
    if (tagFilter) {
      return spaces?.filter((spc) =>
        spc?.[`${PREFIX}Espaco_Etiqueta_Etiqueta`]?.some(
          (tg) =>
            // @ts-ignore
            tg?.[`${PREFIX}etiquetaid`] === tagFilter?.[`${PREFIX}etiquetaid`]
        )
      );
    }

    return spaces;
  }, [tagFilter]);

  return (
    <Dialog open={open} fullWidth maxWidth='md'>
      <DialogTitle>
        Filtrar e adicionar espaço
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
              options={spaceFilterOptions}
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

          <Box>
            <Typography color='primary' style={{ fontWeight: 'bold' }}>
              Espaços adicionados
            </Typography>
            <Box display='flex' style={{ gap: '10px' }}>
              {currentSpaces.map((spc) => (
                <Chip label={spc?.label} />
              ))}
            </Box>
          </Box>

          <Autocomplete
            fullWidth
            multiple
            disableCloseOnSelect
            blurOnSelect={false}
            options={spaceOptions || []}
            noOptionsText={'Sem opções'}
            value={itemsSelected}
            getOptionLabel={(option) => option?.[`${PREFIX}nome`] || ''}
            onChange={(event: any, newValue: any[]) =>
              setItemsSelected(newValue)
            }
            renderOption={(option, { selected }) => (
              <React.Fragment>
                <Checkbox
                  icon={<CheckBoxOutlineBlankIcon fontSize='small' />}
                  checkedIcon={
                    <CheckBoxIcon color='secondary' fontSize='small' />
                  }
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option.label}
              </React.Fragment>
            )}
            renderInput={(params) => (
              <TextField {...params} fullWidth label='Espaços' />
            )}
          />

          <Box
            display='flex'
            width='100%'
            marginTop='2rem'
            padding='0 4rem'
            justifyContent='center'
          >
            <Button
              fullWidth
              onClick={handleNext}
              variant='contained'
              color='primary'
            >
              Adicionar
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default FilterSpace;
