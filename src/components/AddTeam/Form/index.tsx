import 'react-quill/dist/quill.snow.css';
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
  Link,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { v4 } from 'uuid';
import * as _ from 'lodash';
import {
  AccessTime,
  CheckCircle,
  Close,
  ExpandMore,
  Replay,
  Visibility,
  VisibilityOff,
} from '@material-ui/icons';
import { useFormik } from 'formik';
import * as React from 'react';
import * as yup from 'yup';
import {
  useConfirmation,
  useContextWebpart,
  useLoggedUser,
  useNotification,
} from '~/hooks';
import InfoForm from './InfoForm';
import FantasyNameForm from './FantasyNameForm';
import EnvolvedPeopleForm from './EnvolvedPeopleForm';
import ParticipantsForm from './ParticipantsForm';
import Schedules from './Schedules';
import { PERSON, PREFIX } from '~/config/database';
import * as moment from 'moment';
import { Anexos, Backdrop } from '~/components';
import { getFiles } from '~/utils/sharepoint';
import { sp } from '@pnp/sp';
import romanize from '~/utils/romanize';
import { EFatherTag, EGroups } from '~/config/enums';
import { BoxCloseIcon } from '../styles';
import { useDispatch, useSelector } from 'react-redux';
import {
  addOrUpdateTeam,
  getTeamById,
  updateTeam,
} from '~/store/modules/team/actions';
import { fetchAllPerson } from '~/store/modules/person/actions';
import { fetchAllTags } from '~/store/modules/tag/actions';
import { fetchAllSpace } from '~/store/modules/space/actions';
import { AppState } from '~/store';
import HelperTooltip from '~/components/HelperTooltip';
import useUndo from '~/hooks/useUndo';
import { executeChangeTemperature } from '~/store/modules/genericActions/actions';
import ScheduleDayForm from '~/components/ScheduleDayForm';
import { getScheduleId } from '~/store/modules/schedule/actions';

interface IForm {
  isModel?: boolean;
  isDraft?: boolean;
  isLoadModel?: boolean;
  isProgramResponsible: boolean;
  isProgramDirector: boolean;
  isFinance: boolean;
  team: any;
  refetch?: any;
  programId: string;
  company: string;
  program: any;
  dictTag: any;
  teams: any[];
  tagsOptions: any[];
  peopleOptions: any[];
  dictPeople: any;
  handleClose: () => void;
  setTeam: (item) => void;
  getActivityByTeamId: (teamId: string) => Promise<any>;
}

const Form: React.FC<IForm> = ({
  team,
  isModel,
  isDraft,
  teams,
  isLoadModel,
  tagsOptions,
  peopleOptions,
  dictTag,
  setTeam,
  program,
  dictPeople,
  programId,
  refetch,
  isProgramResponsible,
  isProgramDirector,
  isFinance,
  getActivityByTeamId,
  handleClose,
}) => {
  const programDirector = tagsOptions.find(
    (e) =>
      !e?.[`${PREFIX}excluido`] &&
      e?.[`${PREFIX}ativo`] &&
      e?.[`${PREFIX}nome`] === EFatherTag.DIRETOR_PROGRAMA
  );

  const academicDirector = tagsOptions.find(
    (e) =>
      !e?.[`${PREFIX}excluido`] &&
      e?.[`${PREFIX}ativo`] &&
      e?.[`${PREFIX}nome`] === EFatherTag.DIRETOR_ACADEMICO
  );

  const coordination = tagsOptions.find(
    (e) =>
      !e?.[`${PREFIX}excluido`] &&
      e?.[`${PREFIX}ativo`] &&
      e?.[`${PREFIX}nome`] === EFatherTag.COORDENACAO_ADMISSOES
  );

  const academicCoordination = tagsOptions.find(
    (e) =>
      !e?.[`${PREFIX}excluido`] &&
      e?.[`${PREFIX}ativo`] &&
      e?.[`${PREFIX}nome`] === EFatherTag.COORDENACAO_ACADEMICA
  );

  const DEFAULT_VALUES = React.useMemo(() => {
    if (!tagsOptions?.length) return {};

    const planning = tagsOptions.find(
      (e) =>
        !e?.[`${PREFIX}excluido`] &&
        e?.[`${PREFIX}ativo`] &&
        e?.[`${PREFIX}nome`] === EFatherTag.PLANEJAMENTO
    );

    const materialProducer = tagsOptions.find(
      (e) =>
        !e?.[`${PREFIX}excluido`] &&
        e?.[`${PREFIX}ativo`] &&
        e?.[`${PREFIX}nome`] === EFatherTag.PRODUTOR_MATERIAIS
    );

    return {
      name: '',
      title: '',
      teamCode: '',
      sigla: '',
      teamName: '',
      mask: '',
      maskBackup: '',
      modality: null,
      temperature: null,
      videoConference: null,
      videoConferenceBackup: null,
      nameEdited: false,
      yearConclusion: '',
      description: '',
      anexos: [],
      schedules: [],
      concurrentActivity: false,
      model: isModel,
      names: [{ keyId: v4(), name: '', nameEn: '', nameEs: '', use: '' }],
      people: [
        {
          keyId: v4(),
          person: null,
          isRequired: true,
          function: { ...programDirector },
        },
        {
          keyId: v4(),
          person: null,
          isRequired: true,
          function: { ...academicDirector },
        },
        {
          keyId: v4(),
          person: null,
          isRequired: true,
          function: { ...coordination },
        },
        {
          keyId: v4(),
          person: null,
          isRequired: true,
          function: { ...academicCoordination },
        },
        {
          keyId: v4(),
          person: null,
          isRequired: true,
          function: { ...planning },
        },
        {
          keyId: v4(),
          person: null,
          isRequired: true,
          function: { ...materialProducer },
        },
      ],
      participants: [{ keyId: v4(), date: null, quantity: null, use: '' }],
    };
  }, [tagsOptions]);

  const [initialValues, setInitialValues] = React.useState(DEFAULT_VALUES);
  const [isDetail, setIsDetail] = React.useState(!isLoadModel && team);
  const [publishLoading, setPublishLoading] = React.useState(false);
  const [loadingApproval, setLoadingApproval] = React.useState<any>({});
  const [editLoading, setEditLoading] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [valuesSetted, setValuesSetted] = React.useState(false);
  const [openSchedule, setOpenSchedule] = React.useState(false);
  const [scheduleChoosed, setScheduleChoosed] = React.useState<any>();
  const [pastValues, setPastValues] = React.useState<any>(DEFAULT_VALUES);
  const [errorApproval, setErrorApproval] = React.useState<{
    open: boolean;
    title: string;
    msg: React.ReactNode;
  }>({
    title: 'Campos/Funções obrigatórios para lançar para aprovação',
    open: false,
    msg: null,
  });

  const { notification } = useNotification();
  const { confirmation } = useConfirmation();
  const { undo } = useUndo();
  const refAnexo = React.useRef<any>();
  const updateTemperature = React.useRef(false);

  const validationSchema = yup.object({
    sigla: yup.string().required('Campo Obrigatório'),
    temperature: yup.mixed().required('Campo Obrigatório'),
    modality: yup.mixed().required('Campo Obrigatório'),
    yearConclusion: yup
      .mixed()
      .required('Campo Obrigatório')
      .test({
        test: (value) => {
          return !value || (value >= 2000 && value <= 9999);
        },
        message: 'Informe um ano válido',
        name: 'ValidYear',
      })
      .test({
        test: (value) => {
          return !value || value >= moment().year();
        },
        message: `Informe um ano maior ou igual a ${moment().year()}`,
        name: 'ValidY',
      }),
  });

  const validationSchemaModel = yup.object({
    title: yup.string().required('Campo Obrigatório'),
  });

  const validationSchemaInternEvent = yup.object({
    sigla: yup.string().required('Campo Obrigatório'),
  });

  const { app } = useSelector((state: AppState) => state);
  const { context } = useContextWebpart();
  const { tooltips } = app;

  const { currentUser } = useLoggedUser();
  const dispatch = useDispatch();

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
    if (team && dictTag && dictPeople && !valuesSetted) {
      const iniVal = {
        id: team?.[`${PREFIX}turmaid`],
        title: team[`${PREFIX}titulo`] || '',
        baseadoemmodeloturma: team?.baseadoemmodeloturma,
        modeloid: team?.modeloid,
        sigla: team[`${PREFIX}sigla`] || '',
        name: team[`${PREFIX}nome`] || '',
        model: team[`${PREFIX}modelo`],
        nameEdited: false,
        teamCode: team[`${PREFIX}codigodaturma`] || '',
        teamName: team[`${PREFIX}nomefinanceiro`] || '',
        mask: team[`${PREFIX}mascara`] || '',
        maskBackup: team[`${PREFIX}mascarabackup`] || '',
        yearConclusion: team[`${PREFIX}anodeconclusao`] || '',
        description: team[`${PREFIX}observacao`] || '',
        concurrentActivity: team[`${PREFIX}atividadeconcorrente`],
        modality:
          dictTag?.[team?.[`${PREFIX}Modalidade`]?.[`${PREFIX}etiquetaid`]] ||
          null,
        temperature:
          dictTag?.[team?.[`${PREFIX}Temperatura`]?.[`${PREFIX}etiquetaid`]] ||
          null,
        videoConferenceBackup:
          dictTag?.[
            team?.[`_${PREFIX}ferramentavideoconferenciabackup_value`]
          ] || null,
        videoConference:
          dictTag?.[team?.[`_${PREFIX}ferramentavideoconferencia_value`]] ||
          null,
        anexos: [],
        schedules: team.schedules || [],
        names: team[`${PREFIX}Turma_NomeTurma`]?.length
          ? team[`${PREFIX}Turma_NomeTurma`]?.map((e) => ({
              keyId: v4(),
              id: e[`${PREFIX}nometurmaid`],
              name: e?.[`${PREFIX}nome`],
              nameEn: e?.[`${PREFIX}nomeen`],
              nameEs: e?.[`${PREFIX}nomees`],
              use: dictTag?.[e?.[`_${PREFIX}uso_value`]],
            }))
          : [
              {
                name: '',
                nameEn: '',
                nameEs: '',
                use: '',
              },
            ],
        participants: team[`${PREFIX}Turma_ParticipantesTurma`]?.length
          ? team[`${PREFIX}Turma_ParticipantesTurma`]?.map((e) => ({
              keyId: v4(),
              id: e[`${PREFIX}participantesturmaid`],
              date: e?.[`${PREFIX}data`] && moment.utc(e?.[`${PREFIX}data`]),
              quantity: e?.[`${PREFIX}quantidade`],
              use: dictTag?.[e?.[`_${PREFIX}uso_value`]],
            }))
          : [
              {
                date: null,
                quantity: '',
                use: '',
              },
            ],
        people: [],
      };

      const peopleSaved = team[`${PREFIX}Turma_PessoasEnvolvidasTurma`]?.map(
        (e) => {
          let func = e?.[`_${PREFIX}funcao_value`]
            ? _.cloneDeep(dictTag[e?.[`_${PREFIX}funcao_value`]])
            : {};

          if (!func) {
            func = {};
          }
          func.needApprove = func?.[`${PREFIX}Etiqueta_Pai`]?.some(
            (e) => e?.[`${PREFIX}nome`] === EFatherTag.NECESSITA_APROVACAO
          );

          return {
            ...e,
            keyId: v4(),
            isRequired: e?.[`${PREFIX}obrigatorio`],
            id: e[`${PREFIX}pessoasenvolvidasturmaid`],
            person: dictPeople[e?.[`_${PREFIX}pessoa_value`]],
            function: func,
          };
        }
      );

      if (
        !peopleSaved?.some(
          (peo) =>
            peo.function?.[`${PREFIX}nome`] === EFatherTag.DIRETOR_PROGRAMA
        )
      ) {
        const func = tagsOptions.find(
          (e) => e?.[`${PREFIX}nome`] === EFatherTag.DIRETOR_PROGRAMA
        );

        peopleSaved.push({
          keyId: v4(),
          isRequired: true,
          function: func,
        });
      }

      if (
        !peopleSaved?.some(
          (peo) =>
            peo.function?.[`${PREFIX}nome`] === EFatherTag.DIRETOR_ACADEMICO
        )
      ) {
        const func = tagsOptions.find(
          (e) => e?.[`${PREFIX}nome`] === EFatherTag.DIRETOR_ACADEMICO
        );

        peopleSaved.push({
          keyId: v4(),
          isRequired: true,
          function: func,
        });
      }

      if (
        !peopleSaved?.some(
          (peo) =>
            peo.function?.[`${PREFIX}nome`] === EFatherTag.COORDENACAO_ADMISSOES
        )
      ) {
        const func = tagsOptions.find(
          (e) => e?.[`${PREFIX}nome`] === EFatherTag.COORDENACAO_ADMISSOES
        );

        peopleSaved.push({
          keyId: v4(),
          isRequired: true,
          function: func,
        });
      }

      if (
        !peopleSaved?.some(
          (peo) =>
            peo.function?.[`${PREFIX}nome`] === EFatherTag.COORDENACAO_ACADEMICA
        )
      ) {
        const func = tagsOptions.find(
          (e) => e?.[`${PREFIX}nome`] === EFatherTag.COORDENACAO_ACADEMICA
        );

        peopleSaved.push({
          keyId: v4(),
          isRequired: true,
          function: func,
        });
      }

      if (
        !peopleSaved?.some(
          (peo) => peo.function?.[`${PREFIX}nome`] === EFatherTag.PLANEJAMENTO
        )
      ) {
        const func = tagsOptions.find(
          (e) => e?.[`${PREFIX}nome`] === EFatherTag.PLANEJAMENTO
        );

        peopleSaved.push({
          keyId: v4(),
          isRequired: true,
          function: func,
        });
      }

      if (
        !peopleSaved?.some(
          (peo) =>
            peo.function?.[`${PREFIX}nome`] === EFatherTag.PRODUTOR_MATERIAIS
        )
      ) {
        const func = tagsOptions.find(
          (e) => e?.[`${PREFIX}nome`] === EFatherTag.PRODUTOR_MATERIAIS
        );

        peopleSaved.push({
          keyId: v4(),
          isRequired: true,
          function: func,
        });
      }

      iniVal.people = peopleSaved?.sort(
        (a, b) => a?.[`${PREFIX}ordem`] - b?.[`${PREFIX}ordem`]
      );
      setInitialValues(iniVal);
      setPastValues(iniVal);
      setValuesSetted(true);

      getFiles(
        sp,
        `Anexos Interno/Turma/${moment(team?.createdon).format('YYYY')}/${
          team?.[`${PREFIX}turmaid`]
        }`
      ).then((files) => {
        formik.setFieldValue('anexos', files);
        setPastValues({ ...iniVal, anexos: files });
      });
    }
  }, [team, dictTag, dictPeople]);

  const handleUndo = (newTeam) => {
    setValuesSetted(false);
    const teamUndo = JSON.parse(localStorage.getItem('undoTeam'));
    const peopleToDelete = [];
    const namesToDelete = [];
    const participantsToDelete = [];

    newTeam?.[`${PREFIX}Turma_PessoasEnvolvidasTurma`]?.forEach((e) => {
      const envolvedSaved = teamUndo?.people?.find(
        (sp) => sp?.id === e?.[`${PREFIX}pessoasenvolvidasturmaid`]
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
          id: e[`${PREFIX}pessoasenvolvidasturmaid`],
          person: dictPeople[e?.[`_${PREFIX}pessoa_value`]],
          function: func,
        });
      }
    });

    teamUndo?.people?.forEach((e) => {
      const envolvedSaved = newTeam?.[
        `${PREFIX}Turma_PessoasEnvolvidasTurma`
      ]?.find((sp) => e?.id === sp?.[`${PREFIX}pessoasenvolvidasturmaid`]);

      if (!envolvedSaved) {
        peopleToDelete.push({
          ...e,
          id: null,
        });
      }
    });

    newTeam?.[`${PREFIX}Turma_NomeTurma`]?.forEach((e) => {
      const nameSaved = teamUndo?.names?.find(
        (sp) => sp?.id === e?.[`${PREFIX}nometurmaid`]
      );

      if (nameSaved) {
        namesToDelete.push(nameSaved);
      } else {
        namesToDelete.push({
          keyId: v4(),
          deleted: true,
          id: e[`${PREFIX}nometurmaid`],
          name: e?.[`${PREFIX}nome`],
          nameEn: e?.[`${PREFIX}nomeen`],
          nameEs: e?.[`${PREFIX}nomees`],
          use: dictTag?.[e?.[`_${PREFIX}uso_value`]],
        });
      }
    });

    teamUndo?.names?.forEach((e) => {
      const nameSaved = newTeam?.[`${PREFIX}Turma_NomeTurma`]?.find(
        (sp) => e?.id === sp?.[`${PREFIX}nometurmaid`]
      );

      if (!nameSaved) {
        namesToDelete.push({
          ...e,
          id: null,
        });
      }
    });

    newTeam?.[`${PREFIX}Turma_ParticipantesTurma`]?.forEach((e) => {
      const participantSaved = teamUndo?.participants?.find(
        (sp) => sp?.id === e?.[`${PREFIX}participantesturmaid`]
      );

      if (participantSaved) {
        participantsToDelete.push(participantSaved);
      } else {
        participantsToDelete.push({
          keyId: v4(),
          deleted: true,
          id: e[`${PREFIX}participantesturmaid`],
          date: e?.[`${PREFIX}data`] && moment.utc(e?.[`${PREFIX}data`]),
          quantity: e?.[`${PREFIX}quantidade`],
          use: dictTag?.[e?.[`_${PREFIX}uso_value`]],
        });
      }
    });

    teamUndo?.participants?.forEach((e) => {
      const participantSaved = newTeam?.[
        `${PREFIX}Turma_ParticipantesTurma`
      ]?.find((sp) => e?.id === sp?.[`${PREFIX}participantesturmaid`]);

      if (!participantSaved) {
        participantsToDelete.push({
          ...e,
          id: null,
        });
      }
    });

    dispatch(
      addOrUpdateTeam(
        {
          ...teamUndo,
          participants: participantsToDelete,
          people: peopleToDelete,
          names: namesToDelete,
        },
        programId,
        {
          onSuccess: (te) => {
            refetch?.();
            setTeam(te);
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

  const onClose = () => {
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
        onCancel: () => {
          handleResetEditing();
        },
      });
    } else {
      handleResetEditing();
    }
  };

  const handleSuccess = (newTeam) => {
    setLoading(false);

    if (updateTemperature.current) {
      dispatch(
        executeChangeTemperature(
          {
            origin: 'Turma',
            idOrigin: team?.[`${PREFIX}turmaid`],
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

    notification.success({
      title: 'Sucesso',
      description: 'Cadastro realizado com sucesso',
    });

    setTeam?.(newTeam);
    if (pastValues?.id || pastValues?.[`${PREFIX}turmaid`]) {
      undo.open('Deseja desfazer a ação?', () => handleUndo(newTeam));
    }

    // @ts-ignore
    if (formik.values.close) {
      setInitialValues(DEFAULT_VALUES);
      formik.resetForm();
      handleClose();
      setValuesSetted(false);
    }
  };

  const handleError = (error, newTeam) => {
    setLoading(false);

    if (newTeam) {
      setTeam(newTeam);
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

  const handleSaveSubmit = (body, forceCreate) => {
    setValuesSetted(false);
    updateTemperature.current = forceCreate;

    dispatch(
      addOrUpdateTeam(
        body,
        programId,
        {
          onSuccess: handleSuccess,
          onError: handleError,
        },
        forceCreate
      )
    );
  };

  const schemaToValidate = () => {
    if (program?.[`${PREFIX}ehreserva`]) {
      return validationSchemaInternEvent;
    }

    if (isModel) {
      return validationSchemaModel;
    }

    return validationSchema;
  };

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnMount: false,
    validateOnChange: false,
    validationSchema: schemaToValidate(),
    onSubmit: (values) => {
      if (!isModel && !program?.[`${PREFIX}ehreserva`]) {
        const functionsRequired = {
          programDirector: false,
          academicDirector: false,
          materialProducer: false,
          admissionCoordinator: false,
        };

        values.people.forEach((envolved: any) => {
          if (
            envolved.function?.[`${PREFIX}nome`] ===
              EFatherTag.DIRETOR_PROGRAMA &&
            envolved.person &&
            !envolved?.deleted
          ) {
            functionsRequired.programDirector = true;
          }

          if (
            envolved.function?.[`${PREFIX}nome`] ===
              EFatherTag.DIRETOR_ACADEMICO &&
            envolved.person &&
            !envolved?.deleted
          ) {
            functionsRequired.academicDirector = true;
          }

          if (
            envolved.function?.[`${PREFIX}nome`] ===
              EFatherTag.PRODUTOR_MATERIAIS &&
            envolved.person &&
            !envolved?.deleted
          ) {
            functionsRequired.materialProducer = true;
          }

          if (
            envolved.function?.[`${PREFIX}nome`] ===
              EFatherTag.COORDENACAO_ADMISSOES &&
            envolved.person &&
            !envolved?.deleted
          ) {
            functionsRequired.admissionCoordinator = true;
          }
        });

        if (
          Object.keys(functionsRequired).some((key) => !functionsRequired[key])
        ) {
          setLoadingApproval(false);

          setErrorApproval({
            open: true,
            title:
              'Existem campos obrigatórios por preencher. A criação de tarefas requer o preenchimento obrigatório de determinadas funções relacionadas com o squad. Favor verificar os campos relacionados com as funções obrigatórios.',
            msg: (
              <div>
                <Typography>
                  Falta informar as pessoas para seguintes funções:
                </Typography>
                <ul>
                  {!functionsRequired.programDirector && (
                    <li>
                      <strong>{EFatherTag.DIRETOR_PROGRAMA}</strong>
                    </li>
                  )}
                  {!functionsRequired.academicDirector && (
                    <li>
                      <strong>{EFatherTag.DIRETOR_ACADEMICO}</strong>
                    </li>
                  )}
                  {!functionsRequired.admissionCoordinator && (
                    <li>
                      <strong>{EFatherTag.COORDENACAO_ADMISSOES}</strong>
                    </li>
                  )}
                  {!functionsRequired.materialProducer && (
                    <li>
                      <strong>{EFatherTag.PRODUTOR_MATERIAIS}</strong>
                    </li>
                  )}
                </ul>
              </div>
            ),
          });

          return;
        }
      }

      setLoading(true);
      localStorage.setItem('undoTeam', JSON.stringify(pastValues));

      try {
        const files = refAnexo?.current?.getAnexos();
        let name = team?.[`${PREFIX}nome`];
        let teamPosition = team?.[`${PREFIX}posicao`];

        if (!values.nameEdited) {
          if (
            !teamPosition ||
            +values.yearConclusion !== +pastValues.yearConclusion ||
            values.sigla !== pastValues.sigla
          ) {
            const teamsSame = teams?.filter(
              (te) =>
                te?.[`${PREFIX}sigla`] === values.sigla &&
                te?.[`${PREFIX}anodeconclusao`] === +values.yearConclusion &&
                (!team?.[`${PREFIX}turmaid`] ||
                  te?.[`${PREFIX}turmaid`] !== team?.[`${PREFIX}turmaid`])
            );

            const maxTeam = teamsSame.reduce((max, actual) => {
              return actual?.[`${PREFIX}posicao`] > max.numero ? actual : max;
            }, teamsSame[0]);

            teamPosition = (maxTeam?.[`${PREFIX}posicao`] || 0) + 1;
          }

          name = !isModel
            ? `${values.sigla?.trim()} ${romanize(teamPosition || 1)} ${
                values.yearConclusion
              }`
            : '';
        } else {
          name = values.name;
        }

        setValuesSetted(false);

        let deleteTask = false;
        if (
          pastValues.temperature?.[`${PREFIX}nome`] === EFatherTag.CONTRATADO &&
          pastValues.temperature?.[`${PREFIX}nome`] !==
            values.temperature?.[`${PREFIX}nome`]
        ) {
          deleteTask = true;
        }

        let temp = values.temperature;

        if (!temp && team?.[`${PREFIX}Temperatura`]) {
          temp =
            dictTag?.[team?.[`${PREFIX}Temperatura`]?.[`${PREFIX}etiquetaid`]];
        }

        if (!temp && program?.[`${PREFIX}Temperatura`]) {
          temp =
            dictTag?.[
              program?.[`${PREFIX}Temperatura`]?.[`${PREFIX}etiquetaid`]
            ];
        }

        if (
          !isModel &&
          team?.[`${PREFIX}turmaid`] &&
          team?.[`${PREFIX}CronogramadeDia_Turma`].length &&
          team?.[`${PREFIX}Temperatura`]?.[`${PREFIX}etiquetaid`] !==
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
                  ...values,
                  deleteTask,
                  teamPosition,
                  group: myGroup(),
                  isLoadModel,
                  name,
                  temperature: temp,
                  programId: program?.[`${PREFIX}programid`],
                  programName:
                    program?.[`${PREFIX}NomePrograma`]?.[`${PREFIX}nome`],
                  id: team?.[`${PREFIX}turmaid`],
                  user: currentUser?.[`${PREFIX}pessoaid`],
                  anexos: files,
                  previousPeople:
                    team?.[`${PREFIX}Turma_PessoasEnvolvidasTurma`] || [],
                  previousNames: team?.[`${PREFIX}Turma_NomeTurma`] || [],
                  previousPaticipants:
                    team?.[`${PREFIX}Turma_ParticipantesTurma`] || [],
                },
                true
              );
            },
            onCancel: () => {
              handleSaveSubmit(
                {
                  ...values,
                  deleteTask,
                  teamPosition,
                  group: myGroup(),
                  isLoadModel,
                  name,
                  temperature: temp,
                  programId: program?.[`${PREFIX}programid`],
                  programName:
                    program?.[`${PREFIX}NomePrograma`]?.[`${PREFIX}nome`],
                  id: team?.[`${PREFIX}turmaid`],
                  user: currentUser?.[`${PREFIX}pessoaid`],
                  anexos: files,
                  previousPeople:
                    team?.[`${PREFIX}Turma_PessoasEnvolvidasTurma`] || [],
                  previousNames: team?.[`${PREFIX}Turma_NomeTurma`] || [],
                  previousPaticipants:
                    team?.[`${PREFIX}Turma_ParticipantesTurma`] || [],
                },
                false
              );
            },
          });
        } else {
          handleSaveSubmit(
            {
              ...values,
              deleteTask,
              teamPosition,
              group: myGroup(),
              isLoadModel,
              name,
              temperature: temp,
              programId: program?.[`${PREFIX}programid`],
              programName:
                program?.[`${PREFIX}NomePrograma`]?.[`${PREFIX}nome`],
              id: team?.[`${PREFIX}turmaid`],
              user: currentUser?.[`${PREFIX}pessoaid`],
              anexos: files,
              previousPeople:
                team?.[`${PREFIX}Turma_PessoasEnvolvidasTurma`] || [],
              previousNames: team?.[`${PREFIX}Turma_NomeTurma`] || [],
              previousPaticipants:
                team?.[`${PREFIX}Turma_ParticipantesTurma`] || [],
            },
            false
          );
        }
      } catch (err) {
        console.error(err);
        setLoading(false);

        notification.error({
          title: 'Falha',
          description: 'Ocorreu um erro, Tente novamente mais tarde',
        });
      }
    },
  });

  console.log(formik.errors);

  const handleSave = () => {
    formik.handleSubmit();
  };

  const removeDaySchedule = (id) => {
    const listSchedule = _.cloneDeep(formik?.values?.schedules);
    const indexSchedule = listSchedule.findIndex((e) => e?.keyid === id);
    const newSchedule = [...listSchedule];
    newSchedule.splice(indexSchedule, 1);

    formik.setFieldValue('schedules', newSchedule);
  };

  React.useEffect(() => {
    if (formik.errors?.participants) {
      notification.error({
        title: 'Falha',
        description:
          'Por favor, verifique que todos os campos obrigatórios estão preenchidos e de forma correta.',
      });
    }
  }, [formik.errors]);

  const handleToApprove = () => {
    setLoadingApproval(true);

    const functionsRequired = {
      programDirector: false,
      academicDirector: false,
      coordination: false,
      academicCoordination: false,
      planning: false,
      materialProducer: false,
    };

    formik.values.people.forEach((envolved) => {
      if (
        envolved.function?.[`${PREFIX}nome`] === EFatherTag.DIRETOR_PROGRAMA &&
        envolved.person
      ) {
        functionsRequired.programDirector = true;
      }
      if (
        envolved.function?.[`${PREFIX}nome`] === EFatherTag.DIRETOR_ACADEMICO &&
        envolved.person
      ) {
        functionsRequired.academicDirector = true;
      }
      if (
        envolved.function?.[`${PREFIX}nome`] ===
          EFatherTag.COORDENACAO_ADMISSOES &&
        envolved.person
      ) {
        functionsRequired.coordination = true;
      }
      if (
        envolved.function?.[`${PREFIX}nome`] ===
          EFatherTag.COORDENACAO_ACADEMICA &&
        envolved.person
      ) {
        functionsRequired.academicCoordination = true;
      }
      if (
        envolved.function?.[`${PREFIX}nome`] === EFatherTag.PLANEJAMENTO &&
        envolved.person
      ) {
        functionsRequired.planning = true;
      }
      if (
        envolved.function?.[`${PREFIX}nome`] ===
          EFatherTag.PRODUTOR_MATERIAIS &&
        envolved.person
      ) {
        functionsRequired.materialProducer = true;
      }
    });

    if (Object.keys(functionsRequired).some((key) => !functionsRequired[key])) {
      setLoadingApproval(false);

      setErrorApproval({
        open: true,
        title: 'Campos/Funções obrigatórios para lançar para aprovação',
        msg: (
          <div>
            <Typography>Falta informar as seguintes funções:</Typography>
            <ul>
              {!functionsRequired.programDirector && (
                <li>
                  <strong>{EFatherTag.DIRETOR_PROGRAMA}</strong>
                </li>
              )}
              {!functionsRequired.academicDirector && (
                <li>
                  <strong>{EFatherTag.DIRETOR_ACADEMICO}</strong>
                </li>
              )}
              {!functionsRequired.coordination && (
                <li>
                  <strong>{EFatherTag.COORDENACAO_ADMISSOES}</strong>
                </li>
              )}
              {!functionsRequired.academicCoordination && (
                <li>
                  <strong>{EFatherTag.COORDENACAO_ACADEMICA}</strong>
                </li>
              )}
              {!functionsRequired.planning && (
                <li>
                  <strong>{EFatherTag.PLANEJAMENTO}</strong>
                </li>
              )}
              {!functionsRequired.materialProducer && (
                <li>
                  <strong>{EFatherTag.PRODUTOR_MATERIAIS}</strong>
                </li>
              )}
            </ul>
          </div>
        ),
      });

      return;
    }

    updateTeam(
      team?.[`${PREFIX}turmaid`],
      {
        [`${PREFIX}LancarparaAprovacao@odata.bind`]: `/${PERSON}(${
          currentUser?.[`${PREFIX}pessoaid`]
        })`,
      },
      {
        onSuccess: (it) => {
          setTeam(it);
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
    updateTeam(
      team[`${PREFIX}turmaid`],
      {
        [`${PREFIX}${nameField}@odata.bind`]: `/${PERSON}(${
          currentUser?.[`${PREFIX}pessoaid`]
        })`,
        [`${PREFIX}${dateField}`]: moment().format(),
      },
      {
        onSuccess: (te) => {
          setLoadingApproval({});
          setTeam(te);
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
    updateTeam(
      team[`${PREFIX}turmaid`],
      {
        [`${PREFIX}${nameField}@odata.bind`]: null,
        [`${PREFIX}${dateField}`]: null,
      },
      {
        onSuccess: (te) => {
          setLoadingApproval({});
          setTeam(te);
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

    updateTeam(
      team[`${PREFIX}turmaid`],
      {
        [`${PREFIX}publicado`]: !team?.[`${PREFIX}publicado`],
      },
      {
        onSuccess: (it) => {
          setTeam(it);
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

    updateTeam(
      team?.[`${PREFIX}turmaid`],
      {
        [`${PREFIX}Editanto@odata.bind`]: `/${PERSON}(${
          currentUser?.[`${PREFIX}pessoaid`]
        })`,
        [`${PREFIX}datahoraeditanto`]: moment().format(),
      },
      {
        onSuccess: (act) => {
          setTeam(act);
          setEditLoading(false);
          setIsDetail(false);
        },
        onError: () => {},
      }
    );
  };

  const handleResetEditing = async () => {
    if (
      team?.[`_${PREFIX}editanto_value`] !== currentUser?.[`${PREFIX}pessoaid`]
    ) {
      setInitialValues(DEFAULT_VALUES);
      formik.resetForm();
      handleClose();
      setValuesSetted(false);
      setIsDetail(false);
      return;
    }
    setEditLoading(true);
    await updateTeam(
      team?.[`${PREFIX}turmaid`],
      {
        [`${PREFIX}Editanto@odata.bind`]: null,
        [`${PREFIX}datahoraeditanto`]: null,
      },
      {
        onSuccess: (act) => {
          setInitialValues(DEFAULT_VALUES);
          formik.resetForm();
          handleClose();
          setValuesSetted(false);
          setIsDetail(false);
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

  const refreshTeam = () => {
    setValuesSetted(false);
    setLoading(true);
    getTeamById(team?.[`${PREFIX}turmaid`])
      .then(({ value }) => {
        setLoading(false);
        setTeam(value[0]);
      })
      .catch(() => {
        notification.error({
          title: 'Falha',
          description: 'Houve um erro interno!',
        });
        setLoading(false);
      });
  };

  const handleSchedule = (sche) => {
    getScheduleId(sche?.[`${PREFIX}cronogramadediaid`]).then(({ value }) => {
      setScheduleChoosed(value[0]);
      setOpenSchedule(true);
    });
  };

  const handleCloseSchedule = () => {
    setScheduleChoosed(null);
    setOpenSchedule(false);
    refreshTeam();
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
        team?.[`${PREFIX}Turma_Compartilhamento`]?.some(
          (comp) =>
            comp?.[`${PREFIX}etiquetaid`] === cUser?.[`${PREFIX}etiquetaid`]
        )
      ) ||
      currentUser?.[`${PREFIX}pessoaid`] === team?.[`_${PREFIX}criadopor_value`]
    );
  }, [currentUser]);

  const isHeadOfService = React.useMemo(() => {
    if (dictPeople && dictTag) {
      return program?.[`${PREFIX}Programa_PessoasEnvolvidas`].some((envol) => {
        const func = dictTag?.[envol?.[`_${PREFIX}funcao_value`]];
        const envolPerson = dictPeople?.[envol?.[`_${PREFIX}pessoa_value`]];

        if (func?.[`${PREFIX}nome`] === EFatherTag.FINANCEIRO) {
          return (
            currentUser?.[`${PREFIX}pessoaid`] ===
            envolPerson?.[`${PREFIX}pessoaid`]
          );
        }

        return false;
      });
    }
  }, [currentUser, program, dictPeople]);

  const teamTooltip = tooltips.find((tooltip) => tooltip?.Title === 'Turma');

  const infoParent = React.useMemo(() => {
    const info = [];

    if (program) {
      info.push(program?.[`${PREFIX}NomePrograma`]?.[`${PREFIX}nome`]);
    }

    return info.join(' - ');
  }, []);

  return (
    <>
      <BoxCloseIcon>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </BoxCloseIcon>

      <Backdrop open={loading}>
        <CircularProgress color='inherit' />
      </Backdrop>

      <ScheduleDayForm
        visible={openSchedule}
        context={context}
        titleRequired={isModel}
        isDraft={
          (scheduleChoosed?.[`${PREFIX}Temperatura`]?.[`${PREFIX}nome`] ||
            team?.[`${PREFIX}Temperatura`]?.[`${PREFIX}nome`] ||
            program?.[`${PREFIX}Temperatura`]?.[`${PREFIX}nome`]) ===
          EFatherTag.RASCUNHO
        }
        isProgramResponsible={isProgramResponsible}
        isProgramDirector={isProgramDirector}
        isHeadOfService={isHeadOfService}
        schedule={scheduleChoosed}
        program={program}
        team={team}
        setSchedule={setScheduleChoosed}
        teamId={team?.[`${PREFIX}turmaid`]}
        programId={team?.[`_${PREFIX}programa_value`]}
        handleClose={handleCloseSchedule}
      />

      <Box
        display='flex'
        height='100%'
        flexDirection='column'
        padding='2rem'
        minWidth='30rem'
      >
        <Box
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          paddingRight='2rem'
        >
          <Box display='flex' alignItems='center' style={{ gap: '10px' }}>
            <Typography
              variant='h6'
              color='textPrimary'
              style={{ fontWeight: 'bold' }}
            >
              {team?.[`${PREFIX}turmaid`] ? 'Alterar turma' : 'Cadastrar turma'}
            </Typography>

            <HelperTooltip content={teamTooltip?.Conteudo} />

            <Tooltip title='Atualizar'>
              <IconButton onClick={handleUpdateData}>
                <Replay />
              </IconButton>
            </Tooltip>
          </Box>

          {canEdit ? (
            <Box display='flex' alignItems='center' style={{ gap: '2rem' }}>
              {team?.[`_${PREFIX}editanto_value`] &&
              team?.[`_${PREFIX}editanto_value`] !==
                currentUser?.[`${PREFIX}pessoaid`] ? (
                <Box>
                  <Typography
                    variant='subtitle2'
                    style={{ fontWeight: 'bold' }}
                  >
                    Outra pessoa está editanto essa turma
                  </Typography>

                  <Typography variant='subtitle2'>
                    {
                      dictPeople?.[team?.[`_${PREFIX}editanto_value`]]?.[
                        `${PREFIX}nomecompleto`
                      ]
                    }{' '}
                    -{' '}
                    {moment(team?.[`${PREFIX}datahoraeditanto`]).format(
                      'DD/MM/YYYY HH:mm:ss'
                    )}
                  </Typography>
                </Box>
              ) : null}

              {!team?.[`_${PREFIX}editanto_value`] ||
              team?.[`_${PREFIX}editanto_value`] ===
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

        <Box
          display='flex'
          width='100%'
          justifyContent='flex-end'
          alignItems='center'
        >
          <Typography
            variant='body2'
            style={{ fontWeight: 700, maxWidth: '36rem' }}
          >
            {infoParent}
          </Typography>
        </Box>

        <Box
          flex='1 0 auto'
          overflow='auto'
          maxHeight='calc(100vh - 12rem)'
          maxWidth='50rem'
        >
          <Accordion elevation={3} style={{ margin: '.5rem' }} defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography color='primary' style={{ fontWeight: 'bold' }}>
                Informações
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <InfoForm
                isDetail={isDetail}
                isModel={isModel}
                isDraft={isDraft}
                tags={tagsOptions}
                team={team}
                isProgramResponsible={isProgramResponsible}
                isProgramDirector={isProgramDirector}
                isFinance={isFinance}
                loadingApproval={loadingApproval}
                handleAproval={handleAproval}
                handleEditApproval={handleEditApproval}
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
                Nome Fantasia
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box
                display='flex'
                flexDirection='column'
                width='100%'
                style={{ gap: '10px' }}
              >
                {team?.[`_${PREFIX}aprovacaonomefantasia_value`] && (
                  <Box
                    display='flex'
                    justifyContent='space-between'
                    width='40%'
                  >
                    <Box
                      display='flex'
                      alignItems='center'
                      style={{ gap: '10px' }}
                    >
                      <CheckCircle
                        fontSize='small'
                        style={{ color: '#35bb5a' }}
                      />
                      <Typography
                        variant='body2'
                        color='primary'
                        style={{ fontWeight: 'bold' }}
                      >
                        Aprovado
                      </Typography>
                    </Box>
                    <Box>
                      {(isProgramDirector || isProgramResponsible) && (
                        <>
                          {loadingApproval?.AprovacaoNomeFantasia ? (
                            <CircularProgress size={15} />
                          ) : !isDetail && !isDraft ? (
                            <Link
                              variant='body2'
                              onClick={() =>
                                handleEditApproval(
                                  'AprovacaoNomeFantasia',
                                  'dataaprovacaonomefantasia'
                                )
                              }
                              style={{ fontWeight: 'bold', cursor: 'pointer' }}
                            >
                              Editar
                            </Link>
                          ) : null}
                        </>
                      )}
                    </Box>
                  </Box>
                )}
                <Box display='flex' justifyContent='space-between' width='40%'>
                  <Box
                    display='flex'
                    alignItems='center'
                    style={{ gap: '10px' }}
                  >
                    {!team?.[`_${PREFIX}aprovacaonomefantasia_value`] &&
                      !isModel &&
                      !isDraft && (
                        <>
                          <AccessTime fontSize='small' />
                          <Typography
                            variant='body2'
                            style={{ fontWeight: 'bold' }}
                          >
                            Pendente Aprovação
                          </Typography>
                        </>
                      )}
                  </Box>
                  {(isProgramDirector || isProgramResponsible) &&
                  !team?.[`_${PREFIX}aprovacaonomefantasia_value`] ? (
                    <Box display='flex' justifyContent='flex-end'>
                      {loadingApproval?.AprovacaoNomeFantasia ? (
                        <CircularProgress size={15} />
                      ) : !isDetail && !isDraft ? (
                        <Link
                          variant='body2'
                          onClick={() =>
                            handleAproval(
                              'AprovacaoNomeFantasia',
                              'dataaprovacaonomefantasia'
                            )
                          }
                          style={{ fontWeight: 'bold', cursor: 'pointer' }}
                        >
                          Aprovar
                        </Link>
                      ) : null}
                    </Box>
                  ) : null}
                </Box>

                <FantasyNameForm
                  isDetail={
                    isDetail || team?.[`_${PREFIX}aprovacaonomefantasia_value`]
                  }
                  values={formik.values}
                  errors={formik.errors}
                  setValues={formik.setValues}
                  setFieldValue={formik.setFieldValue}
                  handleChange={formik.handleChange}
                />
              </Box>
            </AccordionDetails>
          </Accordion>

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
                setTeam={setTeam}
                teamId={team?.[`${PREFIX}turmaid`]}
                currentUser={currentUser}
                persons={peopleOptions}
                setValues={formik.setValues}
                setFieldValue={formik.setFieldValue}
              />
            </AccordionDetails>
          </Accordion>

          <Accordion elevation={3} style={{ margin: '.5rem' }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography color='primary' style={{ fontWeight: 'bold' }}>
                Dias de aula
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Schedules
                isModel={isModel}
                isDetail={isDetail}
                handleSchedule={handleSchedule}
                isSaved={!!team?.[`${PREFIX}turmaid`]}
                refetch={refetch}
                isLoadModel={isLoadModel}
                removeDaySchedule={removeDaySchedule}
                getActivityByTeamId={getActivityByTeamId}
                schedules={team?.[`${PREFIX}CronogramadeDia_Turma`]}
              />
            </AccordionDetails>
          </Accordion>

          <Accordion elevation={3} style={{ margin: '.5rem' }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography color='primary' style={{ fontWeight: 'bold' }}>
                Participantes
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box
                display='flex'
                flexDirection='column'
                width='100%'
                style={{ gap: '10px' }}
              >
                {team?.[`_${PREFIX}aprovacaoparticipantes_value`] && (
                  <Box
                    display='flex'
                    justifyContent='space-between'
                    width='40%'
                  >
                    <Box
                      display='flex'
                      alignItems='center'
                      style={{ gap: '10px' }}
                    >
                      <CheckCircle
                        fontSize='small'
                        style={{ color: '#35bb5a' }}
                      />
                      <Typography
                        variant='body2'
                        color='primary'
                        style={{ fontWeight: 'bold' }}
                      >
                        Aprovado
                      </Typography>
                    </Box>
                    <Box>
                      {(isProgramDirector || isProgramResponsible) && (
                        <>
                          {loadingApproval?.AprovacaoParticipantes ? (
                            <CircularProgress size={15} />
                          ) : !isDetail ? (
                            <Link
                              variant='body2'
                              onClick={() =>
                                handleEditApproval(
                                  'AprovacaoParticipantes',
                                  'dataaprovacaoparticipantes'
                                )
                              }
                              style={{ fontWeight: 'bold', cursor: 'pointer' }}
                            >
                              Editar
                            </Link>
                          ) : null}
                        </>
                      )}
                    </Box>
                  </Box>
                )}
                <Box display='flex' justifyContent='space-between' width='40%'>
                  <Box
                    display='flex'
                    alignItems='center'
                    style={{ gap: '10px' }}
                  >
                    {!team?.[`_${PREFIX}aprovacaoparticipantes_value`] &&
                      !isModel && (
                        <>
                          <AccessTime fontSize='small' />
                          <Typography
                            variant='body2'
                            style={{ fontWeight: 'bold' }}
                          >
                            Pendente Aprovação
                          </Typography>
                        </>
                      )}
                  </Box>
                  {(isProgramDirector || isProgramResponsible) &&
                  !team?.[`_${PREFIX}aprovacaoparticipantes_value`] ? (
                    <Box display='flex' justifyContent='flex-end'>
                      {loadingApproval?.AprovacaoParticipantes ? (
                        <CircularProgress size={15} />
                      ) : !isDetail ? (
                        <Link
                          variant='body2'
                          onClick={() =>
                            handleAproval(
                              'AprovacaoParticipantes',
                              'dataaprovacaoparticipantes'
                            )
                          }
                          style={{ fontWeight: 'bold', cursor: 'pointer' }}
                        >
                          Aprovar
                        </Link>
                      ) : null}
                    </Box>
                  ) : null}
                </Box>
                <ParticipantsForm
                  isDetail={isDetail}
                  errors={formik.errors}
                  values={formik.values}
                  setValues={formik.setValues}
                  handleChange={formik.handleChange}
                  setFieldValue={formik.setFieldValue}
                />
              </Box>
            </AccordionDetails>
          </Accordion>
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
                  name='description'
                  onChange={(nextValue) =>
                    formik.setFieldValue('description', nextValue.target.value)
                  }
                  value={formik.values.description}
                />
                <FormHelperText>
                  {formik?.values?.description?.length || 0}/2000
                </FormHelperText>
              </FormControl>
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
          <Box>
            {/* {!isModel &&
            !isLoadModel &&
            team?.[`${PREFIX}turmaid`] &&
            !team?.[`_${PREFIX}lancarparaaprovacao_value`] ? (
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

            {isModel && canEdit && team?.[`${PREFIX}turmaid`] && !programId ? (
              <Button
                variant='contained'
                color='secondary'
                onClick={handlePublish}
                startIcon={
                  team?.[`${PREFIX}publicado`] ? (
                    <VisibilityOff />
                  ) : (
                    <Visibility />
                  )
                }
              >
                {publishLoading ? (
                  <CircularProgress size={25} style={{ color: '#fff' }} />
                ) : team?.[`${PREFIX}publicado`] ? (
                  'Despublicar'
                ) : (
                  'Publicar'
                )}
              </Button>
            ) : null}

            {!isModel &&
            !isLoadModel &&
            team?.[`_${PREFIX}lancarparaaprovacao_value`] ? (
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
          <Box display='flex' justifyContent='flex-end' style={{ gap: '1rem' }}>
            <Button color='primary' onClick={onClose}>
              Cancelar
            </Button>
            <Button
              variant='contained'
              color='primary'
              disabled={!canEdit || isDetail}
              onClick={handleSave}
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
              {errorApproval.title}

              <IconButton
                aria-label='close'
                onClick={() =>
                  setErrorApproval({
                    title:
                      'Campos/Funções obrigatórios para lançar para aprovação',
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
          <DialogContent>{errorApproval.msg}</DialogContent>
        </Dialog>
      </Box>
    </>
  );
};

export default Form;
