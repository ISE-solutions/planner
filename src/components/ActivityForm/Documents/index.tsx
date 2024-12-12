import * as React from 'react';
import { v4 } from 'uuid';
import * as yup from 'yup';
import * as _ from 'lodash';
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
import { useNotification } from '~/hooks';
import ModalMoodle from '~/components/ModalMoodle';
import formatUrl from '~/utils/formatUrl';

interface IDocumentsProps {
  canEdit: boolean;
  values: any;
  detailApproved: boolean;
  setFieldValue: any;
  setDocumentChanged: any;
}

const Documents: React.FC<IDocumentsProps> = ({
  canEdit,
  values: activityValues,
  setFieldValue,
  setDocumentChanged,
  detailApproved,
}) => {
  const DEFAULT_VALUES = {
    name: '',
    font: 'moodle',
    delivery: null,
    link: '',
    type: '',
  };

  const [searchInMoodle, setSearchInMoodle] = React.useState(false);
  const [editDocument, setEditDocument] = React.useState<{
    isEdit: boolean;
    index?: number;
  }>({ isEdit: false });

  React.useEffect(() => {
    dispatch({
      type: 'ADD_INITIAL_DOCUMENT',
      payload: activityValues.documents,
    });
  }, [activityValues.documents]);

  const validationSchema = yup.object({
    name: yup.string().required('Campo Obrigatório'),
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
        if (state.documents.lenght) {
          return { documents: state.documents };
        }
        return { documents: action.payload || [] };

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

  const { notification } = useNotification();
  const [{ documents }, dispatch] = React.useReducer(reducer, {
    documents: [],
  });

  const formik = useFormik<any>({
    initialValues: DEFAULT_VALUES,
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnMount: false,
    validateOnChange: false,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (editDocument.isEdit) {
        dispatch({
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

      setDocumentChanged(true);
      setEditDocument({ isEdit: false });

      // const newDocuments = [...activityValues.documents];

      // newDocuments.push({
      //   keyId: v4(),
      //   name: values.name,
      //   font: values.font,
      //   delivery: values.delivery,
      //   link: values.link,
      // });

      // setFieldValue('documents', newDocuments);
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

  return (
    <Box display='flex' flexDirection='column' width='100%'>
      <ModalMoodle
        open={searchInMoodle}
        onAdd={handleAddMoodleDocument}
        onClose={() => setSearchInMoodle(false)}
      />
      <Box
        overflow='hidden auto'
        maxHeight='25rem'
        minHeight='9rem'
        flexGrow={1}
      >
        <Grid container spacing={3} alignItems='center'>
          <Grid item sm={12} md={2} lg={2}>
            <FormControl
              component='fieldset'
              disabled={detailApproved || !canEdit}
            >
              <FormLabel component='legend'>Fonte</FormLabel>
              <RadioGroup
                aria-label='fonte'
                name='font'
                value={formik.values.font}
                onChange={formik.handleChange}
                defaultValue='moodle'
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
                    autoFocus
                    fullWidth
                    label='Nome'
                    type='text'
                    name='name'
                    disabled={
                      detailApproved ||
                      !canEdit ||
                      (editDocument.isEdit &&
                        (formik.values.originFont || formik.values.font) !==
                          'externo')
                    }
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
                    disabled={detailApproved || !canEdit}
                    renderInput={(params) => (
                      <TextField
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
                    fullWidth
                    label='Link'
                    type='text'
                    name='link'
                    disabled={detailApproved || !canEdit}
                    inputProps={{ maxLength: 100 }}
                    error={!!formik.errors.link}
                    helperText={formik.errors.link as string}
                    onChange={formik.handleChange}
                    value={formik.values.link}
                  />
                </Grid>
              </>
            ) : (
              <Button
                onClick={() => setSearchInMoodle(true)}
                disabled={detailApproved || !canEdit}
                variant='contained'
                color='primary'
              >
                Pesquisar documento
              </Button>
            )}
          </Grid>

          <Grid item sm={12} md={2} lg={2}>
            <Button
              variant='contained'
              color='primary'
              disabled={detailApproved || !canEdit}
              onClick={() => formik.handleSubmit()}
            >
              Salvar
            </Button>
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
                ?.map((row) => (
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
                      <IconButton
                        disabled={detailApproved || !canEdit}
                        onClick={() => handleEditDocument(row)}
                      >
                        <Tooltip arrow title='Editar'>
                          <Edit />
                        </Tooltip>
                      </IconButton>

                      <IconButton
                        disabled={detailApproved || !canEdit}
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
    </Box>
  );
};

export default Documents;
