import * as React from 'react';
import * as yup from 'yup';
import {
  Dialog,
  AppBar,
  Tabs,
  Tab,
  Box,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  DialogTitle,
  Typography,
  IconButton,
  Tooltip,
} from '@material-ui/core';
import { v4 } from 'uuid';
import { PREFIX } from '~/config/database';
import Info from './Info';
import FantasyName from './FantasyName';
import Capacity from './Capacity';
import EnvolvedPerson from './EnvolvedPerson';
import Observation from './Observation';
import styles from './AddSpace.module.scss';
import { useConfirmation, useNotification } from '~/hooks';
import {
  addOrUpdateSpace,
  fetchAllSpace,
  getSpaceByEmail,
} from '~/store/modules/space/actions';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '~/store';
import * as moment from 'moment';
import { sp } from '@pnp/sp';
import { getFiles } from '~/utils/sharepoint';
import * as _ from 'lodash';
import { useFormik } from 'formik';
import { Close, Replay } from '@material-ui/icons';
import { fetchAllPerson } from '~/store/modules/person/actions';
import { fetchAllTags } from '~/store/modules/tag/actions';
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

interface IAddSpaceProps {
  open: boolean;
  space?: any;
  handleClose: () => void;
  handleEdit?: (item) => void;
}

const AddSpace: React.FC<IAddSpaceProps> = ({
  open,
  space,
  handleClose,
  handleEdit,
}) => {
  const DEFAULT_VALUES = {
    name: '',
    nameEn: '',
    nameEs: '',
    email: '',
    description: '',
    owner: null,
    names: [
      {
        keyId: v4(),
        name: '',
        nameEn: '',
        nameEs: '',
        use: '',
      },
    ],
    capacities: [
      {
        keyId: v4(),
        quantity: 0,
        use: null,
      },
    ],
    people: [
      {
        keyId: v4(),
        person: null,
        function: null,
      },
    ],
    tags: [],
    anexos: [],
  };

  const [initialValues, setInitialValues] = React.useState(DEFAULT_VALUES);
  const [loading, setLoading] = React.useState(false);
  const [pastValues, setPastValues] = React.useState<any>(DEFAULT_VALUES);
  const [tab, setTab] = React.useState(0);

  const refAnexo = React.useRef<any>();

  const validationSchema = yup.object({
    name: yup.string().required('Campo Obrigatório'),
    // email: yup.string().email('E-mail inválido').required('Campo Obrigatório'),
    tags: yup.array().min(1, 'Campo Obrigatório').required('Campo Obrigatório'),
  });

  const dispatch = useDispatch();
  const { notification } = useNotification();
  const { confirmation } = useConfirmation();
  const { undo } = useUndo();

  const { tag, person, app } = useSelector((state: AppState) => state);
  const { dictTag } = tag;
  const { dictPeople } = person;
  const { tooltips } = app;

  React.useEffect(() => {
    if (space) {
      const iniVal = {
        id: space[`${PREFIX}espacoid`] || '',
        name: space[`${PREFIX}nome`] || '',
        nameEn: space[`${PREFIX}nomeen`] || '',
        nameEs: space[`${PREFIX}nomees`] || '',
        email: space[`${PREFIX}email`] || '',
        description: space[`${PREFIX}observacao`],
        owner: dictPeople?.[space?.[`_${PREFIX}proprietario_value`]] || null,
        tags: space[`${PREFIX}Espaco_Etiqueta_Etiqueta`]?.length
          ? space[`${PREFIX}Espaco_Etiqueta_Etiqueta`]?.map(
              (e) => dictTag[e?.[`${PREFIX}etiquetaid`]]
            )
          : [],
        names: space[`${PREFIX}Espaco_NomeEspaco`]?.length
          ? space[`${PREFIX}Espaco_NomeEspaco`]?.map((e) => ({
              keyId: v4(),
              id: e[`${PREFIX}nomeespacoid`],
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
        people: space[`${PREFIX}Espaco_PessoasEnvolvidas`]?.length
          ? space[`${PREFIX}Espaco_PessoasEnvolvidas`]?.map((e) => ({
              keyId: v4(),
              id: e[`${PREFIX}pessoasenvolvidasespacoid`],
              person: dictPeople[e?.[`_${PREFIX}pessoa_value`]],
              function: dictTag[e?.[`_${PREFIX}funcao_value`]],
            }))
          : [
              {
                keyId: v4(),
                person: null,
                function: null,
              },
            ],
        capacities: space[`${PREFIX}Espaco_CapacidadeEspaco`]?.length
          ? space[`${PREFIX}Espaco_CapacidadeEspaco`]?.map((e) => ({
              keyId: v4(),
              id: e[`${PREFIX}capacidadeespacoid`],
              quantity: e?.[`${PREFIX}quantidade`],
              use: dictTag[e?.[`_${PREFIX}uso_value`]],
            }))
          : [
              {
                keyId: v4(),
                quantity: 0,
                use: null,
              },
            ],
        anexos: [],
      };
      setInitialValues(_.cloneDeep(iniVal));
      setPastValues(_.cloneDeep(iniVal));

      getFiles(
        sp,
        `Anexos Interno/Espaco/${moment(space?.createdon).format('YYYY')}/${
          space?.[`${PREFIX}espacoid`]
        }`
      ).then((files) => {
        formik.setFieldValue('anexos', files);
        setPastValues({ ...iniVal, anexos: files });
      });
    }
  }, [space]);

  const onClose = () => {
    dispatch(fetchAllSpace({}));
    handleClose();
    setTab(0);
    setPastValues(DEFAULT_VALUES);
    formik.handleReset(DEFAULT_VALUES);
    setInitialValues(DEFAULT_VALUES);
  };

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

  const handleSuccess = (item) => {
    handleEdit?.(item);
    setLoading(false);

    if (pastValues?.id) {
      undo.open('Deseja desfazer a ação?', () => handleUndo(item));
    }
    notification.success({
      title: 'Sucesso',
      description: space
        ? 'Atualizado com sucesso'
        : 'Cadastro realizado com sucesso',
    });

    onClose();
  };

  const handleError = (error) => {
    console.log(error);
    setLoading(false);
    notification.error({
      title: 'Falha',
      description: error?.data?.error?.message,
    });
  };

  const handleUndo = async (newSpace) => {
    const spaceUndo = JSON.parse(localStorage.getItem('undoSpace'));

    const peopleToDelete = [];
    const namesToDelete = [];
    const capacityToDelete = [];

    newSpace?.[`${PREFIX}Espaco_PessoasEnvolvidas`]?.forEach((e) => {
      const envolvedSaved = spaceUndo?.people?.find(
        (sp) => sp?.id === e?.[`${PREFIX}pessoasenvolvidasespacoid`]
      );

      if (envolvedSaved) {
        peopleToDelete.push(envolvedSaved);
      } else {
        const func = e?.[`_${PREFIX}funcao_value`]
          ? _.cloneDeep(dictTag[e?.[`_${PREFIX}funcao_value`]])
          : {};

        peopleToDelete.push({
          ...e,
          keyId: v4(),
          deleted: true,
          isRequired: e?.[`${PREFIX}obrigatorio`],
          id: e[`${PREFIX}pessoasenvolvidasespacoid`],
          person: dictPeople[e?.[`_${PREFIX}pessoa_value`]],
          function: func,
        });
      }
    });

    spaceUndo?.people?.forEach((e) => {
      const envolvedSaved = newSpace?.[
        `${PREFIX}Espaco_PessoasEnvolvidas`
      ]?.find((sp) => e?.id === sp?.[`${PREFIX}pessoasenvolvidasespacoid`]);

      if (!envolvedSaved) {
        peopleToDelete.push({
          ...e,
          id: null,
        });
      }
    });

    newSpace?.[`${PREFIX}Espaco_NomeEspaco`]?.forEach((e) => {
      const nameSaved = spaceUndo?.names?.find(
        (sp) => sp?.id === e?.[`${PREFIX}nomeespacoid`]
      );

      if (nameSaved) {
        namesToDelete.push(nameSaved);
      } else {
        namesToDelete.push({
          keyId: v4(),
          deleted: true,
          id: e[`${PREFIX}nomeespacoid`],
          name: e?.[`${PREFIX}nome`],
          nameEn: e?.[`${PREFIX}nomeen`],
          nameEs: e?.[`${PREFIX}nomees`],
          use: dictTag?.[e?.[`_${PREFIX}uso_value`]],
        });
      }
    });

    spaceUndo?.names?.forEach((e) => {
      const nameSaved = newSpace?.[`${PREFIX}Espaco_NomeEspaco`]?.find(
        (sp) => e?.id === sp?.[`${PREFIX}nomeespacoid`]
      );

      if (!nameSaved) {
        namesToDelete.push({
          ...e,
          id: null,
        });
      }
    });

    newSpace?.[`${PREFIX}Espaco_CapacidadeEspaco`]?.forEach((e) => {
      const nameSaved = spaceUndo?.capacities?.find(
        (sp) => sp?.id === e?.[`${PREFIX}capacidadeespacoid`]
      );

      if (nameSaved) {
        capacityToDelete.push(nameSaved);
      } else {
        capacityToDelete.push({
          keyId: v4(),
          deleted: true,
          id: e[`${PREFIX}capacidadeespacoid`],
          quantity: e?.[`${PREFIX}quantidade`],
          use: dictTag[e?.[`_${PREFIX}uso_value`]],
        });
      }
    });

    spaceUndo?.capacities?.forEach((e) => {
      const nameSaved = newSpace?.[`${PREFIX}Espaco_CapacidadeEspaco`]?.find(
        (sp) => e?.id === sp?.[`${PREFIX}capacidadeespacoid`]
      );

      if (!nameSaved) {
        capacityToDelete.push({
          ...e,
          id: null,
        });
      }
    });

    dispatch(
      addOrUpdateSpace(
        {
          ...spaceUndo,
          people: peopleToDelete,
          names: namesToDelete,
          capacities: capacityToDelete,
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
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const anexos = await refAnexo?.current?.getAnexos();
        const spacesRequest = await getSpaceByEmail(values.email);

        const spacesHasEmail = spacesRequest?.value?.some(
          (spc) => spc?.[`${PREFIX}espacoid`] !== space?.[`${PREFIX}espacoid`]
        );

        if (spacesHasEmail) {
          notification.error({
            title: 'E-mail utilizado',
            description:
              'O E-mail informado está sendo utilizado em outro espaço, verifique!',
          });
          setLoading(false);
          return;
        }

        const tagsToDelete = space?.[
          `${PREFIX}Espaco_Etiqueta_Etiqueta`
        ]?.filter(
          (e) =>
            !values?.tags?.some(
              (sp) => sp?.[`${PREFIX}etiquetaid`] === e[`${PREFIX}etiquetaid`]
            )
        );

        localStorage.setItem('undoSpace', JSON.stringify(pastValues));

        dispatch(
          addOrUpdateSpace(
            {
              ...values,
              anexos,
              tagsToDelete,
              id: space?.[`${PREFIX}espacoid`],
            },
            {
              onSuccess: handleSuccess,
              onError: handleError,
            }
          )
        );
      } catch (err) {
        console.error(err);
      }
    },
  });

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTab(newValue);
  };

  const handleUpdateData = () => {
    dispatch(fetchAllPerson({}));
    dispatch(fetchAllTags({}));
  };

  const spaceTooltip = tooltips.find((tooltip) => tooltip?.Title === 'Espaço');

  return (
    <Dialog
      open={open}
      className={styles.dialogContent}
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
              {space?.[`${PREFIX}espacoid`]
                ? 'Editar Espaço'
                : 'Cadastrar Espaço'}
              {formik.values.name ? ` - ${formik.values.name}` : ''}
            </Typography>

            <HelperTooltip content={spaceTooltip?.Conteudo} />

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
            scrollButtons='auto'
            aria-label='full width tabs example'
          >
            <Tab label='Informações' {...a11yProps(0)} />
            <Tab label='Nome Fantasia' {...a11yProps(1)} />
            <Tab label='Capacidade' {...a11yProps(2)} />
            <Tab label='Pessoas Envolvidas' {...a11yProps(3)} />
            <Tab label='Observações' {...a11yProps(4)} />
          </Tabs>
        </AppBar>
        <TabPanel value={tab} index={0}>
          <Box className={styles.boxTab}>
            <Info refAnexo={refAnexo} formik={formik} />
          </Box>
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <Box className={styles.boxTab}>
            <FantasyName formik={formik} />
          </Box>
        </TabPanel>
        <TabPanel value={tab} index={2}>
          <Box className={styles.boxTab}>
            <Capacity formik={formik} />
          </Box>
        </TabPanel>
        <TabPanel value={tab} index={3}>
          <Box className={styles.boxTab}>
            <EnvolvedPerson formik={formik} />
          </Box>
        </TabPanel>
        <TabPanel value={tab} index={4}>
          <Box className={styles.boxTab}>
            <Observation formik={formik} />
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

export default AddSpace;
