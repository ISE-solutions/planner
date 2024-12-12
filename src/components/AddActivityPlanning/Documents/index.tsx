import * as React from 'react';
import * as yup from 'yup';
import * as _ from 'lodash';
import { v4 } from 'uuid';
import { useFormik } from 'formik';
import {
  Box,
  Button,
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
import { PREFIX } from '~/config/database';
import { useNotification } from '~/hooks';
import { ModalMoodle } from '~/components';
import formatUrl from '~/utils/formatUrl';

interface IDocumentsProps {
  activity: any;
  setFieldValue: any;
}

const Documents: React.FC<IDocumentsProps> = ({ activity, setFieldValue }) => {
  const [searchInMoodle, setSearchInMoodle] = React.useState(false);
  const [editDocument, setEditDocument] = React.useState<{
    isEdit: boolean;
    index?: number;
  }>({ isEdit: false });

  const { notification } = useNotification();

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
        const newAddDocuments = [...state.documents, action.payload];
        setFieldValue('documents', newAddDocuments);
        return { documents: newAddDocuments };

      case 'EDIT_DOCUMENT':
        let newEditDocuments = [...state.documents];

        newEditDocuments = newEditDocuments?.map((e) =>
          e.keyId === action?.payload?.keyId ? action.payload : e
        );

        setFieldValue('documents', newEditDocuments);
        return { documents: newEditDocuments };

      case 'REMOVE_DOCUMENT':
        let newDocuments = [...state.documents];

        newDocuments = newDocuments?.map((e) =>
          e.keyId === action?.payload?.keyId ? { ...e, deleted: true } : e
        );

        setFieldValue('documents', newDocuments);
        return { documents: newDocuments };

      default:
        return { documents: state.documents };
    }
  };

  const [{ documents }, dispatch] = React.useReducer(reducer, {
    documents: [],
  });

  React.useEffect(() => {
    if (activity) {
      const newDocuments = activity?.[`${PREFIX}Atividade_Documento`]?.map(
        (document) => ({
          keyId: v4(),
          id: document?.[`${PREFIX}documentosatividadeid`],
          name: document?.[`${PREFIX}nome`],
          link: document?.[`${PREFIX}link`],
          font: document?.[`${PREFIX}fonte`],
          delivery: document?.[`${PREFIX}entrega`],
          type: document?.[`${PREFIX}tipo`],
        })
      );

      dispatch({
        type: 'ADD_INITIAL_DOCUMENT',
        payload: _.cloneDeep(newDocuments),
      });
    }
  }, [activity]);

  const formik = useFormik({
    initialValues: {
      id: '',
      name: '',
      originFont: '',
      font: 'moodle',
      delivery: null,
      link: '',
      type: '',
    },
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
            ...values,
            name: values.name,
            font: values.originFont,
          },
        });
      } else {
        dispatch({
          type: 'ADD_DOCUMENT',
          payload: {
            keyId: v4(),
            name: values.name,
            font: values.font,
            delivery: values.delivery,
            link: values.link,
            type: values.type,
          },
        });
      }

      setEditDocument({ isEdit: false });
      formik.resetForm({});
    },
  });

  const handleRemoveDocument = (keyId) => {
    dispatch({
      type: 'REMOVE_DOCUMENT',
      payload: {
        keyId,
      },
    });
  };

  const handleAddMoodleDocument = React.useCallback(
    (doc) => {
      dispatch({
        type: 'ADD_DOCUMENT',
        payload: {
          keyId: v4(),
          name: doc.content_name,
          delivery: doc.delivery,
          font: 'Moodle',
          link: doc.contenturl,
          type: doc.doctype,
        },
      });
      notification.success({
        title: 'Sucesso',
        description: 'Documento adicionado com sucesso!',
      });
    },
    [documents]
  );

  const handleEditDocument = (item) => {
    setEditDocument({
      isEdit: true,
    });

    formik.setValues({
      ...item,
      id: item?.id,
      name: item?.name,
      link: item?.link,
      originFont: item?.font,
      font: 'externo',
      delivery: item?.delivery,
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
        minHeight='13rem'
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
                    disabled={
                      editDocument.isEdit &&
                      (formik.values.originFont || formik.values.font) !==
                        'externo'
                    }
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
                    getOptionLabel={(option) => EDeliveryType[option]}
                    onChange={(event: any, newValue: string | null) => {
                      formik.setFieldValue(`delivery`, newValue);
                    }}
                    noOptionsText='Sem Opções'
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
                    Salvar
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
              {documents
                ?.filter((e) => !e.deleted)
                ?.map((row, index) => (
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
                      <IconButton onClick={() => handleEditDocument(row)}>
                        <Tooltip arrow title='Editar'>
                          <Edit />
                        </Tooltip>
                      </IconButton>
                      <IconButton
                        onClick={() => handleRemoveDocument(row.keyId)}
                      >
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
    </>
  );
};

export default Documents;
