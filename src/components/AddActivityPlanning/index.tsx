import * as React from 'react';
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
  Typography,
  DialogTitle,
  IconButton,
  Tooltip,
  ClickAwayListener,
} from '@material-ui/core';
import * as yup from 'yup';
import { v4 } from 'uuid';
import Info from './Info';
import Classroom from './Classroom';
import Documents from './Documents';
import EnvolvedPerson from './EnvolvedPerson';
import Observation from './Observation';
import FantasyName from './FantasyName';
import styles from './AddActivityPlanning.module.scss';
import { useConfirmation, useNotification } from '~/hooks';
import {
  EActivityTypeApplication,
  TYPE_ACTIVITY,
  TYPE_RESOURCE,
} from '~/config/enums';
import * as moment from 'moment';
import { PREFIX } from '~/config/database';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '~/store';
import {
  getActivity,
  updateActivityAll,
} from '~/store/modules/activity/actions';
import * as _ from 'lodash';
import { useFormik } from 'formik';
import { Close, HelpOutline, Replay } from '@material-ui/icons';
import { fetchAllPerson } from '~/store/modules/person/actions';
import { fetchAllTags } from '~/store/modules/tag/actions';
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

interface IAddActivityPlanningProps {
  open: boolean;
  activity?: any;
  refetch?: any;
  activityType:
    | TYPE_ACTIVITY.ACADEMICA
    | TYPE_ACTIVITY.NON_ACADEMICA
    | TYPE_ACTIVITY.INTERNAL;
  handleClose: () => void;
  handleEdit: (item) => void;
}

const AddActivityPlanning: React.FC<IAddActivityPlanningProps> = ({
  open,
  activityType,
  activity,
  refetch,
  handleClose,
  handleEdit,
}) => {
  const DEFAULT_VALUES = {
    name: null,
    startTime: null,
    duration: moment('00:05', 'HH:mm'),
    endTime: null,
    quantity: 0,
    area: null,
    course: null,
    spaces: [],
    theme: '',
    description: '',
    observation: '',
    equipments: [],
    finiteResource: [],
    infiniteResource: [],
    names: [
      {
        keyId: v4(),
        name: '',
        nameEn: '',
        nameEs: '',
        use: '',
      },
    ],
    people: [
      {
        keyId: v4(),
        person: null,
        function: null,
      },
    ],
  };

  const [tab, setTab] = React.useState(0);
  const [initialValues, setInitialValues] = React.useState(DEFAULT_VALUES);
  const [pastValues, setPastValues] = React.useState<any>(DEFAULT_VALUES);
  const [loading, setLoading] = React.useState(false);

  const validationSchema = yup.object({
    name: yup.mixed().required('Campo Obrigatório'),
    // startTime: yup.mixed().test({
    //   name: 'durationValid',
    //   message: 'Formato inválido',
    //   test: (v) => {
    //     if (v) {
    //       return v?.isValid();
    //     }
    //     return true;
    //   },
    // }),
    duration: yup
      .mixed()
      .required('Campo Obrigatório')
      .test({
        name: 'durationValid',
        message: 'Formato inválido',
        test: (v) => v?.isValid(),
      }),
    quantity: yup
      .number()
      .min(0, 'Informe um número maior ou igual a zero')
      .integer('Informe um número inteiro'),
    // area: yup.mixed().required('Campo Obrigatório'),
  });

  const { notification } = useNotification();
  const { confirmation } = useConfirmation();
  const { undo } = useUndo();
  const dispatch = useDispatch();

  const { space, tag, person, app } = useSelector((state: AppState) => state);
  const { dictTag } = tag;
  const { dictSpace } = space;
  const { dictPeople } = person;
  const { tooltips } = app;

  React.useEffect(() => {
    if (activity) {
      const iniVal = {
        id: activity[`${PREFIX}atividadeid`],
        name: activity[`${PREFIX}nome`] || '',
        startTime:
          (activity[`${PREFIX}inicio`] &&
            moment(activity[`${PREFIX}inicio`], 'HH:mm')) ||
          null,
        duration:
          (activity[`${PREFIX}duracao`] &&
            moment(activity[`${PREFIX}duracao`], 'HH:mm')) ||
          null,
        endTime:
          (activity[`${PREFIX}fim`] &&
            moment(activity[`${PREFIX}fim`], 'HH:mm')) ||
          null,
        typeApplication: activity[`${PREFIX}tipoaplicacao`],
        type: activity[`${PREFIX}tipo`],
        quantity: activity[`${PREFIX}quantidadesessao`] || 0,
        area: activity[`${PREFIX}AreaAcademica`]
          ? {
              ...activity[`${PREFIX}AreaAcademica`],
              value:
                activity[`${PREFIX}AreaAcademica`]?.[`${PREFIX}etiquetaid`],
              label: activity[`${PREFIX}AreaAcademica`]?.[`${PREFIX}nome`],
            }
          : null,
        course: activity[`${PREFIX}Curso`]
          ? {
              ...activity[`${PREFIX}Curso`],
              value:
                activity[`${PREFIX}Curso`]?.[`${PREFIX}etiquetaid`],
              label: activity[`${PREFIX}Curso`]?.[`${PREFIX}nome`],
            }
          : null,
        spaces: activity[`${PREFIX}Atividade_Espaco`]?.length
          ? activity[`${PREFIX}Atividade_Espaco`].map(
              (e) => dictSpace[e?.[`${PREFIX}espacoid`]]
            )
          : [],
        theme: activity?.[`${PREFIX}temaaula`] || '',
        description: activity?.[`${PREFIX}descricaoobjetivo`] || '',
        observation: activity[`${PREFIX}observacao`] || '',
        equipments: activity[`${PREFIX}Atividade_Equipamentos`]?.length
          ? activity[`${PREFIX}Atividade_Equipamentos`].map(
              (e) => dictTag[e?.[`${PREFIX}etiquetaid`]]
            )
          : [],
        finiteResource: activity[
          `${PREFIX}Atividade_RecursoFinitoInfinito`
        ]?.filter((e) => e?.[`${PREFIX}tiporecurso`] === TYPE_RESOURCE.FINITO),
        infiniteResource: activity[
          `${PREFIX}Atividade_RecursoFinitoInfinito`
        ]?.filter(
          (e) => e?.[`${PREFIX}tiporecurso`] === TYPE_RESOURCE.INFINITO
        ),
        names: activity[`${PREFIX}Atividade_NomeAtividade`]?.length
          ? activity[`${PREFIX}Atividade_NomeAtividade`].map((e) => ({
              keyId: v4(),
              id: e[`${PREFIX}nomeatividadeid`],
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
        people: activity[`${PREFIX}Atividade_PessoasEnvolvidas`]?.length
          ? activity[`${PREFIX}Atividade_PessoasEnvolvidas`]?.map(
              (e, index) => ({
                keyId: v4(),
                id: e[`${PREFIX}pessoasenvolvidasatividadeid`],
                person: dictPeople[e?.[`_${PREFIX}pessoa_value`]],
                function: dictTag[e?.[`_${PREFIX}funcao_value`]],
              })
            )
          : [
              {
                keyId: v4(),
                person: null,
                function: null,
              },
            ],
      };

      setInitialValues(_.cloneDeep(iniVal));
      setPastValues(_.cloneDeep(iniVal));
    }
  }, [activity]);

  const onClose = () => {
    refetch();
    handleClose();
    setTab(0);
    formik.handleReset(DEFAULT_VALUES);
    setInitialValues(DEFAULT_VALUES);
    setPastValues(DEFAULT_VALUES);
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
    handleEdit(item);
    setLoading(false);
    if (pastValues?.id || pastValues?.[`${PREFIX}atividadeid`]) {
      undo.open('Deseja desfazer a ação?', () => handleUndo(item));
    }

    notification.success({
      title: 'Sucesso',
      description: activity
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

  const handleUndo = async (newActivity) => {
    const activityUndo = JSON.parse(
      localStorage.getItem('undoActivityPlanning')
    );

    const peopleToDelete = [];
    const namesToDelete = [];
    const documentsToDelete = [];

    newActivity?.[`${PREFIX}Atividade_PessoasEnvolvidas`]?.forEach((e) => {
      const envolvedSaved = activityUndo?.people?.find(
        (sp) => sp?.id === e?.[`${PREFIX}pessoasenvolvidasatividadeid`]
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
          id: e[`${PREFIX}pessoasenvolvidasatividadeid`],
          person: dictPeople[e?.[`_${PREFIX}pessoa_value`]],
          function: func,
        });
      }
    });

    activityUndo?.people?.forEach((e) => {
      const envolvedSaved = newActivity?.[
        `${PREFIX}Atividade_PessoasEnvolvidas`
      ]?.find((sp) => e?.id === sp?.[`${PREFIX}pessoasenvolvidasatividadeid`]);

      if (!envolvedSaved) {
        peopleToDelete.push({
          ...e,
          id: null,
        });
      }
    });

    newActivity?.[`${PREFIX}Atividade_NomeAtividade`]?.forEach((e) => {
      const nameSaved = activityUndo?.names?.find(
        (sp) => sp?.id === e?.[`${PREFIX}nomeatividadeid`]
      );

      if (nameSaved) {
        namesToDelete.push(nameSaved);
      } else {
        namesToDelete.push({
          keyId: v4(),
          deleted: true,
          id: e[`${PREFIX}nomeatividadeid`],
          name: e?.[`${PREFIX}nome`],
          nameEn: e?.[`${PREFIX}nomeen`],
          nameEs: e?.[`${PREFIX}nomees`],
          use: dictTag?.[e?.[`_${PREFIX}uso_value`]],
        });
      }
    });

    activityUndo?.names?.forEach((e) => {
      const nameSaved = newActivity?.[`${PREFIX}Atividade_NomeAtividade`]?.find(
        (sp) => e?.id === sp?.[`${PREFIX}nomeatividadeid`]
      );

      if (!nameSaved) {
        namesToDelete.push({
          ...e,
          id: null,
        });
      }
    });

    newActivity?.[`${PREFIX}Atividade_Documento`]?.forEach((e) => {
      const documentSaved = activityUndo?.documents?.find(
        (sp) => sp?.id === e?.[`${PREFIX}documentosatividadeid`]
      );

      if (documentSaved) {
        documentsToDelete.push(documentSaved);
      } else {
        documentsToDelete.push({
          keyId: v4(),
          deleted: true,
          id: e?.[`${PREFIX}documentosatividadeid`],
          name: e?.[`${PREFIX}nome`],
          link: e?.[`${PREFIX}link`],
          font: e?.[`${PREFIX}fonte`],
          delivery: e?.[`${PREFIX}entrega`],
        });
      }
    });

    activityUndo?.documents?.forEach((e) => {
      const documentSaved = newActivity?.[`${PREFIX}Atividade_Documento`]?.find(
        (sp) => e?.id === sp?.[`${PREFIX}documentosatividadeid`]
      );

      if (!documentSaved) {
        documentsToDelete.push({
          ...e,
          id: null,
        });
      }
    });

    dispatch(
      updateActivityAll(
        {
          ...activityUndo,
          [`${PREFIX}atividadeid`]: activityUndo.id,
          duration: moment(activityUndo?.duration),
          people: peopleToDelete,
          names: namesToDelete,
          documents: documentsToDelete,
        },
        {
          onSuccess: (actv) => {
            refetch?.();
            handleEdit(actv);
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

      localStorage.setItem('undoActivityPlanning', JSON.stringify(pastValues));
      try {
        dispatch(
          updateActivityAll(
            {
              ...values,
              [`${PREFIX}atividadeid`]: activity?.[`${PREFIX}atividadeid`],
              type: activityType,
              typeApplication: EActivityTypeApplication.PLANEJAMENTO,
              id: activity?.[`${PREFIX}atividadeid`],
            },
            {
              onSuccess: handleSuccess,
              onError: handleError,
            }
          )
        );
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    },
  });

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTab(newValue);
  };

  const handleUpdateData = () => {
    dispatch(fetchAllPerson({}));
    dispatch(fetchAllTags({}));
    dispatch(fetchAllSpace({}));
  };

  const components = {
    info: <Info formik={formik} activityType={activityType} />,
    fantasyName: <FantasyName formik={formik} />,
    envolvedPeople: <EnvolvedPerson formik={formik} />,
    classroom: <Classroom formik={formik} />,
    documents: (
      <Documents activity={activity} setFieldValue={formik.setFieldValue} />
    ),
    observation: <Observation formik={formik} />,
  };

  const tabs = {
    [TYPE_ACTIVITY.ACADEMICA]: [
      {
        component: 'info',
        label: 'Informações',
      },
      {
        component: 'fantasyName',
        label: 'Nome Fantasia',
      },
      {
        component: 'envolvedPeople',
        label: 'Pessoas Envolvidas',
      },
      {
        component: 'classroom',
        label: 'Aula',
      },
      {
        component: 'documents',
        label: 'Documentos',
      },
      {
        component: 'observation',
        label: 'Observações',
      },
    ],
    [TYPE_ACTIVITY.NON_ACADEMICA]: [
      {
        component: 'info',
        label: 'Informações',
      },
      {
        component: 'fantasyName',
        label: 'Nome Fantasia',
      },
      {
        component: 'envolvedPeople',
        label: 'Pessoas Envolvidas',
      },
      {
        component: 'observation',
        label: 'Observações',
      },
    ],
    [TYPE_ACTIVITY.INTERNAL]: [
      {
        component: 'info',
        label: 'Informações',
      },
      {
        component: 'fantasyName',
        label: 'Nome Fantasia',
      },
      {
        component: 'envolvedPeople',
        label: 'Pessoas Envolvidas',
      },
      {
        component: 'observation',
        label: 'Observações',
      },
    ],
  };

  const activityTooltip = tooltips.find(
    (tooltip) =>
      tooltip?.Title ===
      (activityType === TYPE_ACTIVITY.ACADEMICA
        ? 'Atividade Acadêmica'
        : activityType === TYPE_ACTIVITY.NON_ACADEMICA
        ? 'Atividade não Acadêmica'
        : 'Atividade Interna')
  );

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={onClose}
      disableBackdropClick
      maxWidth='md'
      className={styles.dialogContent}
    >
      <DialogTitle style={{ paddingBottom: 0 }}>
        <Box>
          <Box display='flex' alignItems='center' style={{ gap: '10px' }}>
            <Typography
              variant='h6'
              color='textPrimary'
              style={{ fontWeight: 'bold', maxWidth: '48rem' }}
            >
              {activity?.[`${PREFIX}atividadeid`]
                ? 'Editar Atividade'
                : 'Cadastrar Atividade'}
              {formik.values.name ? ` - ${formik.values.name}` : ''}
            </Typography>

            <HelperTooltip content={activityTooltip?.Conteudo} />

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
            {tabs[activityType]?.map((ta, i) => (
              <Tab label={ta.label} {...a11yProps(i)} />
            ))}
          </Tabs>
        </AppBar>

        {tabs[activityType]?.map((ta, i) => (
          <TabPanel value={tab} index={i}>
            <Box className={styles.boxTab}>{components[ta.component]}</Box>
          </TabPanel>
        ))}
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

export default AddActivityPlanning;
