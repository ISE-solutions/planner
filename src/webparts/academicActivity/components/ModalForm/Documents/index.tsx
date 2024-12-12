import * as React from 'react';
import * as yup from 'yup';
import * as _ from 'lodash';
import { useFormik } from 'formik';
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { EDeliveryType } from '~/config/enums';
import { Delete, Edit } from '@material-ui/icons';
import { NotificationActionProps } from '~/providers/NotificationProvider/NotificationProvider';
import { PREFIX } from '~/config/database';
import { useConfirmation } from '~/hooks';
import { ModalMoodle } from '~/components';
import formatUrl from '~/utils/formatUrl';
import { addOrUpdateDocuments } from '~/store/modules/activity/actions';

interface IDocumentsProps {
  tab: number;
  tempTab: any;
  onClose: () => void;
  academicActivity: any;
  handleEdit: (item) => void;
  onResetTempTab: () => void;
  handleChangeIndex: () => void;
  notification: NotificationActionProps;
}

const Documents: React.FC<IDocumentsProps> = ({
  tab,
  onClose,
  tempTab,
  handleEdit,
  notification,
  onResetTempTab,
  academicActivity,
  handleChangeIndex,
}) => {
  const DEFAULT_VALUES = {
    id: '',
    name: '',
    font: 'moodle',
    delivery: null,
    link: '',
  };

  const [initialValues, setInitialValues] = React.useState<any>(DEFAULT_VALUES);
  const [pastValues, setPastValues] = React.useState<any>(DEFAULT_VALUES);
  const [searchInMoodle, setSearchInMoodle] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [editDocument, setEditDocument] = React.useState<{
    isEdit: boolean;
    index?: number;
  }>({ isEdit: false });

  const validationSchema = yup.object({
    name: yup.string().required('Campo Obrigatório'),
    delivery: yup.mixed().required('Campo Obrigatório'),
    link: yup
      .string()
      .matches(
        /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi,
        'Insira uma URL válida'
      )
      .required('Campo Obrigatório'),
  });

  const reducer = (state, action) => {
    switch (action.type) {
      case 'ADD_INITIAL_DOCUMENT':
        return { documents: action.payload };

      case 'ADD_DOCUMENT':
        return { documents: [...state.documents, action.payload] };

      case 'EDIT_DOCUMENT':
        let newEditDocuments = [...state.documents];
        newEditDocuments[action.index] = action.payload;

        return { documents: newEditDocuments };

      case 'REMOVE_DOCUMENT':
        let newDocuments = [...state.documents];
        newDocuments.splice(action.index, 1);

        return { documents: newDocuments };

      default:
        return { documents: state.documents };
    }
  };

  const [{ documents }, dispatch] = React.useReducer(reducer, {
    documents: [],
  });

  const { confirmation } = useConfirmation();

  React.useEffect(() => {
    if (academicActivity && tab !== tempTab) {
      if (!_.isEqualWith(pastValues, documents)) {
        confirmation.openConfirmation({
          title: 'Dados não alterados',
          description: 'O que deseja?',
          yesLabel: 'Salvar',
          noLabel: 'Sair sem Salvar',
          onConfirm: async () => {
            handleSubmitDocuments()
              .then(() => {
                confirmation.closeConfirmation();
                handleChangeIndex();
              })
              .catch(() => {
                confirmation.closeConfirmation();
                onResetTempTab();
              });
          },
          onCancel: () => {
            handleChangeIndex();
          },
        });
      } else {
        handleChangeIndex();
      }
    }
  }, [tempTab]);

  React.useEffect(() => {
    if (academicActivity) {
      const newDocuments = academicActivity?.[
        `${PREFIX}Atividade_Documento`
      ]?.map((document) => ({
        id: document?.[`${PREFIX}documentosatividadeid`],
        name: document?.[`${PREFIX}nome`],
        link: document?.[`${PREFIX}link`],
        font: document?.[`${PREFIX}fonte`],
        delivery: document?.[`${PREFIX}entrega`],
      }));

      dispatch({
        type: 'ADD_INITIAL_DOCUMENT',
        payload: _.cloneDeep(newDocuments),
      });

      setPastValues(_.cloneDeep(newDocuments));
    }
  }, [academicActivity]);

  const handleSuccess = (item) => {
    handleEdit(item);
    setLoading(false);

    notification.success({
      title: 'Sucesso',
      description: academicActivity
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

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnMount: false,
    validateOnChange: false,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (editDocument.isEdit) {
        dispatch({
          index: editDocument.index,
          type: 'EDIT_DOCUMENT',
          payload: {
            name: values.name,
            font: values.font,
            delivery: values?.originFont,
            link: values.link,
          },
        });
      } else {
        dispatch({
          type: 'ADD_DOCUMENT',
          payload: {
            name: values.name,
            font: values.font,
            delivery: values.delivery,
            link: values.link,
          },
        });
      }

      setEditDocument({ isEdit: false });
      formik.resetForm({});
    },
  });

  const handleSubmitDocuments = () => {
    return new Promise((resolve, reject) => {
      setLoading(true);
      addOrUpdateDocuments(
        {
          documents: documents,
          id: academicActivity[`${PREFIX}atividadeid`],
          previousDocuments:
            academicActivity[`${PREFIX}Atividade_Documento`] || [],
        },
        {
          onSuccess: handleSuccess,
          onError: handleError,
        }
      )
        .then(resolve)
        .catch(reject);
    });
  };

  const handleRemoveDocument = (index) => {
    dispatch({
      index,
      type: 'REMOVE_DOCUMENT',
    });
  };

  const handleAddMoodleDocument = React.useCallback(
    (doc) => {
      dispatch({
        type: 'ADD_DOCUMENT',
        payload: {
          name: doc.content_name,
          delivery: doc.delivery,
          font: 'Moodle',
          link: doc.contenturl,
        },
      });
      notification.success({
        title: 'Sucesso',
        description: 'Documento adicionado com sucesso!',
      });
    },
    [documents]
  );

  const handleEditDocument = (index, item) => {
    setEditDocument({
      isEdit: true,
      index,
    });

    formik.setValues({
      id: item?.id || item?.[`${PREFIX}documentosatividadeid`],
      name: item?.name || item?.[`${PREFIX}nome`],
      link: item?.link || item?.[`${PREFIX}link`],
      originFont: item?.font || item?.[`${PREFIX}fonte`],
      font: 'externo',
      delivery: item?.delivery || item?.[`${PREFIX}entrega`],
    });
  };

  return (
    <>
      <ModalMoodle
        open={searchInMoodle}
        onAdd={handleAddMoodleDocument}
        onClose={() => setSearchInMoodle(false)}
      />

      <Box
        overflow='hidden auto'
        maxHeight='25rem'
        minHeight='19rem'
        flexGrow={1}
      >
        <Grid container spacing={3} alignItems='center'>
          <Grid item sm={12} md={2} lg={2}>
            <FormControl component='fieldset'>
              <FormLabel component='legend'>Fonte</FormLabel>
              <RadioGroup
                aria-label='fonte'
                name='font'
                value={formik.values.font}
                onChange={formik.handleChange}
                defaultValue='externo'
              >
                <FormControlLabel
                  value='moodle'
                  control={<Radio color='primary' />}
                  label='Moodle'
                  labelPlacement='end'
                />
                <FormControlLabel
                  value='externo'
                  control={<Radio color='primary' />}
                  label='Externo'
                  labelPlacement='end'
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid
            container
            spacing={3}
            sm={12}
            md={8}
            lg={8}
            style={{ margin: 0 }}
          >
            {formik.values.font === 'externo' ? (
              <>
                <Grid item sm={12} md={6} lg={6}>
                  <TextField
                    required
                    autoFocus
                    fullWidth
                    label='Nome'
                    type='text'
                    name='name'
                    inputProps={{ maxLength: 255 }}
                    error={!!formik.errors.name}
                    helperText={formik.errors.name as string}
                    onChange={formik.handleChange}
                    value={formik.values.name}
                  />
                </Grid>

                <Grid item sm={12} md={6} lg={6}>
                  <Autocomplete
                    options={Object.keys(EDeliveryType)}
                    noOptionsText='Sem Opções'
                    getOptionLabel={(option) => EDeliveryType[option]}
                    onChange={(event: any, newValue: string | null) => {
                      formik.setFieldValue(`delivery`, newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        required
                        {...params}
                        fullWidth
                        label='Momento Entrega'
                        // @ts-ignore
                        error={!!formik.errors?.delivery}
                        // @ts-ignore
                        helperText={formik.errors?.delivery as string}
                      />
                    )}
                    value={formik.values?.delivery}
                  />
                </Grid>

                <Grid item sm={12} md={12} lg={12}>
                  <TextField
                    required
                    fullWidth
                    label='Link'
                    type='text'
                    name='link'
                    inputProps={{ maxLength: 100 }}
                    error={!!formik.errors.link}
                    helperText={formik.errors.link as string}
                    onChange={formik.handleChange}
                    value={formik.values.link}
                  />
                </Grid>
                <Grid item sm={12} md={2} lg={2}>
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={() => formik.handleSubmit()}
                  >
                    Adicionar
                  </Button>
                </Grid>
              </>
            ) : (
              <Button
                onClick={() => setSearchInMoodle(true)}
                variant='contained'
                color='primary'
              >
                Pesquisar documento
              </Button>
            )}
          </Grid>
        </Grid>
      </Box>

      <Box marginTop='2rem'>
        <TableContainer component={Paper}>
          <Table aria-label='simple table'>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Fonte</TableCell>
                <TableCell>Link</TableCell>
                <TableCell>Momento de Entrega</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {documents?.map((row, index) => (
                <TableRow key={row.name}>
                  <TableCell component='th' scope='row'>
                    {row.name}
                  </TableCell>
                  <TableCell>{row?.font?.toLocaleUpperCase()}</TableCell>
                  <TableCell>
                    <a href={formatUrl(row?.link)} target='_blank'>
                      Acesse
                    </a>
                  </TableCell>
                  <TableCell>{EDeliveryType[row.delivery]}</TableCell>
                  <TableCell>
                    {/* <IconButton onClick={() => handleEditDocument(index, row)}>
                      <Tooltip arrow title='Editar'>
                        <Edit />
                      </Tooltip>
                    </IconButton> */}
                    <IconButton onClick={() => handleRemoveDocument(index)}>
                      <Tooltip arrow title='Remover'>
                        <Delete />
                      </Tooltip>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box display='flex' alignItems='center' justifyContent='space-between'>
        <Button variant='outlined' onClick={onClose}>
          Fechar
        </Button>
        <Box style={{ gap: '10px' }} mt={2} display='flex' alignItems='end'>
          <Button color='primary' onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={() => !loading && handleSubmitDocuments()}
            variant='contained'
            color='primary'
          >
            {loading ? (
              <CircularProgress size={20} style={{ color: '#fff' }} />
            ) : (
              'Salvar'
            )}
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default Documents;
