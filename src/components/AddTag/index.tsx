import * as React from 'react';
import {
  Dialog,
  AppBar,
  Tabs,
  Tab,
  Box,
  DialogContent,
  Button,
  CircularProgress,
  DialogActions,
  Typography,
  IconButton,
  DialogTitle,
  Tooltip,
} from '@material-ui/core';
import * as yup from 'yup';
import { v4 } from 'uuid';
import Info from './Info';
import FantasyName from './FantasyName';
import styles from './AddTag.module.scss';
import { useConfirmation, useNotification } from '~/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { addOrUpdateTag, fetchAllTags } from '~/store/modules/tag/actions';
import { PREFIX } from '~/config/database';
import { useFormik } from 'formik';
import * as _ from 'lodash';
import { Close, Replay } from '@material-ui/icons';
import { AppState } from '~/store';
import { fetchAllPerson } from '~/store/modules/person/actions';
import { fetchAllSpace } from '~/store/modules/space/actions';
import HelperTooltip from '../HelperTooltip';
import useUndo from '~/hooks/useUndo';

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <>{children}</>}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

interface IAddTagProps {
  open: boolean;
  tag?: any;
  fatherSelected?: any;
  fatherTags: any[];
  handleEdit?: (item) => void;
  handleClose: () => void;
}

const AddTag: React.FC<IAddTagProps> = ({
  tag,
  open,
  fatherTags,
  fatherSelected,
  handleEdit,
  handleClose,
}) => {
  const DEFAULT_VALUES = {
    description: '',
    order: 0,
    fatherTag: [],
    name: '',
    nameEn: '',
    nameEs: '',
    names: [
      {
        keyId: v4(),
        name: '',
        nameEn: '',
        nameEs: '',
        use: '',
      },
    ],
  };

  const [initialValues, setInitialValues] = React.useState(DEFAULT_VALUES);
  const [tab, setTab] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [pastValues, setPastValues] = React.useState<any>(DEFAULT_VALUES);

  const dispatch = useDispatch();
  const { notification } = useNotification();
  const { confirmation } = useConfirmation();
  const { undo } = useUndo();

  const { tag: tagStory, app } = useSelector((state: AppState) => state);
  const { dictTag } = tagStory;
  const { tooltips } = app;

  const validationSchema = yup.object({
    name: yup.string().required('Campo Obrigatório'),
  });

  React.useEffect(() => {
    if (fatherSelected) {
      formik.setFieldValue('fatherTag', [fatherSelected]);
      setPastValues({ ...pastValues, fatherTag: [fatherSelected] });
    }
  }, [fatherSelected]);

  React.useEffect(() => {
    if (tag) {
      const iniVal = {
        id: tag[`${PREFIX}etiquetaid`],
        description: tag[`${PREFIX}descricao`] || '',
        name: tag[`${PREFIX}nome`] || '',
        nameEn: tag[`${PREFIX}nomeen`] || '',
        nameEs: tag[`${PREFIX}nomees`] || '',
        order: tag[`${PREFIX}ordem`] || 0,
        fatherTag: tag[`${PREFIX}Etiqueta_Pai`] || [],
        names: tag[`${PREFIX}Etiqueta_NomeEtiqueta`]?.length
          ? tag[`${PREFIX}Etiqueta_NomeEtiqueta`]?.map((e) => ({
              id: e[`${PREFIX}nomeetiquetaid`],
              keyId: v4(),
              name: e?.[`${PREFIX}nome`],
              nameEn: e?.[`${PREFIX}nomeen`],
              nameEs: e?.[`${PREFIX}nomees`],
              use: dictTag?.[e?.[`_${PREFIX}uso_value`]],
            }))
          : [
              {
                keyId: v4(),
                name: '',
                nameEn: '',
                nameEs: '',
                use: '',
              },
            ],
      };

      setInitialValues(_.cloneDeep(iniVal));
      setPastValues(_.cloneDeep(iniVal));
    }
  }, [tag]);

  const handleCheckClose = () => {
    if (!_.isEqualWith(pastValues, formik.values)) {
      confirmation.openConfirmation({
        title: 'Dados não alterados',
        description: 'O que deseja?',
        yesLabel: 'Salvar e sair',
        noLabel: 'Sair sem Salvar',
        onConfirm: () => {
          formik.setFieldValue('close', true);
          formik.handleSubmit();
        },
        onCancel: onClose,
      });
    } else {
      onClose();
    }
  };

  const onClose = () => {
    handleClose();
    formik.handleReset(DEFAULT_VALUES);
    setInitialValues(DEFAULT_VALUES);
    dispatch(fetchAllTags({ searchQuery: '', active: 'Ativo' }));
    setTab(0);
  };

  const handleSuccess = (item) => {
    if (!handleEdit) {
      setPastValues(formik.values);
    }
    handleEdit?.(item);
    setLoading(false);
    if (pastValues?.id) {
      undo.open('Deseja desfazer a ação?', () => handleUndo(item));
    }

    notification.success({
      title: 'Sucesso',
      description: tag
        ? 'Atualizado com sucesso'
        : 'Cadastro realizado com sucesso',
    });

    onClose();
  };

  const handleError = (error) => {
    setLoading(false);
    notification.error({
      title: 'Falha',
      description: error?.data?.error?.message,
    });
  };

  const handleUndo = async (newTag) => {
    const tagUndo = JSON.parse(localStorage.getItem('undoTag'));

    const namesToDelete = [];

    newTag?.[`${PREFIX}Etiqueta_NomeEtiqueta`]?.forEach((e) => {
      const nameSaved = tagUndo?.names?.find(
        (sp) => sp?.id === e?.[`${PREFIX}nomeetiquetaid`]
      );

      if (nameSaved) {
        namesToDelete.push(nameSaved);
      } else {
        namesToDelete.push({
          keyId: v4(),
          deleted: true,
          id: e[`${PREFIX}nomeetiquetaid`],
          name: e?.[`${PREFIX}nome`],
          nameEn: e?.[`${PREFIX}nomeen`],
          nameEs: e?.[`${PREFIX}nomees`],
          use: dictTag?.[e?.[`_${PREFIX}uso_value`]],
        });
      }
    });

    tagUndo?.names?.forEach((e) => {
      const nameSaved = newTag?.[`${PREFIX}Etiqueta_NomeEtiqueta`]?.find(
        (sp) => e?.id === sp?.[`${PREFIX}nomeetiquetaid`]
      );

      if (!nameSaved) {
        namesToDelete.push({
          ...e,
          id: null,
        });
      }
    });

    dispatch(
      addOrUpdateTag(
        {
          ...tagUndo,
          names: namesToDelete,
        },
        {
          onSuccess: (spc) => {
            handleEdit(spc);
            notification.success({
              title: 'Sucesso',
              description: 'Ação realizada com sucesso',
            });
          },
          onError: () => null,
        }
      )
    );
  };

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnMount: false,
    validateOnChange: false,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setLoading(true);
      if (tag) {
        const fatherTagToDelete = tag?.[`${PREFIX}Etiqueta_Pai`]?.filter(
          (e) =>
            !values?.fatherTag?.some(
              (sp) => sp?.[`${PREFIX}etiquetaid`] === e[`${PREFIX}etiquetaid`]
            )
        );

        localStorage.setItem('undoTag', JSON.stringify(pastValues));

        dispatch(
          addOrUpdateTag(
            {
              ...values,
              fatherTagToDelete,
              id: tag[`${PREFIX}etiquetaid`],
              previousNames: tag[`${PREFIX}Etiqueta_NomeEtiqueta`],
            },
            {
              onSuccess: handleSuccess,
              onError: handleError,
            }
          )
        );
      } else {
        dispatch(
          addOrUpdateTag(values, {
            onSuccess: handleSuccess,
            onError: handleError,
          })
        );
      }
    },
  });

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTab(newValue);
  };

  const handleUpdateData = () => {
    dispatch(fetchAllPerson({}));
    dispatch(fetchAllSpace({}));
  };

  const tagTooltip = tooltips.find((tooltip) => tooltip?.Title === 'Etiqueta');

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='md'
      fullWidth
      disableBackdropClick
    >
      <DialogTitle style={{ paddingBottom: 0 }}>
        <Box>
          <Box display='flex' alignItems='center' style={{ gap: '10px' }}>
            <Typography
              variant='h6'
              color='textPrimary'
              style={{ fontWeight: 'bold', maxWidth: '48rem' }}
            >
              {tag?.[`${PREFIX}etiquetaid`]
                ? 'Editar Etiqueta'
                : 'Cadastrar Etiqueta'}
              {formik.values.name ? ` - ${formik.values.name}` : ''}
            </Typography>

            <HelperTooltip content={tagTooltip?.Conteudo} />

            <Tooltip title='Atualizar'>
              <IconButton onClick={handleUpdateData}>
                <Replay />
              </IconButton>
            </Tooltip>
          </Box>

          <IconButton
            aria-label='close'
            onClick={handleCheckClose}
            style={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <AppBar position='static' color='default'>
          <Tabs
            value={tab}
            onChange={handleChange}
            indicatorColor='primary'
            textColor='primary'
            variant='fullWidth'
            aria-label='full width tabs example'
          >
            <Tab label='Informações' {...a11yProps(0)} />
            <Tab label='Nome Fantasia' {...a11yProps(1)} />
          </Tabs>
        </AppBar>
        <TabPanel value={tab} index={0}>
          <Box className={styles.boxTab}>
            <Info tag={tag} fatherTags={fatherTags} formik={formik} />
          </Box>
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <Box className={styles.boxTab}>
            <FantasyName formik={formik} />
          </Box>
        </TabPanel>
      </DialogContent>

      <DialogActions>
        <Box
          display='flex'
          width='100%'
          alignItems='center'
          justifyContent='flex-end'
        >
          <Box style={{ gap: '10px' }} mt={2} display='flex' alignItems='end'>
            <Button color='primary' onClick={handleCheckClose}>
              Cancelar
            </Button>
            <Button
              onClick={() => !loading && formik.handleSubmit()}
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
      </DialogActions>
    </Dialog>
  );
};

export default AddTag;
