import * as React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { useFormik } from 'formik';
import { AddCircle, Close, ExpandMore, Link } from '@material-ui/icons';
import axios from 'axios';
import { MOODLE_URL } from '~/config/constants';
import Table from '../Table';
import { Autocomplete } from '@material-ui/lab';
import formatUrl from '~/utils/formatUrl';
import { EDeliveryType } from '~/config/enums';

interface ModalMoodleProps {
  open: boolean;
  onClose: () => void;
  onAdd: (item) => void;
}

const ModalMoodle: React.FC<ModalMoodleProps> = ({ open, onClose, onAdd }) => {
  const [allData, setAllData] = React.useState([]);
  const [fieldsFilter, setFieldsFilter] = React.useState([]);
  const [filter, setFilter] = React.useState<any>({});
  const [loading, setLoading] = React.useState<any>(true);
  const [deliveryTime, setDeliveryTime] = React.useState<any>();
  const [addDocument, setAddDocument] = React.useState<any>({
    open: false,
    item: null,
  });
  const initialValues = { name: '' };

  React.useEffect(() => {
    axios.get(MOODLE_URL).then(({ data }) => {
      if (!data.exception) {
        setAllData(data);
      }

      setLoading(false);
    });
  }, []);

  React.useEffect(() => {
    if (allData?.length) {
      const typeMap = new Map<string, string>();
      const areaMap = new Map<string, string>();
      const teacherMap = new Map<string, string>();
      const authorMap = new Map<string, string>();
      const collectionMap = new Map<string, string>();
      const institutionMap = new Map<string, string>();
      const caseMap = new Map<string, string>();
      const businessMap = new Map<string, string>();
      const sizeMap = new Map<string, string>();
      const areaActMap = new Map<string, string>();
      const originMap = new Map<string, string>();
      const sectorMap = new Map<string, string>();

      allData?.forEach((item) => {
        if (item.doctype && !typeMap.has(item.doctype)) {
          typeMap.set(item.doctype, item.doctype);
        }

        if (item.area && !areaMap.has(item.area)) {
          areaMap.set(item.area, item.area);
        }

        if (item.professor && !teacherMap.has(item.professor)) {
          teacherMap.set(item.professor, item.professor);
        }

        if (item.authors && !authorMap.has(item.authors)) {
          authorMap.set(item.authors, item.authors);
        }

        if (item.collection && !collectionMap.has(item.collection)) {
          collectionMap.set(item.collection, item.collection);
        }

        if (item.institution && !institutionMap.has(item.institution)) {
          institutionMap.set(item.institution, item.institution);
        }

        if (item.casetype && !caseMap.has(item.casetype)) {
          caseMap.set(item.casetype, item.casetype);
        }

        if (item.business && !businessMap.has(item.business)) {
          businessMap.set(item.business, item.business);
        }

        if (item.businesssize && !sizeMap.has(item.businesssize)) {
          sizeMap.set(item.businesssize, item.businesssize);
        }

        if (item.occupationarea && !areaActMap.has(item.occupationarea)) {
          areaActMap.set(item.occupationarea, item.occupationarea);
        }

        if (item.businessorigin && !originMap.has(item.businessorigin)) {
          originMap.set(item.businessorigin, item.businessorigin);
        }

        if (item.department && !sectorMap.has(item.department)) {
          sectorMap.set(item.department, item.department);
        }
      });

      setFieldsFilter([
        {
          name: 'type',
          label: 'Tipo de Material',
          options: Array.from(typeMap.values()),
        },
        {
          name: 'academicArea',
          label: 'Área Acadêmica',
          options: Array.from(areaMap.values()),
        },
        {
          name: 'teacher',
          label: 'Professor',
          options: Array.from(teacherMap.values()),
        },
        {
          name: 'author',
          label: 'Autor',
          options: Array.from(authorMap.values()),
        },
        {
          name: 'collection',
          label: 'Coleção',
          options: Array.from(collectionMap.values()),
        },
        {
          name: 'institution',
          label: 'Escola/Instituição',
          options: Array.from(institutionMap.values()),
        },
        {
          name: 'institution',
          label: 'Escola/Instituição',
          options: Array.from(institutionMap.values()),
        },
        {
          name: 'case',
          label: 'Tipo de Caso',
          options: Array.from(caseMap.values()),
        },
        {
          name: 'business',
          label: 'Negócio',
          options: Array.from(businessMap.values()),
        },
        {
          name: 'size',
          label: 'Tamanho',
          options: Array.from(sizeMap.values()),
        },
        {
          name: 'actArea',
          label: 'Área de Atuação',
          options: Array.from(areaActMap.values()),
        },
        {
          name: 'origin',
          label: 'Origem do negócio',
          options: Array.from(originMap.values()),
        },
        {
          name: 'sector',
          label: 'Setor',
          options: Array.from(sectorMap.values()),
        },
      ]);
    }
  }, [allData]);

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnMount: false,
    validateOnChange: false,
    onSubmit: (values) => {
      setFilter(values);
    },
  });

  const handleReset = () => {
    setFilter({});
    formik.resetForm();
  };

  const handleAdd = (item) => {
    setAddDocument({ open: true, item });
  };

  const handleCloseAdd = () => {
    setAddDocument({ open: false });
  };

  const handleAddDocument = () => {
    onAdd({ ...addDocument.item, delivery: deliveryTime });
    setAddDocument({ open: false });
  };

  const tableOptions = {
    rowsPerPage: 10,
    enableNestedDataAccess: '.',
    tableBodyHeight: 'calc(100vh - 470px)',
    selectableRows: 'none',
    download: false,
    print: false,
    filter: false,
  };

  const columns = [
    {
      name: `action`,
      label: 'Ações',
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: `url`,
      label: 'Link',
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: `code`,
      label: 'Código',
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: `content_name`,
      label: 'Título',
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: `nickname`,
      label: 'Apelido do Material',
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: `mainPath`,
      label: 'Pasta Principal',
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: `subPath`,
      label: 'Subpasta',
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: `doctype`,
      label: 'Tipo de Material',
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: `area`,
      label: 'Área Acadêmica',
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: `professor`,
      label: 'Professor responsável',
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: `language`,
      label: 'Idioma',
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: `collection`,
      label: 'Coleção',
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: `institution`,
      label: 'Escola/Instituição',
      options: {
        filter: false,
        sort: true,
      },
    },

    {
      name: `officialcodes`,
      label: 'Códigos Oficiais',
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: `officialname`,
      label: 'Nome Oficial',
      options: {
        filter: false,
        sort: true,
      },
    },
  ];

  const rows = React.useMemo(() => {
    let result = allData?.map((item) => ({
      ...item,
      action: (
        <Tooltip title='Adicionar'>
          <IconButton onClick={() => handleAdd(item)}>
            <AddCircle />
          </IconButton>
        </Tooltip>
      ),
      url: (
        <Tooltip title='Acessar'>
          <a href={formatUrl(item.contenturl)} target='_blank'>
            <Link />{' '}
          </a>
        </Tooltip>
      ),
      mainPath: item?.path?.split('/')[1],
      subPath: item?.path?.split('/')[2],
    }));

    if (Object.keys(filter).length) {
      if (filter?.type) {
        result = result.filter(
          (item) => item?.doctype?.indexOf(filter?.type) > -1
        );
      }

      if (filter?.academicArea) {
        result = result.filter(
          (item) => item?.area?.indexOf(filter?.academicArea) > -1
        );
      }

      if (filter?.teacher) {
        result = result.filter(
          (item) => item?.professor?.indexOf(filter?.teacher) > -1
        );
      }

      if (filter?.author) {
        result = result.filter(
          (item) => item?.authors?.indexOf(filter?.author) > -1
        );
      }

      if (filter?.collection) {
        result = result.filter(
          (item) => item?.collection?.indexOf(filter?.collection) > -1
        );
      }

      if (filter?.institution) {
        result = result.filter(
          (item) => item?.institution?.indexOf(filter?.institution) > -1
        );
      }

      if (filter?.case) {
        result = result.filter(
          (item) => item?.casetype?.indexOf(filter?.case) > -1
        );
      }

      if (filter?.business) {
        result = result.filter(
          (item) => item?.business?.indexOf(filter?.business) > -1
        );
      }

      if (filter?.size) {
        result = result.filter(
          (item) => item?.businesssize?.indexOf(filter?.size) > -1
        );
      }

      if (filter?.actArea) {
        result = result.filter(
          (item) => item?.occupationarea?.indexOf(filter?.actArea) > -1
        );
      }

      if (filter?.origin) {
        result = result.filter(
          (item) => item?.businessorigin?.indexOf(filter?.origin) > -1
        );
      }

      if (filter?.sector) {
        result = result.filter(
          (item) => item?.department?.indexOf(filter?.sector) > -1
        );
      }
    }

    return result;
  }, [allData, filter]);

  return (
    <>
      <Dialog open={open} fullWidth maxWidth='lg'>
        <DialogTitle>
          Busca documentos Moodle
          <IconButton
            aria-label='close'
            onClick={onClose}
            style={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {loading ? (
            <Box display='flex' alignItems='center' justifyContent='center'>
              <CircularProgress color='primary' />
            </Box>
          ) : (
            <>
              <Box>
                <Accordion elevation={3}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography color='primary' style={{ fontWeight: 'bold' }}>
                      Filtro
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box display='flex' flexDirection='column'>
                      <Grid container spacing={3}>
                        {fieldsFilter.map((field) => (
                          <Grid item lg={3} md={4} sm={6} xs={12}>
                            <Autocomplete
                              filterSelectedOptions={true}
                              noOptionsText='Sem Opções'
                              options={field?.options || []}
                              value={formik.values[field?.name]}
                              onChange={(event: any, newValue: any) => {
                                formik.setFieldValue(field?.name, newValue);
                              }}
                              getOptionSelected={(option: any, item: any) =>
                                option === item
                              }
                              getOptionLabel={(option: any) => option || ''}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  fullWidth
                                  label={field.label}
                                />
                              )}
                            />
                          </Grid>
                        ))}
                      </Grid>
                      <Box
                        marginBottom='2rem'
                        display='flex'
                        justifyContent='flex-end'
                        style={{ gap: '10px' }}
                      >
                        <Button onClick={handleReset} variant='outlined'>
                          Limpar
                        </Button>
                        <Button
                          onClick={() => formik.handleSubmit()}
                          variant='contained'
                          color='primary'
                        >
                          Pesquisar
                        </Button>
                      </Box>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Box>

              <Table columns={columns} data={rows} options={tableOptions} />
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={addDocument.open} fullWidth maxWidth='sm'>
        <DialogTitle>Adicionar Documento</DialogTitle>

        <DialogContent>
          <Autocomplete
            options={Object.keys(EDeliveryType)}
            noOptionsText='Sem Opções'
            getOptionLabel={(option) => EDeliveryType[option]}
            onChange={(event: any, newValue: string | null) => {
              setDeliveryTime(newValue);
            }}
            renderInput={(params) => (
              <TextField {...params} fullWidth label='Momento Entrega' />
            )}
            value={deliveryTime}
          />
        </DialogContent>

        <DialogActions>
          <Box display='flex' justifyContent='flex-end' style={{ gap: '10px' }}>
            <Button color='primary' onClick={handleCloseAdd}>
              Cancelar
            </Button>
            <Button
              variant='contained'
              color='primary'
              onClick={handleAddDocument}
            >
              Adicionar
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalMoodle;
