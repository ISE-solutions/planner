import * as React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Badge,
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  SwipeableDrawer,
  TextField,
  Typography,
} from '@material-ui/core';
import {
  Close,
  ExpandMore,
  FilterList,
  Save,
  SwapHoriz,
  Visibility,
  VisibilityOff,
} from '@material-ui/icons';
import { EFatherTag, EGroups, STATUS_TASK } from '~/config/enums';
import { PREFIX } from '~/config/database';
import { Autocomplete } from '@material-ui/lab';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '~/store';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { updateCustomFilter } from '~/store/modules/customFilter/actions';
import { useConfirmation, useLoggedUser } from '~/hooks';

interface FilterProps {
  open: boolean;
  formik: any;
  onClose: () => void;
  refetch: () => void;
  filterSelected: any;
  setFilterSelected: React.Dispatch<any>;
  onAddCustomFilter: () => void;
  onOvewriteFilter: () => void;
}

const Filter: React.FC<FilterProps> = ({
  open,
  formik,
  refetch,
  filterSelected,
  setFilterSelected,
  onAddCustomFilter,
  onOvewriteFilter,
  onClose,
}) => {
  const [publishLoading, setPublishLoading] = React.useState(false);

  const { confirmation } = useConfirmation();

  const { tag, person, customFilter } = useSelector((state: AppState) => state);
  const { tags } = tag;
  const { persons } = person;
  const { customFilters } = customFilter;

  const peopleOptions = React.useMemo(
    () =>
      persons
        ?.filter((e) => e?.[`${PREFIX}ativo`])
        ?.map((e) => ({ value: e.value, label: e.label })),
    [persons]
  );

  const typeProgramOptions = React.useMemo(
    () =>
      tags
        ?.filter(
          (tag) =>
            tag?.[`${PREFIX}ativo`] &&
            tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
              (e) => e?.[`${PREFIX}nome`] === EFatherTag.TIPO_PROGRAMA
            )
        )
        ?.map((e) => ({ value: e.value, label: e.label })),
    [tags]
  );

  const instituteOptions = React.useMemo(
    () =>
      tags
        ?.filter(
          (tag) =>
            tag?.[`${PREFIX}ativo`] &&
            tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
              (e) => e?.[`${PREFIX}nome`] === EFatherTag.INSTITUTO
            )
        )
        ?.map((e) => ({ value: e.value, label: e.label })),
    [tags]
  );

  const companyOptions = React.useMemo(
    () =>
      tags
        ?.filter(
          (tag) =>
            tag?.[`${PREFIX}ativo`] &&
            tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
              (e) => e?.[`${PREFIX}nome`] === EFatherTag.EMPRESA
            )
        )
        ?.map((e) => ({ value: e.value, label: e.label })),
    [tags]
  );

  const temperatureOptions = React.useMemo(
    () =>
      tags
        ?.filter(
          (tag) =>
            tag?.[`${PREFIX}ativo`] &&
            tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
              (e) => e?.[`${PREFIX}nome`] === EFatherTag.TEMPERATURA_STATUS
            )
        )
        ?.map((e) => ({ value: e.value, label: e.label })),
    [tags]
  );

  const statusOptions = React.useMemo(
    () =>
      Object.values(STATUS_TASK)
        .filter((e) => typeof e === 'string')
        .map((key) => ({
          value: STATUS_TASK[key],
          label: key,
        })),
    []
  );

  const handleApplyFilter = () => {
    formik.setValues(JSON.parse(filterSelected?.[`${PREFIX}valor`]));
  };

  const handleDelete = () => {
    confirmation.openConfirmation({
      title: 'Deseja relmente excluir o filtro?',
      description: filterSelected?.[`${PREFIX}nome`],
      onConfirm: () => {},
      onCancel: () => {},
    });
  };

  const handlePublish = () => {
    setPublishLoading(true);

    updateCustomFilter(
      filterSelected[`${PREFIX}filtroid`],
      {
        [`${PREFIX}publicado`]: !filterSelected?.[`${PREFIX}publicado`],
      },
      {
        onSuccess: (it) => {
          refetch?.();
          setFilterSelected(it);
          setPublishLoading(false);
        },
        onError: () => {
          setPublishLoading(false);
        },
      }
    );
  };

  return (
    <SwipeableDrawer
      anchor='right'
      open={open}
      onClose={onClose}
      onOpen={() => null}
      disableBackdropClick
    >
      <Box margin='1rem 2rem 0'>
        <Typography
          variant='h6'
          color='textPrimary'
          style={{ fontWeight: 'bold' }}
        >
          Filtro
        </Typography>
      </Box>
      <Box position='absolute' right='10px' top='10px'>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>

      <Box
        display='flex'
        height='100%'
        flexDirection='column'
        width='40rem'
        padding='1rem'
      >
        <Box
          display='flex'
          flexDirection='column'
          borderRadius='10px'
          border='1px solid #0063a5'
          style={{ gap: '10px' }}
          padding='1rem'
          margin='10px'
        >
          <Autocomplete
            filterSelectedOptions={true}
            options={customFilters || []}
            noOptionsText='Sem Opções'
            value={filterSelected}
            onChange={(event: any, newValue: any) =>
              setFilterSelected(newValue)
            }
            getOptionSelected={(option: any, item: any) =>
              option?.value === item?.value
            }
            getOptionLabel={(option: any) => option?.label || ''}
            renderInput={(params) => (
              <TextField {...params} fullWidth label='Filtro(s) salvos' />
            )}
          />
          <Box width='100%' display='flex' justifyContent='space-between'>
            <Box display='flex' style={{ gap: '10px' }}>
              <Button
                variant='contained'
                color='secondary'
                onClick={handlePublish}
                disabled={!filterSelected}
                startIcon={
                  filterSelected?.[`${PREFIX}publicado`] ? (
                    <VisibilityOff />
                  ) : (
                    <Visibility />
                  )
                }
              >
                {publishLoading ? (
                  <CircularProgress size={25} style={{ color: '#fff' }} />
                ) : filterSelected?.[`${PREFIX}publicado`] ? (
                  'Despublicar'
                ) : (
                  'Publicar'
                )}
              </Button>
              <Button
                disabled={!filterSelected}
                onClick={handleDelete}
                color='secondary'
              >
                Excluir
              </Button>
            </Box>
            <Button
              disabled={!filterSelected}
              color='primary'
              onClick={handleApplyFilter}
            >
              Selecionar
            </Button>
          </Box>
        </Box>
        <Box
          display='flex'
          flexDirection='column'
          flex='1 0 auto'
          maxHeight='calc(100vh - 12rem)'
          overflow='auto'
        >
          <Accordion elevation={3} style={{ margin: '.5rem' }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box display='flex' alignItems='center' style={{ gap: '10px' }}>
                {formik.values?.institute?.length ||
                formik.values?.company?.length ||
                formik.values?.typeProgram?.length ||
                formik.values?.programTemperature?.length ? (
                  <FilterList fontSize='small' color='primary' />
                ) : null}
                <Typography color='primary' style={{ fontWeight: 'bold' }}>
                  Programa
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2} style={{ width: '100%' }}>
                <Grid item sm={12} md={6} lg={6}>
                  <Autocomplete
                    multiple
                    filterSelectedOptions={true}
                    options={instituteOptions || []}
                    noOptionsText='Sem Opções'
                    value={formik.values.institute}
                    onChange={(event: any, newValue: any) => {
                      formik.setFieldValue('institute', newValue);
                    }}
                    getOptionSelected={(option: any, item: any) =>
                      option?.value === item?.value
                    }
                    getOptionLabel={(option: any) => option?.label || ''}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth label='Instituto' />
                    )}
                  />
                </Grid>

                <Grid item sm={12} md={6} lg={6}>
                  <Autocomplete
                    multiple
                    filterSelectedOptions={true}
                    options={typeProgramOptions || []}
                    noOptionsText='Sem Opções'
                    value={formik.values.typeProgram}
                    onChange={(event: any, newValue: any) => {
                      formik.setFieldValue('typeProgram', newValue);
                    }}
                    getOptionSelected={(option: any, item: any) =>
                      option?.value === item?.value
                    }
                    getOptionLabel={(option: any) => option?.label || ''}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        label='Tipo de Programa'
                      />
                    )}
                  />
                </Grid>

                <Grid item sm={12} md={6} lg={6}>
                  <Autocomplete
                    multiple
                    filterSelectedOptions={true}
                    options={companyOptions || []}
                    noOptionsText='Sem Opções'
                    value={formik.values.company}
                    onChange={(event: any, newValue: any) => {
                      formik.setFieldValue('company', newValue);
                    }}
                    getOptionSelected={(option: any, item: any) =>
                      option?.value === item?.value
                    }
                    getOptionLabel={(option: any) => option?.label || ''}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth label='Empresa' />
                    )}
                  />
                </Grid>

                <Grid item sm={12} md={6} lg={6}>
                  <Autocomplete
                    multiple
                    filterSelectedOptions={true}
                    options={temperatureOptions || []}
                    noOptionsText='Sem Opções'
                    value={formik.values.programTemperature}
                    onChange={(event: any, newValue: any) => {
                      formik.setFieldValue('programTemperature', newValue);
                    }}
                    getOptionSelected={(option: any, item: any) =>
                      option?.value === item?.value
                    }
                    getOptionLabel={(option: any) => option?.label || ''}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth label='Temperatura' />
                    )}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion elevation={3} style={{ margin: '.5rem' }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box display='flex' alignItems='center' style={{ gap: '10px' }}>
                {formik.values?.teamYearConclusion ||
                formik.values?.teamSigla ||
                formik.values?.teamName ||
                formik.values?.teamTemperature?.length ? (
                  <FilterList fontSize='small' color='primary' />
                ) : null}
                <Typography color='primary' style={{ fontWeight: 'bold' }}>
                  Turma
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2} style={{ width: '100%' }}>
                <Grid item sm={12} md={6} lg={6}>
                  <TextField
                    fullWidth
                    label='Nome'
                    type='text'
                    name='teamName'
                    value={formik.values.teamName}
                    inputProps={{ maxLength: 255 }}
                    onChange={formik.handleChange}
                  />
                </Grid>
                <Grid item sm={12} md={6} lg={6}>
                  <TextField
                    fullWidth
                    label='Sigla'
                    type='text'
                    name='teamSigla'
                    value={formik.values.teamSigla}
                    inputProps={{ maxLength: 50 }}
                    onChange={formik.handleChange}
                  />
                </Grid>
                <Grid item sm={12} md={6} lg={6}>
                  <TextField
                    fullWidth
                    label='Ano de Conclusão'
                    type='number'
                    name='teamYearConclusion'
                    value={formik.values.teamYearConclusion}
                    onChange={formik.handleChange}
                  />
                </Grid>

                <Grid item sm={12} md={6} lg={6}>
                  <Autocomplete
                    multiple
                    filterSelectedOptions={true}
                    options={temperatureOptions || []}
                    noOptionsText='Sem Opções'
                    value={formik.values.teamTemperature}
                    onChange={(event: any, newValue: any) => {
                      formik.setFieldValue('teamTemperature', newValue);
                    }}
                    getOptionSelected={(option: any, item: any) =>
                      option?.value === item?.value
                    }
                    getOptionLabel={(option: any) => option?.label || ''}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth label='Temperatura' />
                    )}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion elevation={3} style={{ margin: '.5rem' }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box display='flex' alignItems='center' style={{ gap: '10px' }}>
                {formik.values?.delivery ||
                formik.values?.status?.length ||
                formik.values?.responsible?.length ||
                formik.values?.start ||
                formik.values?.end ||
                formik.values?.endForecastConclusion ? (
                  <FilterList fontSize='small' color='primary' />
                ) : null}
                <Typography color='primary' style={{ fontWeight: 'bold' }}>
                  Tarefa
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2} style={{ width: '100%' }}>
                <Grid item sm={12} md={6} lg={6}>
                  <TextField
                    fullWidth
                    label='Entrega'
                    type='text'
                    name='delivery'
                    value={formik.values.delivery}
                    inputProps={{ maxLength: 255 }}
                    onChange={formik.handleChange}
                  />
                </Grid>
                <Grid item sm={12} md={6} lg={6}>
                  <Autocomplete
                    multiple
                    options={statusOptions || []}
                    filterSelectedOptions={true}
                    noOptionsText='Sem Opções'
                    getOptionLabel={(option) => option?.label || ''}
                    onChange={(event: any, newValue: any) => {
                      formik.setFieldValue('status', newValue);
                    }}
                    getOptionSelected={(option, value) =>
                      option?.value === value?.value
                    }
                    renderInput={(params) => (
                      <TextField {...params} fullWidth label='Status' />
                    )}
                    value={formik.values?.status}
                  />
                </Grid>
                <Grid item sm={12} md={6} lg={6}>
                  <Autocomplete
                    multiple
                    options={peopleOptions || []}
                    filterSelectedOptions={true}
                    noOptionsText='Sem Opções'
                    getOptionLabel={(option) => option?.label}
                    onChange={(event: any, newValue: any | null) => {
                      formik.setFieldValue(`responsible`, newValue);
                    }}
                    getOptionSelected={(option, value) =>
                      option?.value === value?.value
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        label='Pessoa Responsável'
                      />
                    )}
                    value={formik.values?.responsible}
                  />
                </Grid>

                <Grid item sm={12} md={6} lg={6}>
                  <KeyboardDatePicker
                    autoOk
                    clearable
                    fullWidth
                    variant='inline'
                    format={'DD/MM/YYYY HH:mm'}
                    label='Início'
                    value={formik.values.start || null}
                    onChange={(newValue: any) => {
                      formik.setFieldValue(`start`, newValue);
                    }}
                  />
                </Grid>

                <Grid item sm={12} md={6} lg={6}>
                  <KeyboardDatePicker
                    autoOk
                    clearable
                    fullWidth
                    variant='inline'
                    format={'DD/MM/YYYY HH:mm'}
                    label='Fim'
                    value={formik.values.end || null}
                    onChange={(newValue: any) => {
                      formik.setFieldValue(`end`, newValue);
                    }}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Box>

        <Box
          width='100%'
          marginTop='1rem'
          display='flex'
          padding='1rem'
          justifyContent='space-between'
        >
          <Box display='flex' style={{ gap: '10px' }}>
            {filterSelected ? (
              <Button
                variant='contained'
                color='secondary'
                onClick={onOvewriteFilter}
                startIcon={<SwapHoriz />}
              >
                Sobrescrever
              </Button>
            ) : null}
            <Button
              variant='contained'
              color='secondary'
              onClick={onAddCustomFilter}
              startIcon={<Save />}
            >
              Salvar Filtro
            </Button>
          </Box>
          <Box display='flex' style={{ gap: '1rem' }}>
            <Button color='primary' onClick={() => formik.handleReset()}>
              Limpar
            </Button>
            <Button
              onClick={() => formik.handleSubmit()}
              variant='contained'
              color='primary'
            >
              Aplicar
            </Button>
          </Box>
        </Box>
      </Box>
    </SwipeableDrawer>
  );
};

export default Filter;
