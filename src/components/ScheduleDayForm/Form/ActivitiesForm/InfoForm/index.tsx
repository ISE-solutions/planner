import * as React from 'react';
import {
  Box,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { EFatherTag, TYPE_ACTIVITY } from '~/config/enums';
import { PREFIX } from '~/config/database';
import {
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  Close,
  PlusOne,
} from '@material-ui/icons';
import AddTag from '~/components/AddTag';
import AddSpace from '~/components/AddSpace';
import { useLoggedUser } from '~/hooks';

interface IInfoForm {
  tagsOptions: any[];
  spaceOptions: any[];
  errors: any;
  values: any;
  disabled: boolean;
  index: number;
  setFieldValue: any;
}

const InfoForm: React.FC<IInfoForm> = ({
  index,
  disabled,
  tagsOptions,
  spaceOptions,
  values,
  errors,
  setFieldValue,
}) => {
  const [newTagModal, setNewTagModal] = React.useState({
    open: false,
    fatherTag: null,
  });
  const [newSpace, setNewSpace] = React.useState({
    open: false,
  });
  const [dialogConflict, setDialogConflict] = React.useState({
    open: false,
    msg: null,
  });
  const { currentUser } = useLoggedUser();

  const areaOptions = tagsOptions
    ?.filter((tag) =>
      tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
        (e) => e?.[`${PREFIX}nome`] === EFatherTag.AREA_ACADEMICA
      )
    )
    ?.sort((a, b) => a?.[`${PREFIX}ordem`] - b?.[`${PREFIX}ordem`]);

  const fatherTags = React.useMemo(
    () => tagsOptions?.filter((e) => e?.[`${PREFIX}ehpai`]),
    [tagsOptions]
  );

  const handleNewTag = React.useCallback(
    (type) => {
      const tag = tagsOptions.find((e) => e?.[`${PREFIX}nome`] === type);

      setNewTagModal({ open: true, fatherTag: tag });
    },
    [tagsOptions]
  );

  const handleCloseNewTag = React.useCallback(
    () => setNewTagModal({ open: false, fatherTag: null }),
    []
  );

  return (
    <>
      <Grid container spacing={3} style={{ margin: 0, width: '100%' }}>
        <Grid item sm={12} md={6} lg={6}>
          <TextField
            fullWidth
            disabled
            label='Nome'
            type='text'
            name='name'
            inputProps={{ maxLength: 255 }}
            error={!!errors.name}
            helperText={errors.name as string}
            value={values?.[`${PREFIX}nome`]}
          />
        </Grid>

        {values?.[`${PREFIX}tipo`] === TYPE_ACTIVITY.ACADEMICA && (
          <Grid item sm={12} md={6} lg={6}>
            <Box display='flex' alignItems='center'>
              <Autocomplete
                fullWidth
                disabled={disabled}
                filterSelectedOptions={true}
                noOptionsText='Sem Opções'
                options={areaOptions?.filter(
                  (e) => !e?.[`${PREFIX}excluido`] && e[`${PREFIX}ativo`]
                )}
                onChange={(event: any, newValue: any[]) => {
                  setFieldValue(
                    `activities[${index}].${PREFIX}AreaAcademica`,
                    newValue
                  );
                }}
                getOptionSelected={(option, value) =>
                  option?.[`${PREFIX}etiquetaid`] ===
                  value?.[`${PREFIX}etiquetaid`]
                }
                getOptionLabel={(option) => option?.[`${PREFIX}nome`] || ''}
                renderInput={(params) => (
                  <TextField {...params} fullWidth label='Área Acadêmica' />
                )}
                value={values?.[`${PREFIX}AreaAcademica`]}
              />
              <Tooltip title='Adicionar Etiqueta'>
                <IconButton
                  disabled={disabled || !currentUser?.isPlanning}
                  onClick={() => handleNewTag(EFatherTag.AREA_ACADEMICA)}
                >
                  <PlusOne />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        )}

        <Grid item sm={12} md={6} lg={6}>
          <Box display='flex' alignItems='center'>
            <Autocomplete
              multiple
              fullWidth
              disabled={disabled}
              noOptionsText='Sem Opções'
              disableCloseOnSelect
              blurOnSelect={false}
              options={spaceOptions}
              onChange={(event: any, newValue: any[]) => {
                setFieldValue(
                  `activities[${index}].spaces`,
                  newValue
                );
              }}
              getOptionSelected={(option, value) =>
                option?.[`${PREFIX}espacoid`] === value?.[`${PREFIX}espacoid`]
              }
              renderOption={(option, { selected }) => (
                <>
                  <Checkbox
                    icon={<CheckBoxOutlineBlankIcon fontSize='small' />}
                    checkedIcon={<CheckBoxIcon color='secondary' fontSize='small' />}
                    inputProps={{
                      id: 'checkSpace'
                    }}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option?.[`${PREFIX}nome`]}
                </>
              )}
              getOptionLabel={(option) => option?.[`${PREFIX}nome`] || ''}
              renderInput={(params) => (
                <TextField {...params} fullWidth label='Espaço' />
              )}
              value={values?.spaces}
            />
            <Tooltip title='Adicionar Espaço'>
              <IconButton
                disabled={disabled || !currentUser?.isPlanning}
                onClick={() => setNewSpace({ open: true })}
              >
                <PlusOne />
              </IconButton>
            </Tooltip>
          </Box>
        </Grid>

        {values?.[`${PREFIX}tipo`] !== TYPE_ACTIVITY.ACADEMICA && (
          <Grid item sm={12} md={12} lg={12}>
            <TextField
              fullWidth
              minRows={2}
              label='Tema'
              type='text'
              name='theme'
              disabled={disabled}
              inputProps={{ maxLength: 255 }}
              // @ts-ignore
              error={!!errors?.theme}
              // @ts-ignore
              helperText={errors?.theme as string}
              onChange={(event) =>
                setFieldValue(
                  `activities[${index}].${PREFIX}temaaula`,
                  event.target.value
                )
              }
              value={values?.[`${PREFIX}temaaula`]}
            />
          </Grid>
        )}
      </Grid>

      <AddTag
        open={newTagModal.open}
        fatherTags={fatherTags}
        fatherSelected={newTagModal.fatherTag}
        handleClose={handleCloseNewTag}
      />

      <AddSpace
        open={newSpace.open}
        handleClose={() => setNewSpace({ open: false })}
      />

      <Dialog open={dialogConflict.open}>
        <DialogTitle>
          <Typography
            variant='subtitle1'
            color='secondary'
            style={{ maxWidth: '25rem', fontWeight: 'bold' }}
          >
            Resursos com conflito
            <IconButton
              aria-label='close'
              onClick={() =>
                setDialogConflict({
                  open: false,
                  msg: null,
                })
              }
              style={{ position: 'absolute', right: 8, top: 8 }}
            >
              <Close />
            </IconButton>
          </Typography>
        </DialogTitle>
        <DialogContent>{dialogConflict.msg}</DialogContent>
      </Dialog>
    </>
  );
};

export default InfoForm;
