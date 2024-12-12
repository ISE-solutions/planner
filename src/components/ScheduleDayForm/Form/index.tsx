import 'react-quill/dist/quill.snow.css';
import * as React from 'react';
import * as yup from 'yup';
import * as _ from 'lodash';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import {
  CheckCircle,
  Close,
  ExpandMore,
  Publish,
  Replay,
  Visibility,
  VisibilityOff,
} from '@material-ui/icons';
import { BoxCloseIcon } from './styles';
import { useFormik } from 'formik';
import { v4 } from 'uuid';
import InfoForm from './InfoForm';
import ActivitiesForm from './ActivitiesForm';
import EnvolvedPeopleForm from './EnvolvedPeopleForm';
import LocaleForm from './LocaleForm';
import { Anexos, Backdrop } from '~/components';
import { useConfirmation, useNotification, useScheduleDay } from '~/hooks';
import * as moment from 'moment';
import { PERSON, PREFIX } from '~/config/database';
import { getFiles } from '~/utils/sharepoint';
import { sp } from '@pnp/sp';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import formatActivityModel from '~/utils/formatActivityModel';
import { EFatherTag, EGroups } from '~/config/enums';
import checkPermitionByTag from '~/utils/checkPermitionByTag';
import {
  addUpdateSchedule,
  getSchedules,
} from '~/store/modules/schedule/actions';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllPerson } from '~/store/modules/person/actions';
import { fetchAllTags } from '~/store/modules/tag/actions';
import { fetchAllSpace } from '~/store/modules/space/actions';
import { batchAddNotification } from '~/store/modules/notification/actions';
import { AppState } from '~/store';
import HelperTooltip from '~/components/HelperTooltip';
import useUndo from '~/hooks/useUndo';
import { executeChangeTemperature } from '~/store/modules/genericActions/actions';
import LoadModel from './LoadModel';
import { getActivityByScheduleId } from '~/store/modules/activity/actions';

interface IFormProps {
  isModel?: boolean;
  isScheduleModel?: boolean;
  isDraft: boolean;
  isGroup: boolean;
  isLoadModel?: boolean;
  titleRequired?: boolean;
  isProgramResponsible: boolean;
  isProgramDirector: boolean;
  isHeadOfService: boolean;
  context: WebPartContext;
  teamId?: string;
  programId?: string;
  schedule?: any;
  program?: any;
  team?: any;
  dictTag: any;
  dictPeople: any;
  dictSpace: any;
  peopleOptions: any[];
  spaceOptions: any[];
  tagsOptions: any[];
  setScheduleModel: React.Dispatch<any>;
  getActivity: (id: any) => Promise<any>;
  setSchedule: (item: any) => void;
  handleClose: (isRefetch?: boolean) => void;
}

const Form: React.FC<IFormProps> = ({
  teamId,
  program,
  team,
  programId,
  isModel,
  isDraft,
  isGroup,
  isLoadModel,
  isScheduleModel,
  titleRequired,
  setScheduleModel,
  isProgramResponsible,
  isProgramDirector,
  isHeadOfService,
  schedule: scheduleSaved,
  context,
  dictTag,
  dictSpace,
  dictPeople,
  tagsOptions,
  spaceOptions,
  peopleOptions,
  setSchedule,
  handleClose,
}) => {
  const DEFAULT_VALUES = {
    name: '',
    date:
      isScheduleModel && !scheduleSaved
        ? moment('2006-01-01', 'YYYY-MM-DD')
        : null,
    module: null,
    startTime: null,
    duration: null,
    endTime: null,
    modality: null,
    tool: null,
    toolBackup: null,
    temperature: null,
    place: null,
    link: '',
    linkBackup: '',
    activities: [],
    activitiesToDelete: [],
    observation: '',
    isGroupActive: false,
    anexos: [],
    people: [{ keyId: v4(), person: null, function: null }],
    locale: [{ keyId: v4(), space: null, observation: '' }],
  };

  const [dateReference, setDateReference] = React.useState<any>();
  const [loading, setLoading] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [publishLoading, setPublishLoading] = React.useState(false);
  const [isSaveAsModel, setSaveAsModel] = React.useState(false);
  const [editLoading, setEditLoading] = React.useState(false);
  const [openLoad, setOpenLoad] = React.useState(false);
  const [initialValues, setInitialValues] = React.useState(DEFAULT_VALUES);
  const [isDetail, setIsDetail] = React.useState(!isLoadModel && scheduleSaved);

  const [loadingApproval, setLoadingApproval] = React.useState({});
  const [valuesSetted, setValuesSetted] = React.useState(false);
  const [pastValues, setPastValues] = React.useState<any>(DEFAULT_VALUES);
  const [errorApproval, setErrorApproval] = React.useState<{
    open: boolean;
    msg: React.ReactNode;
  }>({
    open: false,
    msg: null,
  });

  const updateTemperature = React.useRef(false);

  const dispatch = useDispatch();
  const { undo } = useUndo();

  const { app } = useSelector((state: AppState) => state);
  const { tooltips } = app;

  const programDirector = tagsOptions.find(
    (e) =>
      !e?.[`${PREFIX}excluido`] &&
      e?.[`${PREFIX}ativo`] &&
      e?.[`${PREFIX}nome`] === EFatherTag.DIRETOR_PROGRAMA
  );

  const coordination = tagsOptions.find(
    (e) =>
      !e?.[`${PREFIX}excluido`] &&
      e?.[`${PREFIX}ativo`] &&
      e?.[`${PREFIX}nome`] === EFatherTag.COORDENACAO_ADMISSOES
  );

  const validationSchema = yup.object({
    date: yup.mixed().required('Campo Obrigatório'),
  });

  const validationSchemaModel = yup.object({
    name: yup.string().required('Campo Obrigatório'),
    date: yup
      .mixed()
      .required('Campo Obrigatório')
      .test({
        message: 'Data Inválida',
        exclusive: true,
        name: 'invalidDateMessage',
        test: (val) => {
          return val?.isValid();
        },
      }),
  });

  const refAnexo = React.useRef<any>();

  const { notification } = useNotification();
  const { confirmation } = useConfirmation();

  const { person } = useSelector((state: AppState) => state);
  const { persons } = person;

  const currentUser = React.useMemo(() => {
    if (peopleOptions?.length) {
      const myEmail =
        context.pageContext.user.email || context.pageContext.user.loginName;
      const people = peopleOptions?.find(
        (pe) =>
          pe?.[`${PREFIX}email`]?.toLocaleLowerCase() ===
          myEmail?.toLocaleLowerCase()
      );

      return {
        ...people,
        isPlanning: checkPermitionByTag(
          tagsOptions,
          people?.[`${PREFIX}Pessoa_Etiqueta_Etiqueta`],
          EFatherTag.PLANEJAMENTO
        ),
      };
    }
  }, [peopleOptions]);

  const [{ schedule, updateSchedule, updateEnvolvedPerson }] = useScheduleDay(
    {
      date: dateReference?.format('YYYY-MM-DD'),
      active: 'Ativo',
      teamId: teamId,
      model: isModel,
      group: isGroup ? 'Sim' : 'Não',
      filterTeam: true,
    },
    {
      manual: true,
    }
  );

  React.useEffect(() => {
    const handleBeforeUnload = (event) => {
      handleResetEditing();

      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  React.useEffect(() => {
    if (Object.keys(dictPeople).length && (schedule?.length || scheduleSaved)) {
      const scheduleDay = scheduleSaved || schedule[0];

      const iniVal = {
        id: scheduleDay?.[`${PREFIX}cronogramadediaid`],
        modeloid: scheduleDay.modeloid,
        baseadoemcronogramadiamodelo: scheduleDay.baseadoemcronogramadiamodelo,
        name: scheduleDay?.[`${PREFIX}nome`] || '',
        date:
          isLoadModel && isModel
            ? moment.utc(scheduleDay?.[`${PREFIX}data`])
            : isLoadModel
            ? null
            : moment.utc(scheduleDay?.[`${PREFIX}data`]),
        module: dictTag?.[scheduleDay?.[`_${PREFIX}modulo_value`]],
        modality: dictTag?.[scheduleDay?.[`_${PREFIX}modalidade_value`]],
        tool: dictTag?.[scheduleDay?.[`_${PREFIX}ferramenta_value`]],
        isGroupActive: scheduleDay?.[`${PREFIX}agrupamentoatividade`],
        startTime:
          (scheduleDay[`${PREFIX}inicio`] &&
            moment(scheduleDay[`${PREFIX}inicio`], 'HH:mm')) ||
          null,
        endTime:
          (scheduleDay[`${PREFIX}fim`] &&
            moment(scheduleDay[`${PREFIX}fim`], 'HH:mm')) ||
          null,
        duration:
          (scheduleDay[`${PREFIX}duracao`] &&
            moment(scheduleDay[`${PREFIX}duracao`], 'HH:mm')) ||
          null,
        toolBackup:
          dictTag?.[scheduleDay?.[`_${PREFIX}ferramentabackup_value`]],
        place: dictTag?.[scheduleDay?.[`_${PREFIX}local_value`]],
        link: scheduleDay?.[`${PREFIX}link`],
        temperature:
          dictTag?.[
            scheduleDay?.[`${PREFIX}Temperatura`]?.[`${PREFIX}etiquetaid`]
          ] || null,
        linkBackup: scheduleDay?.[`${PREFIX}linkbackup`],
        observation: scheduleDay?.[`${PREFIX}observacao`],
        anexos: [],
        activities: [],
        activitiesToDelete: [],
        people: scheduleDay[`${PREFIX}CronogramadeDia_PessoasEnvolvidas`]
          ?.length
          ? scheduleDay[`${PREFIX}CronogramadeDia_PessoasEnvolvidas`]?.map(
              (e) => {
                const func = dictTag[e?.[`_${PREFIX}funcao_value`]] || {};
                func.needApprove = func?.[`${PREFIX}Etiqueta_Pai`]?.some(
                  (e) => e?.[`${PREFIX}nome`] === EFatherTag.NECESSITA_APROVACAO
                );

                return {
                  keyId: v4(),
                  id: e?.[`${PREFIX}pessoasenvolvidascronogramadiaid`],
                  person: dictPeople[e?.[`_${PREFIX}pessoa_value`]],
                  function: func,
                };
              }
            )
          : [{ keyId: v4(), person: null, function: null }],
        locale: scheduleDay[`${PREFIX}CronogramadeDia_LocalCronogramaDia`]
          ?.length
          ? scheduleDay[`${PREFIX}CronogramadeDia_LocalCronogramaDia`]?.map(
              (e) => ({
                keyId: v4(),
                id: e?.[`${PREFIX}localcronogramadiaid`],
                space: dictSpace[e?.[`_${PREFIX}espaco_value`]],
                observation: e?.[`${PREFIX}observacao`],
              })
            )
          : [{ keyId: v4(), person: null, function: null }],
      };

      let newActivities = [];
      getActivityByScheduleId(
        scheduleDay?.[`${PREFIX}cronogramadediaid`] || scheduleDay.modeloid
      ).then(({ value }) => {
        newActivities = value
          ?.map((act) => {
            let activity = {
              ...act,
              teamId,
              programId,
              id: act[`${PREFIX}atividadeid`],
              name: act[`${PREFIX}nome`] || '',
              quantity: act[`${PREFIX}quantidadesessao`] || 0,
              theme: act[`${PREFIX}temaaula`] || '',
              area: act[`${PREFIX}AreaAcademica`]
                ? {
                    ...act[`${PREFIX}AreaAcademica`],
                    value:
                      act[`${PREFIX}AreaAcademica`]?.[`${PREFIX}etiquetaid`],
                    label: act[`${PREFIX}AreaAcademica`]?.[`${PREFIX}nome`],
                  }
                : null,
              spaces: act[`${PREFIX}Atividade_Espaco`]?.length
                ? act[`${PREFIX}Atividade_Espaco`].map(
                    (e) => dictSpace[e?.[`${PREFIX}espacoid`]]
                  )
                : [],
              people: act[`${PREFIX}Atividade_PessoasEnvolvidas`]?.length
                ? act[`${PREFIX}Atividade_PessoasEnvolvidas`]?.map((e) => {
                    const func = dictTag[e?.[`_${PREFIX}funcao_value`]] || {};
                    func.needApprove = func?.[`${PREFIX}Etiqueta_Pai`]?.some(
                      (e) =>
                        e?.[`${PREFIX}nome`] === EFatherTag.NECESSITA_APROVACAO
                    );
                    const pe = dictPeople[e?.[`_${PREFIX}pessoa_value`]];

                    return {
                      ...e,
                      keyId: v4(),
                      id: e[`${PREFIX}pessoasenvolvidasatividadeid`],
                      person: pe,
                      function: func,
                    };
                  })
                : [
                    {
                      keyId: v4(),
                      person: null,
                      function: null,
                    },
                  ],
              startDate: moment(act[`${PREFIX}datahorainicio`]),
              endDate: moment(act[`${PREFIX}datahorafim`]),
              startTime:
                (act[`${PREFIX}inicio`] &&
                  moment(act[`${PREFIX}inicio`], 'HH:mm')) ||
                null,
              duration:
                (act[`${PREFIX}duracao`] &&
                  moment(act[`${PREFIX}duracao`], 'HH:mm')) ||
                null,
              endTime:
                (act[`${PREFIX}fim`] && moment(act[`${PREFIX}fim`], 'HH:mm')) ||
                null,
              keyId: v4(),
            };

            if (isLoadModel) {
              delete activity[`${PREFIX}atividadeid`];
            }

            return activity;
          })
          .sort((a, b) => a.startTime.unix() - b.startTime.unix());

        // setPastValues({ ...iniVal, activities: newActivities });

        setInitialValues(iniVal);
        setValuesSetted(true);

        getFiles(
          sp,
          `Anexos Interno/Cronograma Dia/${moment(
            scheduleDay?.createdon
          ).format('YYYY')}/${scheduleDay?.[`${PREFIX}cronogramadediaid`]}`
        )
          .then((files) => {
            formik.setFieldValue('anexos', files);
            formik.setFieldValue('activities', newActivities);
            setPastValues({
              ...iniVal,
              activities: newActivities,
              anexos: files,
            });
          })
          .catch(() => {
            formik.setFieldValue('activities', newActivities);
            setPastValues({
              ...iniVal,
              activities: newActivities,
            });
          });

        if (
          scheduleDay?.[`_${PREFIX}editanto_value`] ===
          currentUser?.[`${PREFIX}pessoaid`]
        ) {
          setIsDetail(false);
        }
      });
    }
  }, [schedule, scheduleSaved]);

  const handleSuccess = (newSchedule) => {
    // handleClose();

    if (updateTemperature.current) {
      dispatch(
        executeChangeTemperature(
          {
            origin: 'Cronograma de Dia',
            idOrigin: scheduleSaved?.[`${PREFIX}cronogramadediaid`],
            idPerson: currentUser?.[`${PREFIX}pessoaid`],
          },
          {
            onSuccess: () => {
              notification.success({
                title: 'Sucesso',
                description: 'Alteração solicitada com sucesso!',
              });
            },
            onError: () => null,
          }
        )
      );
    }

    setSchedule(newSchedule);
    setIsLoading(false);
    setLoading(false);
    setScheduleModel(null);
    notification.success({
      title: 'Sucesso',
      description: schedule?.length
        ? 'Atualizado com sucesso'
        : 'Cadastro realizado com sucesso',
    });

    if (pastValues?.id || pastValues?.[`${PREFIX}cronogramadediaid`]) {
      undo.open('Deseja desfazer a ação?', () => handleUndo(newSchedule));
    }

    // @ts-ignore
    if (formik.values.close) {
      setInitialValues(DEFAULT_VALUES);
      formik.resetForm();
      handleClose();
      setValuesSetted(false);
    }
  };

  const handleError = (error, newSchedule) => {
    setLoading(false);
    setIsLoading(false);

    if (newSchedule) {
      setSchedule(newSchedule);
      setIsDetail(true);
    }
    notification.error({
      title: 'Falha',
      description: error?.data?.error?.message,
    });
  };

  const myGroup = () => {
    if (currentUser?.isPlanning) {
      return EGroups.PLANEJAMENTO;
    }

    if (currentUser?.isAdmission) {
      return EGroups.ADMISSOES;
    }

    return '';
  };

  const handleUndo = async (newSchedule) => {
    setValuesSetted(false);
    const scheduleUndo = JSON.parse(localStorage.getItem('undoSchedule'));
    const peopleToDelete = [];
    const activitiesToUndo = [];

    newSchedule?.[`${PREFIX}CronogramadeDia_PessoasEnvolvidas`]?.forEach(
      (e) => {
        const envolvedSaved = scheduleUndo?.people?.find(
          (sp) => sp?.id === e?.[`${PREFIX}pessoasenvolvidascronogramadiaid`]
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
            id: e[`${PREFIX}pessoasenvolvidascronogramadiaid`],
            person: dictPeople[e?.[`_${PREFIX}pessoa_value`]],
            function: func,
          });
        }
      }
    );

    scheduleUndo?.people?.forEach((e) => {
      const envolvedSaved = newSchedule?.[
        `${PREFIX}CronogramadeDia_PessoasEnvolvidas`
      ]?.find(
        (sp) => e?.id === sp?.[`${PREFIX}pessoasenvolvidascronogramadiaid`]
      );

      if (!envolvedSaved) {
        peopleToDelete.push({
          ...e,
          id: null,
        });
      }
    });

    const newActivitiesRequest = await getActivityByScheduleId(
      newSchedule?.[`${PREFIX}cronogramadediaid`]
    );

    const newActivities = newActivitiesRequest?.value
      ?.map((act) => {
        let activity = {
          ...act,
          teamId,
          programId,
          startTime:
            (act[`${PREFIX}inicio`] &&
              moment(act[`${PREFIX}inicio`], 'HH:mm')) ||
            null,
          duration:
            (act[`${PREFIX}duracao`] &&
              moment(act[`${PREFIX}duracao`], 'HH:mm')) ||
            null,
          endTime:
            (act[`${PREFIX}fim`] && moment(act[`${PREFIX}fim`], 'HH:mm')) ||
            null,
          id: act[`${PREFIX}atividadeid`],
          name: act[`${PREFIX}nome`] || '',
          quantity: act[`${PREFIX}quantidadesessao`] || 0,
          theme: act[`${PREFIX}temaaula`] || '',
          area: act[`${PREFIX}AreaAcademica`]
            ? {
                ...act[`${PREFIX}AreaAcademica`],
                value: act[`${PREFIX}AreaAcademica`]?.[`${PREFIX}etiquetaid`],
                label: act[`${PREFIX}AreaAcademica`]?.[`${PREFIX}nome`],
              }
            : null,
          spaces: act[`${PREFIX}Atividade_Espaco`]?.length
            ? act[`${PREFIX}Atividade_Espaco`].map(
                (e) => dictSpace[e?.[`${PREFIX}espacoid`]]
              )
            : [],
          keyId: v4(),
        };

        if (isLoadModel) {
          delete activity[`${PREFIX}atividadeid`];
        }

        return activity;
      })
      .sort((a, b) => a.startTime.unix() - b.startTime.unix());

    newActivities?.forEach((e) => {
      const activitySaved = scheduleUndo?.activities?.find(
        (sp) => sp?.id === e?.[`${PREFIX}atividadeid`]
      );

      if (activitySaved) {
        activitiesToUndo.push({
          ...activitySaved,
          teamId,
          programId,
          id: activitySaved?.[`${PREFIX}atividadeid`],
          startTime: moment(e?.startTime),
          duration: moment(e?.duration),
          endTime: moment(e?.endTime),
        });
      } else {
        activitiesToUndo.push({ ...e, deleted: true });
      }
    });

    scheduleUndo?.activities?.forEach((e) => {
      const activitySaved = newActivities?.find((sp) => e?.id === sp?.id);

      if (!activitySaved) {
        activitiesToUndo.push({
          ...e,
          id: null,
          [`${PREFIX}atividadeid`]: null,
          [`${PREFIX}ativo`]: true,
          deleted: false,
          temperature: scheduleUndo?.temperature,
          startTime: moment(e?.startTime),
          duration: moment(e?.duration),
          endTime: moment(e?.endTime),
        });
      }
    });

    dispatch(
      addUpdateSchedule(
        {
          ...scheduleUndo,
          date: moment.utc(scheduleUndo.date).format('YYYY-MM-DD'),
          people: peopleToDelete,
          activities: activitiesToUndo,
        },
        teamId,
        programId,
        {
          onSuccess: (te) => {
            // re?.();
            setSchedule(te);
            notification.success({
              title: 'Sucesso',
              description: 'Ação realizada com sucesso',
            });
          },
          onError: (err) => {
            notification.error({
              title: 'Falha',
              description: err?.data?.error?.message,
            });
          },
        },
        updateTemperature.current,
        true
      )
    );
  };

  const handleSaveSubmit = (body, temperatureChanged) => {
    setValuesSetted(false);
    updateTemperature.current = temperatureChanged;

    dispatch(
      addUpdateSchedule(
        body,
        teamId,
        programId,
        {
          onSuccess: handleSuccess,
          onError: handleError,
        },
        temperatureChanged
      )
    );
  };

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnMount: false,
    validateOnChange: false,
    validationSchema:
      isModel && titleRequired ? validationSchemaModel : validationSchema,
    onSubmit: (values) => {
      localStorage.setItem('undoSchedule', JSON.stringify(pastValues));

      const files = refAnexo?.current?.getAnexos();
      const newActivities = values.activities
        .concat(values.activitiesToDelete)
        .map((act) => {
          const spacesToDelete = [];

          act?.[`${PREFIX}Atividade_Espaco`]?.forEach((e) => {
            const spaceSaved = act?.spaces?.find(
              (sp) => sp?.[`${PREFIX}espacoid`] === e?.[`${PREFIX}espacoid`]
            );

            if (!spaceSaved) {
              spacesToDelete.push(e);
            }
          });

          return { ...act, spacesToDelete };
        });

      setLoading(true);

      let temp = values.temperature;

      if (!temp && team?.[`${PREFIX}Temperatura`]) {
        temp =
          dictTag?.[team?.[`${PREFIX}Temperatura`]?.[`${PREFIX}etiquetaid`]];
      }

      if (!temp && program?.[`${PREFIX}Temperatura`]) {
        temp =
          dictTag?.[program?.[`${PREFIX}Temperatura`]?.[`${PREFIX}etiquetaid`]];
      }

      const body = {
        ...values,
        isGroupActive: isGroup,
        temperature: temp,
        date: values.date.utc().format('YYYY-MM-DD'),
        group: myGroup(),
        user: currentUser?.[`${PREFIX}pessoaid`],
        activities: newActivities?.map((actv) => ({
          [`${PREFIX}atividadeid`]: actv?.[`${PREFIX}atividadeid`],
          deleted: actv?.deleted,
          ...formatActivityModel(actv, values.date, {
            isModel: isModel,
            dictPeople: dictPeople,
            dictSpace: dictSpace,
            dictTag: dictTag,
            temp,
          }),
        })),
      };

      if (
        !isModel &&
        scheduleSaved?.[`${PREFIX}cronogramadediaid`] &&
        scheduleSaved?.[`${PREFIX}Temperatura`]?.[`${PREFIX}etiquetaid`] !==
          formik.values?.temperature?.[`${PREFIX}etiquetaid`]
      ) {
        confirmation.openConfirmation({
          title: 'Alteração de Temperatura',
          description: 'Deseja atualizar a temperatura dos subordinados?',
          yesLabel: 'Sim',
          noLabel: 'Não',
          onConfirm: () => {
            handleSaveSubmit(
              {
                ...body,
                isLoadModel,
                group: myGroup(),
                user: currentUser?.[`${PREFIX}pessoaid`],
                model: isModel,
                anexos: files,
              },
              true
            );
          },
          onCancel: () => {
            handleSaveSubmit(
              {
                ...body,
                isLoadModel,
                group: myGroup(),
                user: currentUser?.[`${PREFIX}pessoaid`],
                model: isModel,
                anexos: files,
              },
              false
            );
          },
        });
      } else {
        handleSaveSubmit(
          {
            ...body,
            isLoadModel,
            group: myGroup(),
            user: currentUser?.[`${PREFIX}pessoaid`],
            model: isModel,
            anexos: files,
          },
          false
        );
      }
    },
  });

  const onClose = async () => {
    if (!_.isEqualWith(pastValues, formik.values)) {
      confirmation.openConfirmation({
        title: 'Dados não alterados',
        description: 'O que deseja?',
        yesLabel: 'Salvar e sair',
        noLabel: 'Sair sem Salvar',
        onConfirm: () => {
          formik.setFieldValue('close', true);
          handleSave();
        },
        onCancel: async () => {
          handleResetEditing();
        },
      });
    } else {
      handleResetEditing();

      // handleClose();
    }
  };

  const validateSpaces = () => {
    if (isModel) {
      formik.handleSubmit();
      return;
    }

    const values = formik.values;
    const spacesWarning = [];
    let qtdTeam;

    values.activities.forEach((actv) => {
      actv?.[`${PREFIX}Atividade_Espaco`]?.forEach((actvSpace) => {
        const space = dictSpace?.[actvSpace?.[`${PREFIX}espacoid`]];
        const alertUse = space?.[`${PREFIX}Espaco_CapacidadeEspaco`].find(
          (cap) => {
            if (!cap?.[`_${PREFIX}uso_value`]) return false;

            const tagUso = dictTag?.[cap?.[`_${PREFIX}uso_value`]];
            return tagUso?.[`${PREFIX}nome`] === EFatherTag.ALERTA;
          }
        );

        qtdTeam = team?.[`${PREFIX}Turma_ParticipantesTurma`].find((part) => {
          if (!part?.[`_${PREFIX}uso_value`]) return false;

          const tagUso = dictTag?.[part?.[`_${PREFIX}uso_value`]];
          return tagUso?.[`${PREFIX}nome`] === EFatherTag.QUANTIDADE_TURMA;
        });

        if (
          alertUse?.[`${PREFIX}quantidade`] < qtdTeam?.[`${PREFIX}quantidade`]
        ) {
          spacesWarning.push({
            ...space,
            teamQuantity: qtdTeam?.[`${PREFIX}quantidade`],
            quantity: alertUse?.[`${PREFIX}quantidade`],
          });
        }
      });
    });

    if (spacesWarning.length) {
      confirmation.openConfirmation({
        title: 'Deseja continuar?',
        yesLabel: 'Continuar',
        description: (
          <Box>
            <Typography>
              O(s) seguinte(s) espaço(s) não possui capacidade suficientes para{' '}
              <strong> {qtdTeam?.[`${PREFIX}quantidade`]} </strong>{' '}
              participantes da turma
            </Typography>

            <ul>
              {spacesWarning.map((spcW) => (
                <li>
                  <strong>{spcW.label}:</strong>
                  <span style={{ paddingLeft: '10px' }}>{spcW.quantity}</span>
                </li>
              ))}
            </ul>
          </Box>
        ),
        onConfirm: () => {
          const notifiers = [];

          persons.forEach((p) => {
            p?.[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]?.forEach((tag) => {
              const fullTag = dictTag[tag?.[`${PREFIX}etiquetaid`]];

              if (fullTag?.[`${PREFIX}nome`] === EFatherTag.PLANEJAMENTO) {
                notifiers.push({
                  title: 'Alerta uso espaço',
                  link: `${
                    context.pageContext.web.absoluteUrl
                  }/SitePages/Programa.aspx?programid=${
                    program?.[`${PREFIX}programaid`]
                  }&teamid=${team?.[`${PREFIX}turmaid`]}&scheduleId=${
                    team?.[`${PREFIX}cronogramadediaid`]
                  }`,
                  description: `O(s) seguinte(s) espaço(s) ${spacesWarning
                    ?.map((e) => e?.label)
                    .join(' ;')} não possui capacidade suficientes para ${
                    qtdTeam?.[`${PREFIX}quantidade`]
                  }
                    participantes no dia ${scheduleSaved} ${moment
                    .utc(schedule?.[`${PREFIX}data`])
                    .format('DD/MM/YYYY')} da turma ${
                    team?.[`${PREFIX}sigla`]
                  } do Programa ${
                    program?.[`${PREFIX}NomePrograma`]?.[`${PREFIX}nome`]
                  }`,
                  pessoaId: p?.[`${PREFIX}pessoaid`],
                });
              }
            });
          });

          batchAddNotification(notifiers, {
            onSuccess: () => null,
            onError: () => null,
          });
          formik.handleSubmit();
        },
        onCancel: () => {
          setIsLoading(false);
        },
      });
      return;
    }

    formik.handleSubmit();
  };

  const onSave = async () => {
    setSaveAsModel(false);
    const errors = await formik.validateForm();

    if (Object.keys(errors).length) {
      return;
    }

    setIsLoading(true);

    if (!isScheduleModel) {
      getSchedules({
        date:
          typeof formik.values.date === 'string'
            ? formik.values.date
            : (formik.values.date?.format('YYYY-MM-DD') as any),
        active: 'Ativo',
        teamId: teamId,
        model: isModel,
        filterTeam: true,
      })
        .then((value) => {
          const othersSchedule = value.filter(
            (sc) =>
              sc?.[`${PREFIX}cronogramadediaid`] !==
              scheduleSaved?.[`${PREFIX}cronogramadediaid`]
          );
          setIsLoading(false);

          if (othersSchedule?.length) {
            notification.error({
              title: 'Data já sendo utilizada',
              description: 'O dia informado já possui cadastro, verifique!',
            });
            
            return;
          }

          validateSpaces();
        })
        .catch(() => {
          setIsLoading(false);
        });
    } else {
      validateSpaces();
    }
  };

  const handleSave = () => {
    onSave();
  };

  const handleToApprove = () => {
    const functionsRequired = {
      operationResponsible: false,
      attendanceCoordination: false,
      attendanceProgramDirector: false,
    };

    formik.values.people.forEach((envolved) => {
      if (
        envolved.function?.[`${PREFIX}nome`] ===
        EFatherTag.RESPONSAVEL_PELA_OPERACAO
      ) {
        functionsRequired.operationResponsible = true;
      }

      if (
        envolved.function?.[`${PREFIX}nome`] ===
        EFatherTag.COORDENACAO_ATENDIMENTO
      ) {
        functionsRequired.attendanceCoordination = true;
      }

      if (
        envolved.function?.[`${PREFIX}nome`] ===
        EFatherTag.DIRECAO_PROGRAMA_DE_ATENDIMENTO
      ) {
        functionsRequired.attendanceProgramDirector = true;
      }
    });

    if (Object.keys(functionsRequired).some((key) => !functionsRequired[key])) {
      setLoadingApproval(false);

      setErrorApproval({
        open: true,
        msg: (
          <div>
            <Typography>Falta informar as seguintes funções:</Typography>
            <ul>
              {!functionsRequired.operationResponsible && (
                <li>
                  <strong>{EFatherTag.RESPONSAVEL_PELA_OPERACAO}</strong>
                </li>
              )}
              {!functionsRequired.attendanceCoordination && (
                <li>
                  <strong>{EFatherTag.COORDENACAO_ATENDIMENTO}</strong>
                </li>
              )}
              {!functionsRequired.attendanceProgramDirector && (
                <li>
                  <strong>{EFatherTag.DIRECAO_PROGRAMA_DE_ATENDIMENTO}</strong>
                </li>
              )}
            </ul>
          </div>
        ),
      });

      return;
    }

    updateSchedule(
      scheduleSaved?.[`${PREFIX}cronogramadediaid`],
      {
        [`${PREFIX}LancarparaAprovacao@odata.bind`]: `/${PERSON}(${
          currentUser?.[`${PREFIX}pessoaid`]
        })`,
      },
      {
        onSuccess: (it) => {
          setSchedule(it);
          setLoadingApproval(false);
        },
        onError: () => {
          setLoadingApproval(false);
        },
      }
    );
  };

  const handleAproval = (nameField, dateField) => {
    setLoadingApproval({ [nameField]: true });
    updateSchedule(
      scheduleSaved[`${PREFIX}cronogramadediaid`],
      {
        [`${PREFIX}${nameField}@odata.bind`]: `/${PERSON}(${
          currentUser?.[`${PREFIX}pessoaid`]
        })`,
        [`${PREFIX}${dateField}`]: moment().format(),
      },
      {
        onSuccess: (te) => {
          setLoadingApproval({});
          setSchedule(te);
          notification.success({
            title: 'Sucesso',
            description: 'Atualização realizada com sucesso',
          });
        },
        onError: (err) => {
          setLoadingApproval({});
          notification.error({
            title: 'Falha',
            description: err?.data?.error?.message,
          });
        },
      }
    );
  };

  const editAproval = (nameField, dateField) => {
    setLoadingApproval({ name: true });
    updateSchedule(
      scheduleSaved[`${PREFIX}cronogramadediaid`],
      {
        [`${PREFIX}${nameField}@odata.bind`]: null,
        [`${PREFIX}${dateField}`]: null,
      },
      {
        onSuccess: (te) => {
          setLoadingApproval({});
          setSchedule(te);
          notification.success({
            title: 'Sucesso',
            description: 'Atualização realizada com sucesso',
          });
        },
        onError: (err) => {
          setLoadingApproval({});
          notification.error({
            title: 'Falha',
            description: err?.data?.error?.message,
          });
        },
      }
    );
  };

  const handleEditApproval = (nameField, dateField) => {
    confirmation.openConfirmation({
      onConfirm: () => editAproval(nameField, dateField),
      title: 'Confirmação',
      description:
        'Ao confirmar a área irá precisar de uma nova aprovação, tem certeza de realizar essa ação',
    });
  };

  const handlePublish = () => {
    setPublishLoading(true);

    updateSchedule(
      scheduleSaved?.[`${PREFIX}cronogramadediaid`],
      {
        [`${PREFIX}publicado`]: !scheduleSaved?.[`${PREFIX}publicado`],
      },
      {
        onSuccess: (it) => {
          setSchedule(it);
          setPublishLoading(false);
        },
        onError: () => {
          setPublishLoading(false);
        },
      }
    );
  };

  const handleEdit = () => {
    setEditLoading(true);

    updateSchedule(
      scheduleSaved?.[`${PREFIX}cronogramadediaid`],
      {
        [`${PREFIX}Editanto@odata.bind`]: `/${PERSON}(${
          currentUser?.[`${PREFIX}pessoaid`]
        })`,
        [`${PREFIX}datahoraeditanto`]: moment().format(),
      },
      {
        onSuccess: (act) => {
          setSchedule(act);
          setEditLoading(false);
          setIsDetail(false);
        },
        onError: () => {},
      }
    );
  };

  const handleResetEditing = async () => {
    if (
      scheduleSaved?.[`_${PREFIX}editanto_value`] !==
      currentUser?.[`${PREFIX}pessoaid`]
    ) {
      handleClose();
      setEditLoading(false);
      setIsDetail(false);
      setInitialValues(DEFAULT_VALUES);
      formik.resetForm();
      setValuesSetted(false);
      return;
    }
    setEditLoading(true);
    await updateSchedule(
      scheduleSaved?.[`${PREFIX}cronogramadediaid`],
      {
        [`${PREFIX}Editanto@odata.bind`]: null,
        [`${PREFIX}datahoraeditanto`]: null,
      },
      {
        onSuccess: (act) => {
          handleClose();
          setEditLoading(false);
          setIsDetail(false);
          setInitialValues(DEFAULT_VALUES);
          formik.resetForm();
          setValuesSetted(false);
        },
        onError: () => null,
      }
    );
  };

  const handleUpdateData = () => {
    dispatch(fetchAllPerson({}));
    dispatch(fetchAllTags({}));
    dispatch(fetchAllSpace({}));
  };

  const onLoadModel = async (model, infoToLoad) => {
    if (infoToLoad.info) {
      formik.setFieldValue(
        'module',
        dictTag?.[model?.[`_${PREFIX}modulo_value`]]
      );
      formik.setFieldValue(
        'modality',
        dictTag?.[model?.[`_${PREFIX}modalidade_value`]]
      );
      formik.setFieldValue(
        'place',
        dictTag?.[model?.[`_${PREFIX}local_value`]]
      );
      formik.setFieldValue('link', model?.[`${PREFIX}link`]);
      formik.setFieldValue(
        'temperature',
        dictTag?.[model?.[`_${PREFIX}temperatura_value`]]
      );
    }

    if (infoToLoad.activities) {
      const activities = await getActivityByScheduleId(
        model?.[`${PREFIX}cronogramadediaid`]
      );
      const currentActivity = _.cloneDeep(formik.values.activities);
      const newActivities = activities?.value?.map((actv) => {
        delete actv[`${PREFIX}atividadeid`];

        actv?.[`${PREFIX}Atividade_PessoasEnvolvidas`].forEach((elm) => {
          delete elm[`${PREFIX}pessoasenvolvidasatividadeid`];
        });

        actv?.[`${PREFIX}Atividade_NomeAtividade`].forEach((elm) => {
          delete elm[`${PREFIX}nomeatividadeid`];
        });

        actv?.[`${PREFIX}PessoasRequisica_Atividade`].forEach((elm) => {
          delete elm[`${PREFIX}pessoasenvolvidasrequisicaoacademicaid`];
        });

        actv?.[`${PREFIX}RequisicaoAcademica_Atividade`].forEach((elm) => {
          delete elm[`${PREFIX}requisicaoacademicaid`];
        });

        actv.people = actv[`${PREFIX}Atividade_PessoasEnvolvidas`]?.length
          ? actv[`${PREFIX}Atividade_PessoasEnvolvidas`]?.map((e) => {
              const func = dictTag[e?.[`_${PREFIX}funcao_value`]] || {};
              func.needApprove = func?.[`${PREFIX}Etiqueta_Pai`]?.some(
                (e) => e?.[`${PREFIX}nome`] === EFatherTag.NECESSITA_APROVACAO
              );
              const pe = dictPeople[e?.[`_${PREFIX}pessoa_value`]];

              return {
                ...e,
                keyId: v4(),
                id: e[`${PREFIX}pessoasenvolvidasatividadeid`],
                person: pe,
                function: func,
              };
            })
          : [
              {
                keyId: v4(),
                person: null,
                function: null,
              },
            ];

        return {
          ...actv,
          teamId,
          programId,
          name: actv[`${PREFIX}nome`] || '',
          quantity: actv[`${PREFIX}quantidadesessao`] || 0,
          theme: actv[`${PREFIX}temaaula`] || '',
          area: actv[`${PREFIX}AreaAcademica`]
            ? {
                ...actv[`${PREFIX}AreaAcademica`],
                value: actv[`${PREFIX}AreaAcademica`]?.[`${PREFIX}etiquetaid`],
                label: actv[`${PREFIX}AreaAcademica`]?.[`${PREFIX}nome`],
              }
            : null,
          spaces: actv[`${PREFIX}Atividade_Espaco`]?.length
            ? actv[`${PREFIX}Atividade_Espaco`].map(
                (e) => dictSpace[e?.[`${PREFIX}espacoid`]]
              )
            : [],
          startTime:
            (actv[`${PREFIX}inicio`] &&
              moment(actv[`${PREFIX}inicio`], 'HH:mm')) ||
            null,
          duration:
            (actv[`${PREFIX}duracao`] &&
              moment(actv[`${PREFIX}duracao`], 'HH:mm')) ||
            null,
          endTime:
            (actv[`${PREFIX}fim`] && moment(actv[`${PREFIX}fim`], 'HH:mm')) ||
            null,
          keyId: v4(),
        };
      });

      formik.setFieldValue(
        'activitiesToDelete',
        currentActivity?.map((e) => ({ ...e, deleted: true }))
      );
      formik.setFieldValue(
        'activities',
        newActivities.sort((a, b) => a.startTime.unix() - b.startTime.unix())
      );
    }

    if (infoToLoad.envolvedPeople) {
      const currentPeople = _.cloneDeep(formik.values.people);
      const newPeople = model[
        `${PREFIX}CronogramadeDia_PessoasEnvolvidas`
      ]?.map((e) => {
        const func = dictTag[e?.[`_${PREFIX}funcao_value`]] || {};
        func.needApprove = func?.[`${PREFIX}Etiqueta_Pai`]?.some(
          (e) => e?.[`${PREFIX}nome`] === EFatherTag.NECESSITA_APROVACAO
        );

        return {
          keyId: v4(),
          id: e?.[`${PREFIX}pessoasenvolvidascronogramadiaid`],
          person: dictPeople[e?.[`_${PREFIX}pessoa_value`]],
          function: func,
        };
      });

      formik.setFieldValue(
        'people',
        newPeople.concat(currentPeople?.map((e) => ({ ...e, deleted: true })))
      );
    }

    if (infoToLoad.attachments) {
      const anexos = await getFiles(
        sp,
        `Anexos Interno/Cronograma Dia/${moment(model?.createdon).format(
          'YYYY'
        )}/${model?.[`${PREFIX}cronogramadediaid`]}`
      );
      const anextosToDelete = _.cloneDeep(formik.values.anexos).map((e) => ({
        ...e,
        deveExcluir: true,
      }));

      formik.setFieldValue('anexos', anexos.concat(anextosToDelete));
    }

    if (infoToLoad.observation) {
      formik.setFieldValue('observation', model?.[`${PREFIX}observacao`]);
    }
  };

  const canEdit = React.useMemo(() => {
    const programDirectorTeam = team?.[
      `${PREFIX}Turma_PessoasEnvolvidasTurma`
    ]?.find(
      (env) =>
        env?.[`_${PREFIX}funcao_value`] ===
        programDirector?.[`${PREFIX}etiquetaid`]
    );

    const coordinatorTeam = team?.[
      `${PREFIX}Turma_PessoasEnvolvidasTurma`
    ]?.find(
      (env) =>
        env?.[`_${PREFIX}funcao_value`] ===
        coordination?.[`${PREFIX}etiquetaid`]
    );

    const programDirectorProgram = program?.[
      `${PREFIX}Programa_PessoasEnvolvidas`
    ]?.find(
      (env) =>
        env?.[`_${PREFIX}funcao_value`] ===
        programDirector?.[`${PREFIX}etiquetaid`]
    );

    return (
      currentUser?.isPlanning ||
      programDirectorTeam?.[`_${PREFIX}pessoa_value`] ===
        currentUser?.[`${PREFIX}pessoaid`] ||
      programDirectorProgram?.[`_${PREFIX}pessoa_value`] ===
        currentUser?.[`${PREFIX}pessoaid`] ||
      coordinatorTeam?.[`_${PREFIX}pessoa_value`] ===
        currentUser?.[`${PREFIX}pessoaid`] ||
      currentUser?.[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]?.some((cUser) =>
        scheduleSaved?.[`${PREFIX}Compartilhamento`]?.some(
          (comp) =>
            comp?.[`${PREFIX}etiquetaid`] === cUser?.[`${PREFIX}etiquetaid`]
        )
      ) ||
      currentUser?.[`${PREFIX}pessoaid`] ===
        scheduleSaved?.[`_${PREFIX}criadopor_value`]
    );
  }, [currentUser]);

  const scheduleTooltip = tooltips.find(
    (tooltip) => tooltip?.Title === 'Cronograma Dia'
  );

  const infoParent = React.useMemo(() => {
    const info = [];

    if (program) {
      info.push(program?.[`${PREFIX}NomePrograma`]?.[`${PREFIX}nome`]);
    }

    if (team) {
      info.push(team?.[`${PREFIX}nome`]);
    }

    return info.join(' - ');
  }, []);

  return (
    <>
      {openLoad ? (
        <LoadModel
          open={openLoad}
          onClose={() => setOpenLoad(false)}
          onLoadModel={onLoadModel}
        />
      ) : null}

      <Backdrop open={(loading || isLoading) && !isSaveAsModel}>
        <CircularProgress color='inherit' />
      </Backdrop>

      <DialogTitle style={{ paddingBottom: 0 }}>
        <Box display='flex' justifyContent='space-between' paddingRight='2rem'>
          <Box display='flex' alignItems='center' style={{ gap: '10px' }}>
            <Typography
              variant='h6'
              color='textPrimary'
              style={{ fontWeight: 'bold' }}
            >
              {isGroup ? (
                <>
                  {scheduleSaved?.[`${PREFIX}cronogramadediaid`]
                    ? 'Alterar agrupamento de atividades'
                    : 'Criar agrupamento de atividades'}
                </>
              ) : (
                <>
                  {scheduleSaved?.[`${PREFIX}cronogramadediaid`]
                    ? 'Alterar dia de aula'
                    : 'Criar dia de aula'}
                </>
              )}
            </Typography>

            <HelperTooltip content={scheduleTooltip?.Conteudo} />

            <Tooltip title='Atualizar'>
              <IconButton onClick={handleUpdateData}>
                <Replay />
              </IconButton>
            </Tooltip>
          </Box>

          {canEdit ? (
            <Box display='flex' alignItems='center' style={{ gap: '2rem' }}>
              {scheduleSaved?.[`_${PREFIX}editanto_value`] &&
              scheduleSaved?.[`_${PREFIX}editanto_value`] !==
                currentUser?.[`${PREFIX}pessoaid`] ? (
                <Box>
                  <Typography
                    variant='subtitle2'
                    style={{ fontWeight: 'bold' }}
                  >
                    Outra pessoa está editanto esse{' '}
                    {isGroup ? 'Agrupamento de Atividades' : 'dia de aula'}
                  </Typography>

                  <Typography variant='subtitle2'>
                    {
                      dictPeople?.[
                        scheduleSaved?.[`_${PREFIX}editanto_value`]
                      ]?.[`${PREFIX}nomecompleto`]
                    }{' '}
                    -{' '}
                    {moment(
                      scheduleSaved?.[`${PREFIX}datahoraeditanto`]
                    ).format('DD/MM/YYYY HH:mm:ss')}
                  </Typography>
                </Box>
              ) : null}

              {!scheduleSaved?.[`_${PREFIX}editanto_value`] ||
              scheduleSaved?.[`_${PREFIX}editanto_value`] ===
                currentUser?.[`${PREFIX}pessoaid`] ? (
                <Button
                  variant='contained'
                  color='primary'
                  disabled={!isDetail}
                  onClick={handleEdit}
                >
                  {editLoading ? (
                    <CircularProgress size={25} style={{ color: '#fff' }} />
                  ) : (
                    'Editar'
                  )}
                </Button>
              ) : (
                <Button
                  variant='contained'
                  color='primary'
                  disabled={!isDetail}
                  onClick={handleEdit}
                >
                  {editLoading ? (
                    <CircularProgress size={25} style={{ color: '#fff' }} />
                  ) : (
                    'Liberar'
                  )}
                </Button>
              )}
            </Box>
          ) : null}
        </Box>

        <Box display='flex' justifyContent='space-between' alignItems='center'>
          {!isModel && canEdit && !isDetail ? (
            <Box paddingLeft='8px'>
              <Button
                startIcon={<Publish />}
                color='primary'
                disabled={isDetail}
                onClick={() => setOpenLoad(!openLoad)}
              >
                Carregar {isGroup ? 'agrupamento de atividades' : 'dia de aula'}
              </Button>
            </Box>
          ) : (
            <div />
          )}

          <Typography
            variant='body2'
            style={{ fontWeight: 700, maxWidth: '36rem' }}
          >
            {infoParent}
          </Typography>
        </Box>

        <BoxCloseIcon>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </BoxCloseIcon>
      </DialogTitle>

      <DialogContent>
        <Box maxWidth='50rem'>
          <Accordion elevation={3} style={{ margin: '.5rem' }} defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography color='primary' style={{ fontWeight: 'bold' }}>
                Informações
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <InfoForm
                isDetail={isDetail}
                isGroup={isGroup}
                titleRequired={titleRequired}
                isDraft={isDraft}
                isProgramResponsible={isProgramResponsible}
                isProgramDirector={isProgramDirector}
                isHeadOfService={isHeadOfService}
                schedule={scheduleSaved}
                loadingApproval={loadingApproval}
                handleAproval={handleAproval}
                handleEditApproval={handleEditApproval}
                tagsOptions={tagsOptions}
                setDateReference={setDateReference}
                isModel={isModel}
                isScheduleModel={isScheduleModel}
                teamId={teamId}
                values={formik.values}
                errors={formik.errors}
                setFieldValue={formik.setFieldValue}
                handleChange={formik.handleChange}
              />
            </AccordionDetails>
          </Accordion>

          <Accordion elevation={3} style={{ margin: '.5rem' }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography color='primary' style={{ fontWeight: 'bold' }}>
                Atividades
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ActivitiesForm
                isDetail={isDetail}
                values={formik.values}
                errors={formik.errors}
                tagsOptions={tagsOptions}
                spaceOptions={spaceOptions}
                setFieldValue={formik.setFieldValue}
              />
            </AccordionDetails>
          </Accordion>

          {!isGroup ? (
            <Accordion elevation={3} style={{ margin: '.5rem' }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography color='primary' style={{ fontWeight: 'bold' }}>
                  Pessoas Envolvidas
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <EnvolvedPeopleForm
                  isDetail={isDetail}
                  isDraft={isDraft}
                  values={formik.values}
                  errors={formik.errors}
                  tags={tagsOptions}
                  dictTag={dictTag}
                  currentUser={currentUser}
                  setSchedule={setSchedule}
                  scheduleId={scheduleSaved?.[`${PREFIX}cronogramadediaid`]}
                  persons={peopleOptions}
                  setValues={formik.setValues}
                  updateEnvolvedPerson={updateEnvolvedPerson}
                  setFieldValue={formik.setFieldValue}
                />
              </AccordionDetails>
            </Accordion>
          ) : null}

          {!isGroup && (
            <Accordion elevation={3} style={{ margin: '.5rem' }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography color='primary' style={{ fontWeight: 'bold' }}>
                  Anexos
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Anexos
                  ref={refAnexo}
                  disabled={isDetail}
                  anexos={formik.values.anexos}
                />
              </AccordionDetails>
            </Accordion>
          )}

          {!isGroup ? (
            <Accordion elevation={3} style={{ margin: '.5rem' }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography color='primary' style={{ fontWeight: 'bold' }}>
                  Observação
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormControl fullWidth>
                  <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    disabled={!canEdit || isDetail}
                    inputProps={{ maxLength: 2000 }}
                    type='text'
                    name='observation'
                    onChange={(nextValue) =>
                      formik.setFieldValue(
                        'observation',
                        nextValue.target.value
                      )
                    }
                    value={formik.values.observation}
                  />
                  <FormHelperText>
                    {formik?.values?.observation?.length || 0}/2000
                  </FormHelperText>
                </FormControl>
              </AccordionDetails>
            </Accordion>
          ) : null}
        </Box>
      </DialogContent>

      <Box
        width='100%'
        marginTop='2rem'
        display='flex'
        padding='1rem'
        justifyContent='space-between'
      >
        <Box>
          {/* {!isModel &&
          !isLoadModel &&
          scheduleSaved?.[`${PREFIX}cronogramadediaid`] &&
          !scheduleSaved?.[`_${PREFIX}lancarparaaprovacao_value`] ? (
            <Button
              variant='contained'
              color='secondary'
              onClick={() => handleToApprove()}
            >
              {loadingApproval ? (
                <CircularProgress size={25} style={{ color: '#fff' }} />
              ) : (
                'Lançar para aprovação'
              )}
            </Button>
          ) : null} */}

          {isModel &&
          canEdit &&
          scheduleSaved?.[`${PREFIX}cronogramadediaid`] &&
          !teamId ? (
            <Button
              variant='contained'
              color='secondary'
              onClick={handlePublish}
              startIcon={
                scheduleSaved?.[`${PREFIX}publicado`] ? (
                  <VisibilityOff />
                ) : (
                  <Visibility />
                )
              }
            >
              {publishLoading ? (
                <CircularProgress size={25} style={{ color: '#fff' }} />
              ) : scheduleSaved?.[`${PREFIX}publicado`] ? (
                'Despublicar'
              ) : (
                'Publicar'
              )}
            </Button>
          ) : null}

          {!isModel &&
          !isLoadModel &&
          scheduleSaved?.[`_${PREFIX}lancarparaaprovacao_value`] ? (
            <Box display='flex' alignItems='center' style={{ gap: '10px' }}>
              <CheckCircle fontSize='small' style={{ color: '#35bb5a' }} />
              <Typography
                variant='body2'
                color='primary'
                style={{ fontWeight: 'bold' }}
              >
                Lançado para aprovação
              </Typography>
            </Box>
          ) : null}
        </Box>

        <Box display='flex' style={{ gap: '10px' }}>
          <Button color='primary' onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant='contained'
            color='primary'
            disabled={!canEdit || isDetail}
            onClick={() =>
              !((loading || isLoading) && !isSaveAsModel) && handleSave()
            }
          >
            Salvar
          </Button>
        </Box>
      </Box>

      <Dialog open={errorApproval.open}>
        <DialogTitle>
          <Typography
            variant='subtitle1'
            color='secondary'
            style={{ maxWidth: '25rem', fontWeight: 'bold' }}
          >
            Campos/Funções obrigatórios para lançar para aprovação
            <IconButton
              aria-label='close'
              onClick={() => setErrorApproval({ open: false, msg: null })}
              style={{ position: 'absolute', right: 8, top: 8 }}
            >
              <Close />
            </IconButton>
          </Typography>
        </DialogTitle>
        <DialogContent>{errorApproval.msg}</DialogContent>
      </Dialog>
    </>
  );
};

export default Form;
