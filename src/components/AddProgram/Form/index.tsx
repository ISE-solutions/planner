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
import { useFormik } from 'formik';
import * as React from 'react';
import * as yup from 'yup';
import ExpandMore from '@material-ui/icons/ExpandMore';
import {
  useConfirmation,
  useContextWebpart,
  useLoggedUser,
  useNotification,
  useTeam,
} from '~/hooks';
import InfoForm from './InfoForm';
import FantasyNameForm from './FantasyNameForm';
import EnvolvedPeopleForm from './EnvolvedPeopleForm';
import RelatedClass from './RelatedClass';
import Teams from './Teams';
import { PERSON, PREFIX } from '~/config/database';
import { Anexos, Backdrop } from '~/components';
import { getFiles } from '~/utils/sharepoint';
import { sp } from '@pnp/sp';
import * as moment from 'moment';
import { EFatherTag, EGroups } from '~/config/enums';
import {
  AccessTime,
  CheckCircle,
  Close,
  Replay,
  Visibility,
  VisibilityOff,
} from '@material-ui/icons';
import * as _ from 'lodash';
import { BoxCloseIcon } from '../styles';
import { useDispatch, useSelector } from 'react-redux';
import {
  addOrUpdateProgram,
  getProgramId,
  getPrograms,
  updateProgram,
} from '~/store/modules/program/actions';
import { fetchAllPerson } from '~/store/modules/person/actions';
import { fetchAllTags } from '~/store/modules/tag/actions';
import { fetchAllSpace } from '~/store/modules/space/actions';
import { AppState } from '~/store';
import HelperTooltip from '../../HelperTooltip';
import useUndo from '~/hooks/useUndo';
import { executeChangeTemperature } from '~/store/modules/genericActions/actions';
import AddTeam from '~/components/AddTeam';
import { getTeamById } from '~/store/modules/team/actions';

interface IForm {
  isModel?: boolean;
  isDraft?: boolean;
  isLoadModel?: boolean;
  isProgramResponsible: boolean;
  program: any;
  dictTag: any;
  tagsOptions: any[];
  peopleOptions: any[];
  dictPeople: any;
  refetchProgram: any;
  handleClose: () => void;
  setProgram: (program) => void;
}

const Form: React.FC<IForm> = ({
  program,
  isModel,
  isDraft,
  isProgramResponsible,
  isLoadModel,
  tagsOptions,
  peopleOptions,
  dictTag,
  dictPeople,
  refetchProgram,
  handleClose,
  setProgram,
}) => {
  const programResponsible = tagsOptions.find(
    (e) => e?.[`${PREFIX}nome`] === EFatherTag.RESPONSAVEL_PELO_PROGRAMA
  );

  const DEFAULT_VALUES = {
    title: '',
    sigla: '',
    isReserve: false,
    typeProgram: null,
    nameProgram: null,
    institute: null,
    company: null,
    responsible: null,
    temperature: null,
    description: '',
    model: isModel,
    anexos: [],
    names: [{ keyId: v4(), name: '', nameEn: '', nameEs: '', use: '' }],
    relatedClass: [{ keyId: v4(), team: null, relatedTeam: null }],
    people: [
      {
        keyId: v4(),
        person: null,
        isRequired: true,
        function: { ...programResponsible },
      },
    ],
  };

  const [initialValues, setInitialValues] = React.useState(DEFAULT_VALUES);
  const [isDetail, setIsDetail] = React.useState(!isLoadModel && program);
  const [loading, setLoading] = React.useState(false);

  const [publishLoading, setPublishLoading] = React.useState(false);
  const [loadingApproval, setLoadingApproval] = React.useState<any>({});
  const [currentProgram, setCurrentProgram] = React.useState<any>();
  const [editLoading, setEditLoading] = React.useState(false);
  const [valuesSetted, setValuesSetted] = React.useState(false);
  const [isSubmitted, setIsSubmetted] = React.useState(false);
  const [pastValues, setPastValues] = React.useState<any>(DEFAULT_VALUES);
  const [teamSelected, setTeamSelected] = React.useState<any>();
  const [openAddTeam, setOpenAddTeam] = React.useState(false);
  const [errorApproval, setErrorApproval] = React.useState<{
    open: boolean;
    msg: React.ReactNode;
  }>({
    open: false,
    msg: null,
  });

  const { app } = useSelector((state: AppState) => state);
  const { tooltips } = app;

  const { notification } = useNotification();
  const { context } = useContextWebpart();
  const { currentUser } = useLoggedUser();
  const { confirmation } = useConfirmation();
  const { undo } = useUndo();
  const updateTemperature = React.useRef(false);

  const dispatch = useDispatch();

  const programDirector = tagsOptions.find(
    (e) =>
      !e?.[`${PREFIX}excluido`] &&
      e?.[`${PREFIX}ativo`] &&
      e?.[`${PREFIX}nome`] === EFatherTag.DIRETOR_PROGRAMA
  );

  const [{ teams }] = useTeam({
    active: 'Ativo',
  });

  const dictTeam = React.useMemo(() => {
    const teamMap = new Map();

    if (teams?.length) {
      teams?.forEach((team) => teamMap.set(team?.[`${PREFIX}turmaid`], team));
    }

    return teamMap;
  }, [teams]);

  const refAnexo = React.useRef<any>();

  const validationSchema = yup.object({
    nameProgram: yup.mixed().required('Campo Obrigatório'),
    sigla: yup.string().required('Campo Obrigatório'),
  });

  const validationSchemaModel = yup.object({
    title: yup.string().required('Campo Obrigatório'),
    nameProgram: yup.mixed().required('Campo Obrigatório'),
    sigla: yup.string().required('Campo Obrigatório'),
  });

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
    if (program?.[`${PREFIX}programaid`]) {
      setLoading(true);
      getProgramId(program?.[`${PREFIX}programaid`])
        .then(({ value }) => {
          setLoading(false);
          setCurrentProgram(value[0]);
        })
        .catch(() => {
          notification.error({
            title: 'Falha',
            description: 'Houve um erro interno!',
          });
          setLoading(false);
        });
    }
  }, [program]);

  React.useEffect(() => {
    if (currentProgram && dictTag && dictPeople && dictTeam && !valuesSetted) {
      const iniVal = formatValues(currentProgram);

      setInitialValues(iniVal);
      setPastValues(iniVal);
      setValuesSetted(true);
      getFiles(
        sp,
        `Anexos Interno/Programa/${moment(currentProgram?.createdon).format(
          'YYYY'
        )}/${currentProgram?.[`${PREFIX}programaid`]}`
      ).then((files) => {
        formik.setFieldValue('anexos', files);
        setPastValues({ ...iniVal, anexos: files });
      });

      if (
        currentProgram?.[`_${PREFIX}editanto_value`] ===
        currentUser?.[`${PREFIX}pessoaid`]
      ) {
        setIsDetail(false);
      }
    }
  }, [currentProgram, dictTag, dictPeople, teams, dictTeam]);

  const handleUndo = (newProgram) => {
    setValuesSetted(false);
    const programUndo = JSON.parse(localStorage.getItem('undoProgram'));
    const peopleToDelete = [];
    const namesToDelete = [];

    newProgram?.[`${PREFIX}Programa_PessoasEnvolvidas`]?.forEach((e) => {
      const envolvedSaved = programUndo?.people?.find(
        (sp) => sp?.id === e?.[`${PREFIX}pessoasenvolvidasprogramaid`]
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
          id: e[`${PREFIX}pessoasenvolvidasprogramaid`],
          person: dictPeople[e?.[`_${PREFIX}pessoa_value`]],
          function: func,
        });
      }
    });

    programUndo?.people?.forEach((e) => {
      const envolvedSaved = newProgram?.[
        `${PREFIX}Programa_PessoasEnvolvidas`
      ]?.find((sp) => e?.id === sp?.[`${PREFIX}pessoasenvolvidasprogramaid`]);

      if (!envolvedSaved) {
        peopleToDelete.push({
          ...e,
          id: null,
        });
      }
    });

    newProgram?.[`${PREFIX}Programa_NomePrograma`]?.forEach((e) => {
      const nameSaved = programUndo?.names?.find(
        (sp) => sp?.id === e?.[`${PREFIX}nomeprogramaid`]
      );

      if (nameSaved) {
        namesToDelete.push(nameSaved);
      } else {
        namesToDelete.push({
          keyId: v4(),
          deleted: true,
          id: e[`${PREFIX}nomeprogramaid`],
          name: e?.[`${PREFIX}nome`],
          nameEn: e?.[`${PREFIX}nomeen`],
          nameEs: e?.[`${PREFIX}nomees`],
          use: dictTag?.[e?.[`_${PREFIX}uso_value`]],
        });
      }
    });

    programUndo?.names?.forEach((e) => {
      const nameSaved = newProgram?.[`${PREFIX}Programa_NomePrograma`]?.find(
        (sp) => e?.id === sp?.[`${PREFIX}nomeprogramaid`]
      );

      if (!nameSaved) {
        namesToDelete.push({
          ...e,
          id: null,
        });
      }
    });

    dispatch(
      addOrUpdateProgram(
        {
          ...programUndo,
          group: myGroup(),
          isLoadModel,
          people: peopleToDelete,
          names: namesToDelete,
          previousPeople: [],
          previousNames: [],
        },
        {
          onSuccess: (pr) => {
            refetchProgram?.();
            setProgram(pr);
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

  const formatValues = (item) => {
    const formatted = {
      id: item[`${PREFIX}programaid`] || '',
      title: item[`${PREFIX}titulo`] || '',
      sigla: item[`${PREFIX}sigla`] || '',
      model: item[`${PREFIX}modelo`],
      isReserve: item[`${PREFIX}ehreserva`],
      modeloid: item?.modeloid,
      typeProgram:
        dictTag?.[item?.[`${PREFIX}TipoPrograma`]?.[`${PREFIX}etiquetaid`]] ||
        null,
      nameProgram:
        dictTag?.[item?.[`${PREFIX}NomePrograma`]?.[`${PREFIX}etiquetaid`]] ||
        null,
      institute:
        dictTag?.[item?.[`${PREFIX}Instituto`]?.[`${PREFIX}etiquetaid`]] ||
        null,
      company:
        dictTag?.[item?.[`${PREFIX}Empresa`]?.[`${PREFIX}etiquetaid`]] || null,
      temperature:
        dictTag?.[item?.[`${PREFIX}Temperatura`]?.[`${PREFIX}etiquetaid`]] ||
        null,
      responsible:
        dictPeople?.[
          item?.[`${PREFIX}ResponsavelpeloPrograma`]?.[`${PREFIX}pessoaid`]
        ] || null,
      description: item[`${PREFIX}observacao`] || '',
      anexos: [],
      teams: item.teams || [],
      relatedClass: item?.[`${PREFIX}ise_turmasrelacionadas_Programa_ise_progr`]
        ?.length
        ? item?.[`${PREFIX}ise_turmasrelacionadas_Programa_ise_progr`]?.map(
            (te) => ({
              keyId: v4(),
              id: te?.[`${PREFIX}turmasrelacionadasid`],
              team: dictTeam.get(te?.[`_${PREFIX}turma_value`]),
              relatedTeam: dictTeam.get(
                te?.[`_${PREFIX}turmarelacionada_value`]
              ),
            })
          )
        : [{ keyId: v4(), team: null, relatedTeam: null }],
      names: item?.[`${PREFIX}Programa_NomePrograma`]?.length
        ? item[`${PREFIX}Programa_NomePrograma`]?.map((e) => ({
            keyId: v4(),
            id: e[`${PREFIX}nomeprogramaid`],
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
      people: [],
    };

    const peopleSaved = item[`${PREFIX}Programa_PessoasEnvolvidas`]?.map(
      (e) => {
        const func = e?.[`_${PREFIX}funcao_value`]
          ? _.cloneDeep(dictTag[e?.[`_${PREFIX}funcao_value`]])
          : {};
        func.needApprove = func?.[`${PREFIX}Etiqueta_Pai`]?.some(
          (e) => e?.[`${PREFIX}nome`] === EFatherTag.NECESSITA_APROVACAO
        );

        return {
          ...e,
          keyId: v4(),
          isRequired: e?.[`${PREFIX}obrigatorio`],
          id: e[`${PREFIX}pessoasenvolvidasprogramaid`],
          person: dictPeople[e?.[`_${PREFIX}pessoa_value`]],
          function: func,
        };
      }
    );

    if (
      !peopleSaved?.some(
        (peo) =>
          peo.function?.[`${PREFIX}nome`] ===
          EFatherTag.RESPONSAVEL_PELO_PROGRAMA
      )
    ) {
      const func = tagsOptions.find(
        (e) => e?.[`${PREFIX}nome`] === EFatherTag.RESPONSAVEL_PELO_PROGRAMA
      );

      peopleSaved.push({
        keyId: v4(),
        isRequired: true,
        function: func,
      });
    }

    formatted.people = peopleSaved?.sort(
      (a, b) => a?.[`${PREFIX}ordem`] - b?.[`${PREFIX}ordem`]
    );

    return formatted;
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
          handleSave();
        },
        onCancel: () => {
          handleResetEditing();
        },
      });
    } else {
      handleResetEditing();
    }
  };

  const handleSuccess = (newProgram) => {
    // handleClose();
    if (updateTemperature.current) {
      dispatch(
        executeChangeTemperature(
          {
            origin: 'Programa',
            idOrigin: program?.[`${PREFIX}programaid`],
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

    setLoading(false);
    notification.success({
      title: 'Sucesso',
      description: 'Cadastro realizado com sucesso',
    });

    if (pastValues?.id) {
      undo.open('Deseja desfazer a ação?', () => handleUndo(newProgram));
    }

    setProgram(newProgram);

    // @ts-ignore
    if (formik.values.close) {
      setInitialValues(DEFAULT_VALUES);
      formik.resetForm();
      handleClose();
      setValuesSetted(false);
    }
  };

  const handleError = (error, newProgram) => {
    console.log(error);
    setLoading(false);

    if (newProgram) {
      setProgram(newProgram);
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
      addOrUpdateProgram(
        body,
        {
          onSuccess: handleSuccess,
          onError: handleError,
        },
        forceCreate
      )
    );
  };

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnMount: false,
    validateOnChange: false,
    validationSchema: isModel ? validationSchemaModel : validationSchema,
    onSubmit: (values) => {
      setIsSubmetted(true);
      if (!isModel) {
        const functionsRequired = {
          programResponsible: false,
        };

        values.people.forEach((envolved: any) => {
          if (
            envolved.function?.[`${PREFIX}nome`] ===
              EFatherTag.RESPONSAVEL_PELO_PROGRAMA &&
            envolved.person &&
            !envolved?.deleted
          ) {
            functionsRequired.programResponsible = true;
          }
        });

        if (
          Object.keys(functionsRequired).some((key) => !functionsRequired[key])
        ) {
          setLoadingApproval(false);
          setLoading(false);
          setErrorApproval({
            open: true,
            msg: (
              <div>
                <Typography>
                  Falta informar as pessoas para seguintes funções:
                </Typography>
                <ul>
                  {!functionsRequired.programResponsible && (
                    <li>
                      <strong>{EFatherTag.RESPONSAVEL_PELO_PROGRAMA}</strong>
                    </li>
                  )}
                </ul>
              </div>
            ),
          });

          return;
        }
      }

      const files = refAnexo?.current?.getAnexos();
      setLoading(true);
      setValuesSetted(false);

      localStorage.setItem('undoProgram', JSON.stringify(pastValues));

      if (
        !isModel &&
        currentProgram?.[`${PREFIX}programaid`] &&
        currentProgram?.[`${PREFIX}Programa_Turma`].length &&
        currentProgram?.[`${PREFIX}Temperatura`]?.[`${PREFIX}etiquetaid`] !==
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
                group: myGroup(),
                isLoadModel,
                anexos: files,
                id: currentProgram[`${PREFIX}programaid`],
                user: currentUser?.[`${PREFIX}pessoaid`],
                previousPeople:
                  currentProgram[`${PREFIX}Programa_PessoasEnvolvidas`] || [],
                previousNames:
                  currentProgram[`${PREFIX}Programa_NomePrograma`] || [],
              },
              true
            );
          },
          onCancel: () => {
            handleSaveSubmit(
              {
                ...values,
                group: myGroup(),
                isLoadModel,
                anexos: files,
                id: currentProgram?.[`${PREFIX}programaid`],
                user: currentUser?.[`${PREFIX}pessoaid`],
                previousPeople:
                  currentProgram?.[`${PREFIX}Programa_PessoasEnvolvidas`] || [],
                previousNames:
                  currentProgram?.[`${PREFIX}Programa_NomePrograma`] || [],
              },
              false
            );
          },
        });
      } else {
        handleSaveSubmit(
          {
            ...values,
            group: myGroup(),
            isLoadModel,
            anexos: files,
            id: currentProgram?.[`${PREFIX}programaid`],
            user: currentUser?.[`${PREFIX}pessoaid`],
            previousPeople:
              currentProgram?.[`${PREFIX}Programa_PessoasEnvolvidas`] || [],
            previousNames:
              currentProgram?.[`${PREFIX}Programa_NomePrograma`] || [],
          },
          false
        );
      }

      // dispatch(
      //   addOrUpdateProgram(
      //     {
      //       ...values,
      //       group: myGroup(),
      //       isLoadModel,
      //       anexos: files,
      //       id: program[`${PREFIX}programaid`],
      //       user: currentUser?.[`${PREFIX}pessoaid`],
      //       previousPeople:
      //         program[`${PREFIX}Programa_PessoasEnvolvidas`] || [],
      //       previousNames: program[`${PREFIX}Programa_NomePrograma`] || [],
      //     },
      //     {
      //       onSuccess: handleSuccess,
      //       onError: handleError,
      //     }
      //   )
      // );
    },
  });

  const handleSave = () => {
    if (!isModel) {
      setLoading(true);

      getPrograms({
        active: 'Ativo',
        model: false,
        nameProgram: formik.values.nameProgram?.[`${PREFIX}etiquetaid`],
        typeProgram: formik.values.typeProgram?.[`${PREFIX}etiquetaid`],
        institute: formik.values.institute?.[`${PREFIX}etiquetaid`],
        company: formik.values.company?.[`${PREFIX}etiquetaid`],
      }).then((data) => {
        if (
          data.length &&
          data?.[0]?.[`${PREFIX}programaid`] !==
            currentProgram?.[`${PREFIX}programaid`]
        ) {
          setLoading(false);
          notification.error({
            title: 'Programa existente',
            description: 'Programa já cadastrado, verifique o nome',
          });
        } else {
          setLoading(false);
          formik.handleSubmit();
        }
      });
    } else {
      formik.handleSubmit();
    }
  };

  const refreshProgram = () => {
    setValuesSetted(false);
    setLoading(true);
    getProgramId(currentProgram?.[`${PREFIX}programaid`])
      .then(({ value }) => {
        setLoading(false);
        setProgram(value[0]);
      })
      .catch(() => {
        notification.error({
          title: 'Falha',
          description: 'Houve um erro interno!',
        });
        setLoading(false);
      });
  };

  const handleToApprove = () => {
    const functionsRequired = {
      programResponsible: false,
    };

    formik.values.people.forEach((envolved) => {
      if (
        envolved.function?.[`${PREFIX}nome`] ===
        EFatherTag.RESPONSAVEL_PELO_PROGRAMA
      ) {
        functionsRequired.programResponsible = true;
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
              <li>
                <strong>Reponsável pelo programa</strong>
              </li>
            </ul>
          </div>
        ),
      });

      return;
    }

    updateProgram(
      currentProgram?.[`${PREFIX}programaid`],
      {
        [`${PREFIX}LancarparaAprovacao@odata.bind`]: `/${PERSON}(${
          currentUser?.[`${PREFIX}pessoaid`]
        })`,
      },
      {
        onSuccess: (it) => {
          setProgram(it);
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
    updateProgram(
      currentProgram[`${PREFIX}programaid`],
      {
        [`${PREFIX}${nameField}@odata.bind`]: `/${PERSON}(${
          currentUser?.[`${PREFIX}pessoaid`]
        })`,
        [`${PREFIX}${dateField}`]: moment().format(),
      },
      {
        onSuccess: (pro) => {
          setLoadingApproval({});
          setProgram(pro);
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
    updateProgram(
      program[`${PREFIX}programaid`],
      {
        [`${PREFIX}${nameField}@odata.bind`]: null,
        [`${PREFIX}${dateField}`]: null,
      },
      {
        onSuccess: (pro) => {
          setLoadingApproval({});
          setProgram(pro);
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

    updateProgram(
      currentProgram[`${PREFIX}programaid`],
      {
        [`${PREFIX}publicado`]: !currentProgram?.[`${PREFIX}publicado`],
      },
      {
        onSuccess: (it) => {
          setProgram(it);
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

    updateProgram(
      currentProgram?.[`${PREFIX}programaid`],
      {
        [`${PREFIX}Editanto@odata.bind`]: `/${PERSON}(${
          currentUser?.[`${PREFIX}pessoaid`]
        })`,
        [`${PREFIX}datahoraeditanto`]: moment().format(),
      },
      {
        onSuccess: (act) => {
          setProgram(act);
          setEditLoading(false);
          setIsDetail(false);
        },
        onError: () => {},
      }
    );
  };

  const handleResetEditing = async () => {
    if (
      currentProgram?.[`_${PREFIX}editanto_value`] !==
      currentUser?.[`${PREFIX}pessoaid`]
    ) {
      setInitialValues(DEFAULT_VALUES);
      formik.resetForm();
      handleClose();
      setIsDetail(false);
      setValuesSetted(false);
      return;
    }
    setEditLoading(true);
    await updateProgram(
      currentProgram?.[`${PREFIX}programaid`],
      {
        [`${PREFIX}Editanto@odata.bind`]: null,
        [`${PREFIX}datahoraeditanto`]: null,
      },
      {
        onSuccess: (act) => {
          setInitialValues(DEFAULT_VALUES);
          setIsDetail(false);
          formik.resetForm();
          handleClose();
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

  const handleTeam = (team) => {
    getTeamById(team?.[`${PREFIX}turmaid`]).then(({ value }) => {
      setTeamSelected(value[0]);
      setOpenAddTeam(true);
    });
  };

  const handleCloseTeam = () => {
    setTeamSelected(null);
    setOpenAddTeam(false);
    refreshProgram();
  };

  const canEdit = React.useMemo(() => {
    const programDirectorProgram = currentProgram?.[
      `${PREFIX}Programa_PessoasEnvolvidas`
    ]?.find(
      (env) =>
        env?.[`_${PREFIX}funcao_value`] ===
        programDirector?.[`${PREFIX}etiquetaid`]
    );

    return (
      currentUser?.isPlanning ||
      programDirectorProgram?.[`_${PREFIX}pessoa_value`] ===
        currentUser?.[`${PREFIX}pessoaid`] ||
      currentUser?.[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]?.some((cUser) =>
        currentProgram?.[`${PREFIX}Programa_Compartilhamento`]?.some(
          (comp) =>
            comp?.[`${PREFIX}etiquetaid`] === cUser?.[`${PREFIX}etiquetaid`]
        )
      ) ||
      currentUser?.[`${PREFIX}pessoaid`] ===
        currentProgram?.[`_${PREFIX}criadopor_value`]
    );
  }, [currentUser]);

  const isProgramDirector = React.useMemo(() => {
    if (dictPeople && dictTag) {
      return currentProgram?.[`${PREFIX}Programa_PessoasEnvolvidas`].some(
        (envol) => {
          const func = dictTag?.[envol?.[`_${PREFIX}funcao_value`]];
          const envolPerson = dictPeople?.[envol?.[`_${PREFIX}pessoa_value`]];

          if (func?.[`${PREFIX}nome`] === EFatherTag.DIRETOR_PROGRAMA) {
            return (
              currentUser?.[`${PREFIX}pessoaid`] ===
              envolPerson?.[`${PREFIX}pessoaid`]
            );
          }

          return false;
        }
      );
    }
  }, [currentUser, currentProgram, dictPeople]);

  const isFinance = React.useMemo(() => {
    if (dictPeople && dictTag) {
      return currentProgram?.[`${PREFIX}Programa_PessoasEnvolvidas`].some(
        (envol) => {
          const func = dictTag?.[envol?.[`_${PREFIX}funcao_value`]];
          const envolPerson = dictPeople?.[envol?.[`_${PREFIX}pessoa_value`]];

          if (func?.[`${PREFIX}nome`] === EFatherTag.FINANCEIRO) {
            return (
              currentUser?.[`${PREFIX}pessoaid`] ===
              envolPerson?.[`${PREFIX}pessoaid`]
            );
          }

          return false;
        }
      );
    }
  }, [currentUser, currentProgram, dictPeople]);

  const programTooltip = tooltips.find(
    (tooltip) => tooltip?.Title === 'Programa'
  );

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

      <AddTeam
        teams={teams}
        context={context}
        isDraft={
          (teamSelected?.[`${PREFIX}Temperatura`]?.[`${PREFIX}nome`] ||
            currentProgram) === EFatherTag.RASCUNHO
        }
        // refetch={updateAll}
        open={openAddTeam}
        program={currentProgram}
        isProgramResponsible={isProgramResponsible}
        isProgramDirector={isProgramDirector}
        isFinance={isFinance}
        team={teamSelected}
        setTeam={setTeamSelected}
        teamLength={teams?.length}
        company={currentProgram?.[`${PREFIX}Empresa`]?.[`${PREFIX}nome`]}
        programId={currentProgram?.[`${PREFIX}programaid`]}
        handleClose={handleCloseTeam}
      />

      <Box
        display='flex'
        height='100%'
        flexDirection='column'
        padding='2rem'
        minWidth='30rem'
        style={{ gap: '10px' }}
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
              {currentProgram?.[`${PREFIX}programaid`]
                ? 'Alterar Programa'
                : 'Cadastrar Programa'}
            </Typography>

            <HelperTooltip content={programTooltip?.Conteudo} />

            <Tooltip title='Atualizar'>
              <IconButton onClick={handleUpdateData}>
                <Replay />
              </IconButton>
            </Tooltip>
          </Box>

          {canEdit ? (
            <Box display='flex' alignItems='center' style={{ gap: '2rem' }}>
              {currentProgram?.[`_${PREFIX}editanto_value`] &&
              currentProgram?.[`_${PREFIX}editanto_value`] !==
                currentUser?.[`${PREFIX}pessoaid`] ? (
                <Box>
                  <Typography
                    variant='subtitle2'
                    style={{ fontWeight: 'bold' }}
                  >
                    Outra pessoa está editanto esse programa
                  </Typography>

                  <Typography variant='subtitle2'>
                    {
                      dictPeople?.[
                        currentProgram?.[`_${PREFIX}editanto_value`]
                      ]?.[`${PREFIX}nomecompleto`]
                    }{' '}
                    -{' '}
                    {moment(
                      currentProgram?.[`${PREFIX}datahoraeditanto`]
                    ).format('DD/MM/YYYY HH:mm:ss')}
                  </Typography>
                </Box>
              ) : null}

              {!currentProgram?.[`_${PREFIX}editanto_value`] ||
              currentProgram?.[`_${PREFIX}editanto_value`] ===
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
                isModel={isModel}
                isDraft={isDraft}
                program={currentProgram}
                isDetail={isDetail}
                tags={tagsOptions}
                loadingApproval={loadingApproval}
                handleAproval={handleAproval}
                handleEditApproval={handleEditApproval}
                values={formik.values}
                errors={formik.errors}
                setFieldValue={formik.setFieldValue}
                handleChange={formik.handleChange}
                isProgramResponsible={isProgramResponsible}
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
                {currentProgram?.[`_${PREFIX}aprovacaonomefantasia_value`] && (
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
                      {(isProgramResponsible || currentUser?.isPlanning) && (
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
                    {!currentProgram?.[
                      `_${PREFIX}aprovacaonomefantasia_value`
                    ] &&
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
                  {(isProgramResponsible || currentUser?.isPlanning) &&
                  !currentProgram?.[`_${PREFIX}aprovacaonomefantasia_value`] ? (
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
                    isDetail ||
                    currentProgram?.[`_${PREFIX}aprovacaonomefantasia_value`]
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
                isModel={isModel}
                isDraft={isDraft}
                programId={currentProgram?.[`${PREFIX}programaid`]}
                values={formik.values}
                errors={formik.errors}
                tags={tagsOptions}
                dictTag={dictTag}
                persons={peopleOptions}
                setProgram={setProgram}
                currentUser={currentUser}
                setValues={formik.setValues}
                setFieldValue={formik.setFieldValue}
              />
            </AccordionDetails>
          </Accordion>

          <Accordion elevation={3} style={{ margin: '.5rem' }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography color='primary' style={{ fontWeight: 'bold' }}>
                Turmas
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Teams
                isDetail={isDetail}
                handleTeam={handleTeam}
                refreshProgram={refreshProgram}
                teams={currentProgram?.[`${PREFIX}Programa_Turma`]}
                isSaved={!!currentProgram?.[`${PREFIX}programaid`]}
              />
            </AccordionDetails>
          </Accordion>

          {!isModel && (
            <Accordion
              elevation={3}
              disabled={!currentProgram}
              style={{ margin: '.5rem' }}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography color='primary' style={{ fontWeight: 'bold' }}>
                  Turmas Relacionadas
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <RelatedClass
                  isDetail={isDetail}
                  program={currentProgram}
                  teams={teams}
                  values={formik.values}
                  errors={formik.errors}
                  setValues={formik.setValues}
                  setFieldValue={formik.setFieldValue}
                  handleChange={formik.handleChange}
                />
              </AccordionDetails>
            </Accordion>
          )}

          <Accordion elevation={3} style={{ margin: '.5rem' }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography color='primary' style={{ fontWeight: 'bold' }}>
                Anexos
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box
                display='flex'
                flexDirection='column'
                width='100%'
                style={{ gap: '10px' }}
              >
                {program?.[`_${PREFIX}aprovacaoanexos_value`] && (
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
                      {(isProgramResponsible || currentUser?.isPlanning) && (
                        <>
                          {loadingApproval?.AprovacaoAnexos ? (
                            <CircularProgress size={15} />
                          ) : !isDetail && !isDraft ? (
                            <Link
                              variant='body2'
                              onClick={() =>
                                handleEditApproval(
                                  'AprovacaoAnexos',
                                  'dataaprovacaoanexos'
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
                    {!currentProgram?.[`_${PREFIX}aprovacaoanexos_value`] &&
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
                  {(isProgramResponsible || currentUser?.isPlanning) &&
                  !currentProgram?.[`_${PREFIX}aprovacaoanexos_value`] ? (
                    <Box display='flex' justifyContent='flex-end'>
                      {loadingApproval?.AprovacaoAnexos ? (
                        <CircularProgress size={15} />
                      ) : !isDetail && !isDraft ? (
                        <Link
                          variant='body2'
                          onClick={() =>
                            handleAproval(
                              'AprovacaoAnexos',
                              'dataaprovacaoanexos'
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

                <Anexos
                  ref={refAnexo}
                  disabled={
                    isDetail ||
                    !!currentProgram?.[`_${PREFIX}aprovacaoanexos_value`]
                  }
                  anexos={formik.values.anexos}
                />
              </Box>
            </AccordionDetails>
          </Accordion>
          <Accordion elevation={3} style={{ margin: '.5rem' }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography color='primary' style={{ fontWeight: 'bold' }}>
                Observação
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box
                display='flex'
                flexDirection='column'
                width='100%'
                style={{ gap: '10px' }}
              >
                {currentProgram?.[`_${PREFIX}aprovacaoobservacao_value`] && (
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
                      {(isProgramResponsible || currentUser?.isPlanning) && (
                        <>
                          {loadingApproval?.AprovacaoObservacao ? (
                            <CircularProgress size={15} />
                          ) : !isDetail && !isDraft ? (
                            <Link
                              variant='body2'
                              onClick={() =>
                                handleEditApproval(
                                  'AprovacaoObservacao',
                                  'dataaprovacaoobservacao'
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
                    {!currentProgram?.[`_${PREFIX}aprovacaoobservacao_value`] &&
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
                  {(isProgramResponsible || currentUser?.isPlanning) &&
                  !currentProgram?.[`_${PREFIX}aprovacaoobservacao_value`] ? (
                    <Box display='flex' justifyContent='flex-end'>
                      {loadingApproval?.AprovacaoObservacao ? (
                        <CircularProgress size={15} />
                      ) : !isDetail && !isDraft ? (
                        <Link
                          variant='body2'
                          onClick={() =>
                            handleAproval(
                              'AprovacaoObservacao',
                              'dataaprovacaoobservacao'
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
                <FormControl fullWidth>
                  <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    disabled={
                      isDetail ||
                      !!currentProgram?.[`_${PREFIX}aprovacaoobservacao_value`]
                    }
                    inputProps={{ maxLength: 2000 }}
                    type='text'
                    name='description'
                    onChange={(nextValue) =>
                      formik.setFieldValue(
                        'description',
                        nextValue.target.value
                      )
                    }
                    value={formik.values.description}
                  />
                  <FormHelperText>
                    {formik?.values?.description?.length || 0}/2000
                  </FormHelperText>
                </FormControl>
              </Box>
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
            program?.[`${PREFIX}programaid`] &&
            !program?.[`_${PREFIX}lancarparaaprovacao_value`] ? (
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

            {/* {!isModel &&
            !isLoadModel &&
            program?.[`_${PREFIX}lancarparaaprovacao_value`] ? (
              <Box display='flex' alignItems='center' style={{ gap: '10px' }}>
                <CheckCircle fontSize='small' style={{ color: '#35bb5a' }} />
                <Typography
                  variant='body2'
                  color='primary'
                  style={{ fontWeight: 'bold' }}
                >
                  {loadingApproval ? (
                    <CircularProgress size={25} style={{ color: '#fff' }} />
                  ) : (
                    'Lançar para aprovação'
                  )}
                </Typography>
              </Box>
            ) : null} */}

            {isModel && canEdit && currentProgram?.[`${PREFIX}programaid`] ? (
              <Button
                variant='contained'
                color='secondary'
                onClick={handlePublish}
                startIcon={
                  currentProgram?.[`${PREFIX}publicado`] ? (
                    <VisibilityOff />
                  ) : (
                    <Visibility />
                  )
                }
              >
                {publishLoading ? (
                  <CircularProgress size={25} style={{ color: '#fff' }} />
                ) : currentProgram?.[`${PREFIX}publicado`] ? (
                  'Despublicar'
                ) : (
                  'Publicar'
                )}
              </Button>
            ) : null}
          </Box>
          <Box display='flex' style={{ gap: '1rem' }}>
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
              Campos/Funções obrigatórios
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
      </Box>
    </>
  );
};

export default Form;
