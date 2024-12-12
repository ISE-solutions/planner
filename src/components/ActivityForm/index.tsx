import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  IconButton,
  Link,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { useFormik } from 'formik';
import * as React from 'react';
import * as yup from 'yup';
import { v4 } from 'uuid';
import ExpandMore from '@material-ui/icons/ExpandMore';
import InfoForm from './InfoForm';
import FantasyNameForm from './FantasyNameForm';
import EnvolvedPeopleForm from './EnvolvedPeopleForm';
import Classroom from './Classroom';
import Documents from './Documents';
import AcademicRequest from './AcademicRequest';
import { PERSON, PREFIX } from '~/config/database';
import * as moment from 'moment';
import { EFatherTag, TYPE_ACTIVITY, TYPE_RESOURCE } from '~/config/enums';
import { useConfirmation, useContextWebpart, useNotification } from '~/hooks';
import checkPermitionByTag from '~/utils/checkPermitionByTag';
import {
  AccessTime,
  CheckCircle,
  Close,
  Publish,
  Replay,
  Visibility,
  VisibilityOff,
} from '@material-ui/icons';
import * as _ from 'lodash';
import { BoxCloseIcon } from '~/components/AddTeam/styles';
import {
  batchUpdateActivity,
  getAcademicRequestsByActivityId,
  getActivity,
  getActivityPermitions,
  updateActivity,
  updateActivityAll,
} from '~/store/modules/activity/actions';
import { useDispatch, useSelector } from 'react-redux';
import LoadModel from './LoadModel';
import { AppState } from '~/store';
import { fetchAllPerson } from '~/store/modules/person/actions';
import { fetchAllTags } from '~/store/modules/tag/actions';
import { fetchAllSpace } from '~/store/modules/space/actions';
import { batchAddNotification } from '~/store/modules/notification/actions';
import HelperTooltip from '../HelperTooltip';
import useUndo from '~/hooks/useUndo';

interface IActivityForm {
  activity: any;
  undoNextActivities?: any[];
  team?: any;
  program?: any;
  headerInfo?: React.ReactNode;
  maxHeight?: string;
  isDraft?: boolean;
  noPadding?: boolean;
  forceUpdate?: boolean;
  isModel?: boolean;
  isModelReference?: boolean;
  isDrawer?: boolean;
  isProgramResponsible?: boolean;
  academicDirector?: any;
  refetch?: any;
  handleClose?: () => void;
  onSave: (activity: any, onSuccess?: () => void) => void;
  throwToApprove?: (activity: any) => void;
  setActivity?: (activity: any) => void;
}

const ActivityForm: React.FC<IActivityForm> = ({
  activity,
  team,
  program,
  isDraft,
  isModel,
  maxHeight,
  noPadding,
  headerInfo,
  forceUpdate,
  isModelReference,
  isDrawer,
  undoNextActivities,
  isProgramResponsible,
  academicDirector,
  refetch,
  setActivity,
  throwToApprove,
  handleClose,
  onSave,
}) => {
  const DEFAULT_VALUES = {
    title: '',
    name: '',
    type: '',
    startTime: null,
    duration: moment('00:05', 'HH:mm'),
    endTime: null,
    quantity: 0,
    theme: '',
    description: '',
    observation: '',
    area: null,
    spaces: [],
    academicRequests: [],
    documents: [],
    temperature: null,
    names: [{ keyId: v4(), name: '', nameEn: '', nameEs: '', use: '' }],
    people: [{ keyId: v4(), person: null, function: null }],
  };

  const [isDetail, setIsDetail] = React.useState(
    Boolean(activity?.[`${PREFIX}atividadeid`])
  );
  const [initialValues, setInitialValues] = React.useState(DEFAULT_VALUES);
  const [pastValues, setPastValues] = React.useState<any>(DEFAULT_VALUES);
  const [detailLoading, setDetailLoading] = React.useState(false);
  const [publishLoading, setPublishLoading] = React.useState(false);
  const [valuesSetted, setValuesSetted] = React.useState(false);
  const [openLoad, setOpenLoad] = React.useState(false);
  const [editLoading, setEditLoading] = React.useState(false);
  const [documentChanged, setDocumentChanged] = React.useState(false);
  const [academicChanged, setAcademicChanged] = React.useState(false);
  const [loadingApproval, setLoadingApproval] = React.useState<any>({});
  const [tagsShared, setTagsShared] = React.useState([]);
  const [academicRequests, setAcademicRequests] = React.useState([]);
  const firstRender = React.useRef<boolean>(false);

  const dispatch = useDispatch();
  const { context } = useContextWebpart();
  const { notification } = useNotification();
  const { confirmation } = useConfirmation();
  const { undo } = useUndo();

  const { tag, space, person, app } = useSelector((state: AppState) => state);
  const { tags, dictTag } = tag;
  const { spaces, dictSpace } = space;
  const { persons, dictPeople } = person;
  const { tooltips } = app;

  const currentUser = React.useMemo(() => {
    if (persons?.length && activity) {
      const myEmail =
        context.pageContext.user.email || context.pageContext.user.loginName;
      const people = persons?.find(
        (pe) =>
          pe?.[`${PREFIX}email`]?.toLocaleLowerCase() ===
          myEmail?.toLocaleLowerCase()
      );

      const teacherEnvolved = activity?.[
        `${PREFIX}Atividade_PessoasEnvolvidas`
      ]?.find((e) => {
        const tag = dictTag[e?.[`_${PREFIX}funcao_value`]];

        return tag?.[`${PREFIX}nome`] === EFatherTag.PROFESSOR;
      });

      const teacher = dictPeople[teacherEnvolved?.[`_${PREFIX}pessoa_value`]];

      return {
        ...people,
        isTeacher:
          teacher?.[`${PREFIX}email`] === people?.[`${PREFIX}email`] &&
          !!teacherEnvolved?.[`_${PREFIX}aprovadopor_value`],
        isAcademicDirector: academicDirector?.[`${PREFIX}email`] === myEmail,
        isAreaChief: people?.[`${PREFIX}Pessoa_AreaResponsavel`]?.some(
          (are) =>
            are?.[`${PREFIX}etiquetaid`] ===
            activity?.[`${PREFIX}AreaAcademica`]?.[`${PREFIX}etiquetaid`]
        ),
        isPlanning: checkPermitionByTag(
          tags,
          people?.[`${PREFIX}Pessoa_Etiqueta_Etiqueta`],
          EFatherTag.PLANEJAMENTO
        ),
      };
    }
  }, [persons, activity]);

  const validationSchema = yup.object({
    duration: yup
      .mixed()
      .required('Campo Obrigatório')
      .test({
        name: 'durationValid',
        message: 'Formato inválido',
        test: (v) => v?.isValid(),
      }),
    startTime: yup.mixed().required('Campo Obrigatório'),
  });

  const validationSchemaModel = yup.object({
    duration: yup
      .mixed()
      .required('Campo Obrigatório')
      .test({
        name: 'durationValid',
        message: 'Formato inválido',
        test: (v) => v?.isValid(),
      }),
    title: yup.mixed().required('Campo Obrigatório'),
    startTime: yup.mixed().required('Campo Obrigatório'),
  });

  const programDirector = tags.find(
    (e) =>
      e?.[`${PREFIX}ativo`] &&
      !e?.[`${PREFIX}excluido`] &&
      e?.[`${PREFIX}nome`] === EFatherTag.DIRETOR_PROGRAMA
  );

  const coordination = tags.find(
    (e) =>
      e?.[`${PREFIX}ativo`] &&
      !e?.[`${PREFIX}excluido`] &&
      e?.[`${PREFIX}nome`] === EFatherTag.COORDENACAO_ADMISSOES
  );

  const academicDirectorLocal = tags.find(
    (e) =>
      e?.[`${PREFIX}ativo`] &&
      !e?.[`${PREFIX}excluido`] &&
      e?.[`${PREFIX}nome`] === EFatherTag.DIRETOR_ACADEMICO
  );

  React.useEffect(() => {
    if (activity?.[`${PREFIX}atividadeid`] && !firstRender.current) {
      firstRender.current = true;
      getAcademicRequestsByActivityId(activity?.[`${PREFIX}atividadeid`]).then(
        (data) => setAcademicRequests(data)
      );
    }
  }, [activity]);

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
    if (academicRequests?.length) {
      const newAcademicRequests = academicRequests?.map((request) => {
        const peopleRequest = activity[
          `${PREFIX}PessoasRequisica_Atividade`
        ]?.filter(
          (pe) =>
            pe?.[`_${PREFIX}requisicao_pessoasenvolvidas_value`] ===
            request?.[`${PREFIX}requisicaoacademicaid`]
        );

        return {
          keyId: v4(),
          equipments: request[`${PREFIX}Equipamentos`]?.length
            ? request[`${PREFIX}Equipamentos`]?.map(
                (e) => dictTag[e?.[`${PREFIX}etiquetaid`]]
              )
            : [],
          finiteResource: request[
            `${PREFIX}RequisicaoAcademica_Recurso`
          ]?.filter(
            (e) => e?.[`${PREFIX}tiporecurso`] === TYPE_RESOURCE.FINITO
          ),
          infiniteResource: request[
            `${PREFIX}RequisicaoAcademica_Recurso`
          ]?.filter(
            (e) => e?.[`${PREFIX}tiporecurso`] === TYPE_RESOURCE.INFINITO
          ),
          id: request?.[`${PREFIX}requisicaoacademicaid`],
          description: request?.[`${PREFIX}descricao`],
          deadline: request?.[`${PREFIX}prazominimo`],
          observation: request?.[`${PREFIX}observacao`],
          other: request?.[`${PREFIX}outro`],
          delivery: request?.[`${PREFIX}momentoentrega`],
          link: request?.[`${PREFIX}link`],
          nomemoodle: request?.[`${PREFIX}nomemoodle`],
          deliveryDate: request?.[`${PREFIX}dataentrega`]
            ? moment(request?.[`${PREFIX}dataentrega`])
            : null,
          people: peopleRequest?.length
            ? peopleRequest?.map((e) => {
                let func = dictTag[e?.[`_${PREFIX}funcao_value`]] || {};
                func.needApprove = func?.[`${PREFIX}Etiqueta_Pai`]?.some(
                  (e) => e?.[`${PREFIX}nome`] === EFatherTag.NECESSITA_APROVACAO
                );
                return {
                  keyId: v4(),
                  id: e[`${PREFIX}pessoasenvolvidasrequisicaoacademicaid`],
                  person: dictPeople[e?.[`_${PREFIX}pessoa_value`]],
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
        };
      });

      setInitialValues({
        ...initialValues,
        academicRequests: newAcademicRequests,
      });
      setPastValues({ ...pastValues, academicRequests: newAcademicRequests });
    }
  }, [academicRequests]);

  React.useEffect(() => {
    if (
      activity &&
      dictTag &&
      dictPeople &&
      (!valuesSetted || isModelReference || forceUpdate)
    ) {
      const iniVal = {
        id: activity[`${PREFIX}atividadeid`],
        title: activity[`${PREFIX}titulo`] || '',
        name: activity[`${PREFIX}nome`] || '',
        startDate: moment(activity[`${PREFIX}datahorainicio`]),
        endDate: moment(activity[`${PREFIX}datahorafim`]),
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
        quantity: activity[`${PREFIX}quantidadesessao`] || 0,
        typeApplication: activity[`${PREFIX}tipoaplicacao`],
        type: activity[`${PREFIX}tipo`],
        theme: activity[`${PREFIX}temaaula`] || '',
        description: activity[`${PREFIX}descricaoobjetivo`] || '',
        observation: activity[`${PREFIX}observacao`] || '',
        documents: activity?.[`${PREFIX}Atividade_Documento`]?.map(
          (document) => ({
            keyId: v4(),
            id: document?.[`${PREFIX}documentosatividadeid`],
            name: document?.[`${PREFIX}nome`],
            link: document?.[`${PREFIX}link`],
            font: document?.[`${PREFIX}fonte`],
            delivery: document?.[`${PREFIX}entrega`],
          })
        ),
        temperature:
          dictTag?.[
            activity?.[`${PREFIX}Temperatura`]?.[`${PREFIX}etiquetaid`]
          ] || null,
        lastTemperature:
          activity?.[`${PREFIX}Temperatura`]?.[`${PREFIX}etiquetaid`],
        academicRequests: [],
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
              value: activity[`${PREFIX}Curso`]?.[`${PREFIX}etiquetaid`],
              label: activity[`${PREFIX}Curso`]?.[`${PREFIX}nome`],
            }
          : null,
        spaces: activity[`${PREFIX}Atividade_Espaco`]?.length
          ? activity[`${PREFIX}Atividade_Espaco`]?.map(
              (e) => dictSpace[e?.[`${PREFIX}espacoid`]]
            )
          : [],
        names: activity[`${PREFIX}Atividade_NomeAtividade`]?.length
          ? activity[`${PREFIX}Atividade_NomeAtividade`]?.map((e) => ({
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
          ? activity[`${PREFIX}Atividade_PessoasEnvolvidas`]?.map((e) => {
              const func = dictTag[e?.[`_${PREFIX}funcao_value`]] || {};
              func.needApprove = func?.[`${PREFIX}Etiqueta_Pai`]?.some(
                (e) => e?.[`${PREFIX}nome`] === EFatherTag.NECESSITA_APROVACAO
              );
              return {
                ...e,
                keyId: v4(),
                id: e[`${PREFIX}pessoasenvolvidasatividadeid`],
                person: dictPeople[e?.[`_${PREFIX}pessoa_value`]],
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
      };

      setInitialValues(iniVal);
      setPastValues(iniVal);
      setValuesSetted(true);
    }

    if (
      activity?.[`_${PREFIX}editanto_value`] ===
        currentUser?.[`${PREFIX}pessoaid`] ||
      !activity?.[`${PREFIX}atividadeid`]
    ) {
      setIsDetail(false);
    }
  }, [activity, dictTag, dictPeople]);

  React.useEffect(() => {
    if (!firstRender.current) {
      setIsDetail(Boolean(activity?.[`${PREFIX}atividadeid`]));
    }
    if (activity && isModelReference && activity?.[`${PREFIX}atividadeid`]) {
      getActivityPermitions(activity?.[`${PREFIX}atividadeid`]).then(
        ({ value }) => {
          firstRender.current = true;
          const actv = value[0];
          setTagsShared(actv?.[`${PREFIX}Atividade_Compartilhamento`]);
        }
      );
    }
  }, [activity]);

  const getDates = (item) => {
    const dateRef = moment
      .utc(activity?.[`${PREFIX}datahorainicio`])
      .format('YYYY-MM-DD');
    let startTime = item.startTime.format('HH:mm');
    const startDate = moment(`${dateRef} ${startTime}`);
    const duration = item.duration.hour() * 60 + item.duration.minute();

    return {
      startDate: startDate.format(),
      endDate: startDate.clone().add(duration, 'minutes').format(),
      [`${PREFIX}datahorainicio`]: startDate.format(),
      [`${PREFIX}datahorafim`]: startDate
        .clone()
        .add(duration, 'minutes')
        .format(),
    };
  };

  const handleUndo = async () => {
    const activityUndo = JSON.parse(localStorage.getItem('undoActivity'));

    const [newActivityRequest, newRequestAcademic] = await Promise.all([
      getActivity(activityUndo.id),
      getAcademicRequestsByActivityId(activityUndo.id),
    ]);
    const newActivity = newActivityRequest.value[0];

    const peopleToDelete = [];
    const spaceToDelete = [];
    const namesToDelete = [];
    const documentsToDelete = [];
    const requestAcademicToDelete = [];

    newActivity?.[`${PREFIX}Atividade_Espaco`]?.forEach((e) => {
      const spaceSaved = activityUndo?.spaces?.find(
        (sp) => sp?.[`${PREFIX}espacoid`] === e?.[`${PREFIX}espacoid`]
      );

      if (!spaceSaved) {
        spaceToDelete.push(e);
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
          type: document?.[`${PREFIX}tipo`],
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

    newRequestAcademic?.forEach((request) => {
      const requestSaved = activityUndo?.academicRequests?.find(
        (sp) => sp?.id === request?.[`${PREFIX}requisicaoacademicaid`]
      );

      if (requestSaved) {
        requestAcademicToDelete.push({
          ...requestSaved,
          deliveryDate: moment(requestSaved.deliveryDate),
        });
      } else {
        const peopleRequest = newActivity[
          `${PREFIX}PessoasRequisica_Atividade`
        ]?.filter(
          (pe) =>
            pe?.[`_${PREFIX}requisicao_pessoasenvolvidas_value`] ===
            request?.[`${PREFIX}requisicaoacademicaid`]
        );

        requestAcademicToDelete.push({
          keyId: v4(),
          deleted: true,
          equipments: request[`${PREFIX}Equipamentos`]?.length
            ? request[`${PREFIX}Equipamentos`]?.map(
                (e) => dictTag[e?.[`${PREFIX}etiquetaid`]]
              )
            : [],
          finiteResource: request[
            `${PREFIX}RequisicaoAcademica_Recurso`
          ]?.filter(
            (e) => e?.[`${PREFIX}tiporecurso`] === TYPE_RESOURCE.FINITO
          ),
          infiniteResource: request[
            `${PREFIX}RequisicaoAcademica_Recurso`
          ]?.filter(
            (e) => e?.[`${PREFIX}tiporecurso`] === TYPE_RESOURCE.INFINITO
          ),
          id: request?.[`${PREFIX}requisicaoacademicaid`],
          description: request?.[`${PREFIX}descricao`],
          deadline: request?.[`${PREFIX}prazominimo`],
          other: request?.[`${PREFIX}outro`],
          delivery: request?.[`${PREFIX}momentoentrega`],
          link: request?.[`${PREFIX}link`],
          nomemoodle: request?.[`${PREFIX}nomemoodle`],
          deliveryDate: request?.[`${PREFIX}dataentrega`]
            ? moment(request?.[`${PREFIX}dataentrega`])
            : null,
          people: peopleRequest?.length
            ? peopleRequest?.map((e) => {
                let func = dictTag[e?.[`_${PREFIX}funcao_value`]] || {};
                func.needApprove = func?.[`${PREFIX}Etiqueta_Pai`]?.some(
                  (e) => e?.[`${PREFIX}nome`] === EFatherTag.NECESSITA_APROVACAO
                );
                return {
                  keyId: v4(),
                  id: e[`${PREFIX}pessoasenvolvidasrequisicaoacademicaid`],
                  person: dictPeople[e?.[`_${PREFIX}pessoa_value`]],
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
        });
      }
    });

    activityUndo?.academicRequests?.forEach((e) => {
      const requestSaved = newRequestAcademic?.find(
        (sp) => e?.id === sp?.[`${PREFIX}requisicaoacademicaid`]
      );

      if (!requestSaved) {
        requestAcademicToDelete.push({
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
          spacesToDelete: spaceToDelete,
          user: currentUser?.[`${PREFIX}pessoaid`],
          startTime: moment(activityUndo?.startTime),
          duration: moment(activityUndo?.duration),
          endTime: moment(activityUndo?.endTime),
          startDate: moment(activityUndo?.startDate),
          endDate: moment(activityUndo?.endDate),
          academicRequests: requestAcademicToDelete,
          people: peopleToDelete,
          names: namesToDelete,
          documents: documentsToDelete,
        },
        {
          onSuccess: (actv) => {
            if (undoNextActivities && undoNextActivities.length) {
              const toUpdate = undoNextActivities.map((e) => ({
                id: e?.[`${PREFIX}atividadeid`],
                data: {
                  [`${PREFIX}inicio`]: e?.[`${PREFIX}inicio`],
                  [`${PREFIX}fim`]: e?.[`${PREFIX}fim`],
                  [`${PREFIX}datahorainicio`]: e?.[`${PREFIX}datahorainicio`],
                  [`${PREFIX}datahorafim`]: e?.[`${PREFIX}datahorafim`],
                },
              }));

              batchUpdateActivity(toUpdate, {
                onSuccess: () => {
                  refetch?.();
                  setValuesSetted(false);
                  setActivity(actv);
                  notification.success({
                    title: 'Sucesso',
                    description: 'Ação realizada com sucesso',
                  });
                },
                onError: () => null,
              });
            } else {
              refetch?.();
              setValuesSetted(false);
              setActivity(actv);
              notification.success({
                title: 'Sucesso',
                description: 'Ação realizada com sucesso',
              });
            }
          },
          onError: () => null,
        }
      )
    );
  };

  const approveDetailActivity = () => {
    setDetailLoading(true);
    updateActivity(
      activity[`${PREFIX}atividadeid`],
      {
        [`${PREFIX}DetalhamentoAprovadoPor@odata.bind`]: `/${PERSON}(${
          currentUser?.[`${PREFIX}pessoaid`]
        })`,
        [`${PREFIX}detalhamentodatahoraaprovacao`]: moment().format(),
      },
      {
        onSuccess: (act) => {
          setDetailLoading(false);
          setActivity(act);
          notification.success({
            title: 'Sucesso',
            description: 'Atualização realizada com sucesso',
          });
        },
        onError: (err) => {
          setDetailLoading(false);
          notification.error({
            title: 'Falha',
            description: err?.data?.error?.message,
          });
        },
      }
    );
  };

  const onClose = (e) => {
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
          e?.stopPropagation();
        },
      });
    } else {
      handleResetEditing();
    }
  };

  const handleAproval = (nameField, dateField) => {
    setLoadingApproval({ [nameField]: true });
    updateActivity(
      activity[`${PREFIX}atividadeid`],
      {
        [`${PREFIX}${nameField}@odata.bind`]: `/${PERSON}(${
          currentUser?.[`${PREFIX}pessoaid`]
        })`,
        [`${PREFIX}${dateField}`]: moment().format(),
      },
      {
        onSuccess: (act) => {
          setLoadingApproval({});
          setActivity(act);
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
    updateActivity(
      activity[`${PREFIX}atividadeid`],
      {
        [`${PREFIX}${nameField}@odata.bind`]: null,
        [`${PREFIX}${dateField}`]: null,
      },
      {
        onSuccess: (act) => {
          setLoadingApproval({});
          setActivity(act);
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

  const checkActivityUpdated = (
    savedValues,
    currentValues
  ): { timeChanged: boolean; fieldChanged: boolean } => {
    let timeChanged = false;
    let fieldChanged = false;

    const pastStartTime = savedValues?.startTime?.format('HH:mm');
    const pastDuration = savedValues?.duration?.format('HH:mm');

    const currrentStartTime = currentValues?.startTime?.format('HH:mm');
    const currentDuration = currentValues?.duration?.format('HH:mm');

    if (
      pastDuration !== currentDuration ||
      pastStartTime !== currrentStartTime
    ) {
      timeChanged = true;
    }

    if (
      savedValues.name !== currentValues.name ||
      savedValues.theme !== currentValues.theme ||
      savedValues.description !== currentValues.description ||
      savedValues?.area?.[`${PREFIX}etiquetaid`] !==
        currentValues?.area?.[`${PREFIX}etiquetaid`] ||
      savedValues?.course?.[`${PREFIX}etiquetaid`] !==
        currentValues?.course?.[`${PREFIX}etiquetaid`] ||
      savedValues.academicRequests?.length !==
        currentValues.academicRequests?.length ||
      savedValues.documents?.length !== currentValues.documents?.length
    ) {
      fieldChanged = true;
    }

    return {
      timeChanged,
      fieldChanged: fieldChanged || documentChanged || academicChanged,
    };
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: isModelReference
      ? validationSchemaModel
      : validationSchema,
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnMount: false,
    validateOnChange: false,
    onSubmit: (values) => {
      setValuesSetted(false);
      localStorage.setItem('undoActivity', JSON.stringify(pastValues));
      const isChanged = checkActivityUpdated(pastValues, values);

      let temp = values.temperature;

      if (!temp && team?.[`${PREFIX}Temperatura`]) {
        temp =
          dictTag?.[team?.[`${PREFIX}Temperatura`]?.[`${PREFIX}etiquetaid`]];
      }

      if (
        !temp &&
        activity?.[`${PREFIX}CronogramadeDia_Atividade`]?.length &&
        activity?.[`${PREFIX}CronogramadeDia_Atividade`][0]
      ) {
        const sch = activity?.[`${PREFIX}CronogramadeDia_Atividade`][0];

        temp = dictTag?.[sch?.[`_${PREFIX}_temperatura_value`]];
      }

      if (!temp && program?.[`${PREFIX}Temperatura`]) {
        temp =
          dictTag?.[program?.[`${PREFIX}Temperatura`]?.[`${PREFIX}etiquetaid`]];
      }

      onSave(
        {
          ...activity,
          ...values,
          ...getDates(values),
          ...isChanged,
          temperature: temp,
        },
        () => {
          if (pastValues?.id || pastValues?.[`${PREFIX}atividadeid`]) {
            undo.open('Deseja desfazer a ação?', () => handleUndo());
          }
          // @ts-ignore
          if (formik.values.close) {
            setInitialValues(DEFAULT_VALUES);
            formik.resetForm();
            handleClose();
            setValuesSetted(false);
          }
        }
      );
    },
  });

  const handleSave = () => {
    if (isModelReference || isModel) {
      formik.handleSubmit();
      return;
    }

    const values = formik.values;
    const spacesWarning = [];
    let qtdTeam;

    values.spaces.forEach((space) => {
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

              const schedule =
                activity?.[`${PREFIX}CronogramadeDia_Atividade`][0];

              if (fullTag?.[`${PREFIX}nome`] === EFatherTag.PLANEJAMENTO) {
                notifiers.push({
                  title: 'Alerta uso espaço',
                  link: `${
                    context.pageContext.web.absoluteUrl
                  }/SitePages/Programa.aspx?programid=${
                    program?.[`${PREFIX}programaid`]
                  }&teamid=${team?.[`${PREFIX}turmaid`]}&scheduleId=${
                    team?.[`${PREFIX}cronogramadediaid`]
                  }&activityid=${activity?.[`${PREFIX}atividadeid`]}`,
                  description: `O(s) seguinte(s) espaço(s) ${spacesWarning
                    ?.map((e) => e?.label)
                    .join(' ;')} não possui capacidade suficientes para ${
                    qtdTeam?.[`${PREFIX}quantidade`]
                  }
                    participantes no dia ${moment
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
      });
      return;
    }

    formik.handleSubmit();
  };

  const onLoadModel = async (model) => {
    const fantasyNames = formik.values.names;
    const start = formik.values.startTime;
    const obs = formik.values.observation;
    const duration = moment(model[`${PREFIX}duracao`], 'HH:mm');
    const minDuration = duration?.hour() * 60 + duration?.minute();
    const endTime = start.clone().add(minDuration, 'minutes');

    formik.setFieldValue('duration', duration);
    formik.setFieldValue('endTime', endTime);
    formik.setFieldValue('quantity', model[`${PREFIX}quantidadesessao`] || 0);
    formik.setFieldValue('theme', model[`${PREFIX}temaaula`] || '');
    formik.setFieldValue(
      'observation',
      `${obs || ''} ${model[`${PREFIX}observacao`] || ''}`
    );
    formik.setFieldValue(
      'names',
      fantasyNames
        .concat(
          model[`${PREFIX}Atividade_NomeAtividade`]?.length
            ? model[`${PREFIX}Atividade_NomeAtividade`]?.map((e) => ({
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
              ]
        )
        .filter((e) => e?.name || e?.nameEn || e?.nameEs)
    );
    formik.setFieldValue(
      'description',
      model[`${PREFIX}descricaoobjetivo`] || ''
    );
    formik.setFieldValue(
      'equipments',
      model[`${PREFIX}Atividade_Equipamentos`]?.length
        ? model[`${PREFIX}Atividade_Equipamentos`]?.map(
            (e) => dictTag[e?.[`${PREFIX}etiquetaid`]]
          )
        : []
    );

    formik.setFieldValue(
      'finiteResource',
      model[`${PREFIX}Atividade_RecursoFinitoInfinito`]?.filter(
        (e) => e?.[`${PREFIX}tiporecurso`] === TYPE_RESOURCE.FINITO
      )
    );
    formik.setFieldValue(
      'infiniteResource',
      model[`${PREFIX}Atividade_RecursoFinitoInfinito`]?.filter(
        (e) => e?.[`${PREFIX}tiporecurso`] === TYPE_RESOURCE.INFINITO
      )
    );
    formik.setFieldValue('documents', [
      ...model?.[`${PREFIX}Atividade_Documento`]?.map((document) => ({
        keyId: v4(),
        name: document?.[`${PREFIX}nome`],
        link: document?.[`${PREFIX}link`],
        font: document?.[`${PREFIX}fonte`],
        delivery: document?.[`${PREFIX}entrega`],
      })),
      ...formik?.values?.documents?.map((dc) => ({ ...dc, deleted: true })),
    ]);
    formik.setFieldValue(
      'area',
      model[`${PREFIX}AreaAcademica`]
        ? {
            ...model[`${PREFIX}AreaAcademica`],
            value: model[`${PREFIX}AreaAcademica`]?.[`${PREFIX}etiquetaid`],
            label: model[`${PREFIX}AreaAcademica`]?.[`${PREFIX}nome`],
          }
        : null
    );
    formik.setFieldValue(
      'course',
      model[`${PREFIX}Curso`]
        ? {
            ...model[`${PREFIX}Curso`],
            value: model[`${PREFIX}Curso`]?.[`${PREFIX}etiquetaid`],
            label: model[`${PREFIX}Curso`]?.[`${PREFIX}nome`],
          }
        : null
    );

    const academicRequestModel = await getAcademicRequestsByActivityId(
      model?.[`${PREFIX}atividadeid`]
    );

    const newAcademicRequests = academicRequestModel?.map((request) => {
      const peopleRequest = model[
        `${PREFIX}PessoasRequisica_Atividade`
      ]?.filter(
        (pe) =>
          pe?.[`_${PREFIX}requisicao_pessoasenvolvidas_value`] ===
          request?.[`${PREFIX}requisicaoacademicaid`]
      );

      return {
        keyId: v4(),
        equipments: request[`${PREFIX}Equipamentos`]?.length
          ? request[`${PREFIX}Equipamentos`]?.map(
              (e) => dictTag[e?.[`${PREFIX}etiquetaid`]]
            )
          : [],
        finiteResource: request[`${PREFIX}RequisicaoAcademica_Recurso`]?.filter(
          (e) => e?.[`${PREFIX}tiporecurso`] === TYPE_RESOURCE.FINITO
        ),
        infiniteResource: request[
          `${PREFIX}RequisicaoAcademica_Recurso`
        ]?.filter(
          (e) => e?.[`${PREFIX}tiporecurso`] === TYPE_RESOURCE.INFINITO
        ),
        description: request?.[`${PREFIX}descricao`],
        deadline: request?.[`${PREFIX}prazominimo`],
        observation: request?.[`${PREFIX}observacao`],
        other: request?.[`${PREFIX}outro`],
        delivery: request?.[`${PREFIX}momentoentrega`],
        link: request?.[`${PREFIX}link`],
        nomemoodle: request?.[`${PREFIX}nomemoodle`],
        deliveryDate: request?.[`${PREFIX}dataentrega`]
          ? moment(request?.[`${PREFIX}dataentrega`])
          : null,
        people: peopleRequest?.length
          ? peopleRequest?.map((e) => {
              let func = dictTag[e?.[`_${PREFIX}funcao_value`]] || {};
              func.needApprove = func?.[`${PREFIX}Etiqueta_Pai`]?.some(
                (e) => e?.[`${PREFIX}nome`] === EFatherTag.NECESSITA_APROVACAO
              );
              return {
                keyId: v4(),
                person: dictPeople[e?.[`_${PREFIX}pessoa_value`]],
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
      };
    });

    formik.setFieldValue(
      'academicRequests',
      (formik.values.academicRequests || []).concat(newAcademicRequests)
    );
  };

  const handlePublish = () => {
    setPublishLoading(true);

    updateActivity(
      activity?.[`${PREFIX}atividadeid`],
      {
        [`${PREFIX}publicado`]: !activity?.[`${PREFIX}publicado`],
      },
      {
        onSuccess: (it) => {
          setActivity(it);
          refetch?.();
          setPublishLoading(false);
        },
        onError: () => {
          setPublishLoading(false);
        },
      }
    );
  };

  const handleResetEditing = async () => {
    if (
      activity?.[`_${PREFIX}editanto_value`] !==
      currentUser?.[`${PREFIX}pessoaid`]
    ) {
      setInitialValues(DEFAULT_VALUES);
      formik.resetForm();
      handleClose?.();
      setValuesSetted(false);
      return;
    }
    setEditLoading(true);
    await updateActivity(
      activity?.[`${PREFIX}atividadeid`],
      {
        [`${PREFIX}Editanto@odata.bind`]: null,
        [`${PREFIX}datahoraeditanto`]: null,
      },
      {
        onSuccess: (act) => {
          setInitialValues(DEFAULT_VALUES);
          formik.resetForm();
          handleClose?.();
          setValuesSetted(false);
        },
        onError: () => null,
      }
    );
  };

  const handleEdit = () => {
    setEditLoading(true);
    updateActivity(
      activity?.[`${PREFIX}atividadeid`],
      {
        [`${PREFIX}Editanto@odata.bind`]: `/${PERSON}(${
          currentUser?.[`${PREFIX}pessoaid`]
        })`,
        [`${PREFIX}datahoraeditanto`]: moment().format(),
      },
      {
        onSuccess: (act) => {
          setActivity(act);
          setEditLoading(false);
          setIsDetail(false);
        },
        onError: (e) => {
          console.log(e);
        },
      }
    );
  };

  const handleUpdateData = () => {
    dispatch(fetchAllPerson({}));
    dispatch(fetchAllTags({}));
    dispatch(fetchAllSpace({}));
  };

  const canEdit = React.useMemo(() => {
    const programDirectorTeam = team?.[
      `${PREFIX}Turma_PessoasEnvolvidasTurma`
    ]?.find(
      (env) =>
        env?.[`_${PREFIX}funcao_value`] ===
        programDirector?.[`${PREFIX}etiquetaid`]
    );

    const programDirectorProgram = program?.[
      `${PREFIX}Programa_PessoasEnvolvidas`
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

    const academicDirectorTeam = team?.[
      `${PREFIX}Turma_PessoasEnvolvidasTurma`
    ]?.find(
      (env) =>
        env?.[`_${PREFIX}funcao_value`] ===
        academicDirectorLocal?.[`${PREFIX}etiquetaid`]
    );

    return (
      currentUser?.isPlanning ||
      currentUser?.isTeacher ||
      !activity?.[`${PREFIX}atividadeid`] ||
      programDirectorTeam?.[`_${PREFIX}pessoa_value`] ===
        currentUser?.[`${PREFIX}pessoaid`] ||
      programDirectorProgram?.[`_${PREFIX}pessoa_value`] ===
        currentUser?.[`${PREFIX}pessoaid`] ||
      (coordinatorTeam?.[`_${PREFIX}pessoa_value`] ===
        currentUser?.[`${PREFIX}pessoaid`] &&
        activity?.[`${PREFIX}tipo`] === TYPE_ACTIVITY.ACADEMICA) ||
      (academicDirectorTeam?.[`_${PREFIX}pessoa_value`] ===
        currentUser?.[`${PREFIX}pessoaid`] &&
        activity?.[`${PREFIX}tipo`] === TYPE_ACTIVITY.ACADEMICA) ||
      (isModel &&
        currentUser?.[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]?.some((cUser) =>
          tagsShared?.some(
            (comp) =>
              comp?.[`${PREFIX}etiquetaid`] === cUser?.[`${PREFIX}etiquetaid`]
          )
        )) ||
      currentUser?.[`${PREFIX}pessoaid`] ===
        activity?.[`_${PREFIX}criadopor_value`]
    );
  }, [currentUser, tagsShared]);

  const isAcademicDirector = React.useMemo(() => {
    const academicDirectorTeam = team?.[
      `${PREFIX}Turma_PessoasEnvolvidasTurma`
    ]?.find(
      (env) =>
        env?.[`_${PREFIX}funcao_value`] ===
        academicDirectorLocal?.[`${PREFIX}etiquetaid`]
    );

    return (
      academicDirectorTeam?.[`_${PREFIX}pessoa_value`] ===
      currentUser?.[`${PREFIX}pessoaid`]
    );
  }, [currentUser, tagsShared]);

  const isProgramDirector = React.useMemo(() => {
    const programDirectorProgram = program?.[
      `${PREFIX}Programa_PessoasEnvolvidas`
    ]?.find(
      (env) =>
        env?.[`_${PREFIX}funcao_value`] ===
        programDirector?.[`${PREFIX}etiquetaid`]
    );

    return (
      programDirectorProgram?.[`_${PREFIX}pessoa_value`] ===
      currentUser?.[`${PREFIX}pessoaid`]
    );
  }, [currentUser, tagsShared]);

  const activityTooltip = tooltips.find(
    (tooltip) =>
      tooltip?.Title ===
      (formik.values.type === TYPE_ACTIVITY.ACADEMICA
        ? 'Atividade Acadêmica'
        : formik.values.type === TYPE_ACTIVITY.NON_ACADEMICA
        ? 'Atividade não Acadêmica'
        : 'Atividade Interna')
  );

  const infoParent = React.useMemo(() => {
    const info = [];

    if (program) {
      info.push(program?.[`${PREFIX}NomePrograma`]?.[`${PREFIX}nome`]);
    }

    if (team) {
      info.push(team?.[`${PREFIX}nome`]);
    }

    if (activity?.[`${PREFIX}CronogramadeDia_Atividade`]?.length) {
      info.push(
        moment(activity?.[`${PREFIX}datahorainicio`]).format(
          isModel ? 'DD/MM' : 'DD/MM/YYYY'
        )
      );
    }

    return info.join(' - ');
  }, []);

  return (
    <>
      {handleClose ? (
        <BoxCloseIcon>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </BoxCloseIcon>
      ) : null}

      {openLoad ? (
        <LoadModel
          open={openLoad}
          onClose={() => setOpenLoad(false)}
          onLoadModel={onLoadModel}
        />
      ) : null}

      <Box
        display='flex'
        height='100%'
        flexDirection='column'
        padding={noPadding ? 0 : '2rem'}
        minWidth='30rem'
        style={{ gap: '10px' }}
      >
        <Box display='flex' justifyContent='space-between' paddingRight='2rem'>
          <Box display='flex' alignItems='center' style={{ gap: '10px' }}>
            <Typography
              variant='h6'
              color='textPrimary'
              style={{ fontWeight: 'bold' }}
            >
              {activity?.[`${PREFIX}atividadeid`]
                ? 'Alterar Atividade'
                : 'Cadastrar Atividade'}
            </Typography>

            <HelperTooltip content={activityTooltip?.Conteudo} />

            <Tooltip title='Atualizar'>
              <IconButton onClick={handleUpdateData}>
                <Replay />
              </IconButton>
            </Tooltip>
          </Box>

          {canEdit ? (
            <Box display='flex' alignItems='center' style={{ gap: '2rem' }}>
              {activity?.[`_${PREFIX}editanto_value`] &&
              activity?.[`_${PREFIX}editanto_value`] !==
                currentUser?.[`${PREFIX}pessoaid`] ? (
                <Box>
                  <Typography
                    variant='subtitle2'
                    style={{ fontWeight: 'bold' }}
                  >
                    Outra pessoa está editanto essa atividade
                  </Typography>

                  <Typography variant='subtitle2'>
                    {
                      dictPeople?.[activity?.[`_${PREFIX}editanto_value`]]?.[
                        `${PREFIX}nomecompleto`
                      ]
                    }{' '}
                    -{' '}
                    {moment(activity?.[`${PREFIX}datahoraeditanto`]).format(
                      'DD/MM/YYYY HH:mm:ss'
                    )}
                  </Typography>
                </Box>
              ) : null}

              {!activity?.[`_${PREFIX}editanto_value`] ||
              activity?.[`_${PREFIX}editanto_value`] ===
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
                onClick={() => setOpenLoad(!openLoad)}
              >
                Carregar Atividade
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

        {headerInfo}

        <Box
          flex='1 0 auto'
          overflow='auto'
          maxHeight={
            !isDrawer
              ? maxHeight || 'calc(100vh - 20rem)'
              : 'calc(100vh - 14rem)'
          }
          maxWidth={!isDrawer ? '100%' : '50rem'}
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
                canEdit={canEdit}
                isModel={isModel}
                isModelReference={isModelReference}
                isDraft={isDraft}
                isProgramResponsible={isProgramResponsible}
                isProgramDirector={isProgramDirector}
                isAcademicDirector={isAcademicDirector}
                activityType={formik.values.type}
                tagsOptions={tags}
                currentUser={currentUser}
                spaceOptions={spaces}
                activity={activity}
                detailApproved={
                  !!activity?.[`_${PREFIX}detalhamentoaprovadopor_value`]
                }
                loadingApproval={loadingApproval}
                handleAproval={handleAproval}
                handleEditApproval={handleEditApproval}
                setActivity={setActivity}
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
                {activity?.[`_${PREFIX}aprovacaonomefantasia_value`] && (
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
                      {!isModel && !isDraft && (
                        <>
                          {loadingApproval?.AprovacaoNomeFantasia ? (
                            <CircularProgress size={15} />
                          ) : !isDetail ? (
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
                    {!activity?.[`_${PREFIX}aprovacaonomefantasia_value`] &&
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
                  {!activity?.[`_${PREFIX}aprovacaonomefantasia_value`] ? (
                    <Box display='flex' justifyContent='flex-end'>
                      {loadingApproval?.AprovacaoNomeFantasia ? (
                        <CircularProgress size={15} />
                      ) : !isDetail && !isModel && !isDraft ? (
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
                  canEdit={
                    canEdit &&
                    !activity?.[`_${PREFIX}aprovacaonomefantasia_value`]
                  }
                  isDetail={isDetail}
                  values={formik.values}
                  errors={formik.errors}
                  detailApproved={
                    !!activity?.[`_${PREFIX}detalhamentoaprovadopor_value`]
                  }
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
                canEdit={canEdit}
                isDetail={isDetail}
                isModel={isModel}
                values={formik.values}
                errors={formik.errors}
                activity={activity}
                setActivity={(actv) => {
                  setValuesSetted(false);
                  setActivity(actv);
                }}
                detailApproved={
                  !!activity?.[`_${PREFIX}detalhamentoaprovadopor_value`]
                }
                currentUser={currentUser}
                setValues={formik.setValues}
                setFieldValue={formik.setFieldValue}
              />
            </AccordionDetails>
          </Accordion>

          {formik.values.type === TYPE_ACTIVITY.ACADEMICA && (
            <>
              <Accordion elevation={3} style={{ margin: '.5rem' }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography color='primary' style={{ fontWeight: 'bold' }}>
                    Aula
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Classroom
                    canEdit={canEdit}
                    isDetail={isDetail}
                    isModel={isModel}
                    isDraft={isDraft}
                    activity={activity}
                    isProgramDirector={isProgramDirector}
                    isProgramResponsible={isProgramResponsible}
                    currentUser={currentUser}
                    values={formik.values}
                    errors={formik.errors}
                    detailApproved={
                      !!activity?.[`_${PREFIX}detalhamentoaprovadopor_value`]
                    }
                    handleChange={formik.handleChange}
                    setFieldValue={formik.setFieldValue}
                    loadingApproval={loadingApproval}
                    handleAproval={handleAproval}
                    handleEditApproval={handleEditApproval}
                  />
                </AccordionDetails>
              </Accordion>

              <Accordion elevation={3} style={{ margin: '.5rem' }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography color='primary' style={{ fontWeight: 'bold' }}>
                    Documentos
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box
                    display='flex'
                    flexDirection='column'
                    width='100%'
                    style={{ gap: '10px' }}
                  >
                    {activity?.[`_${PREFIX}aprovacaodocumentos_value`] && (
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
                          {!isModel && !isDraft && !isDetail && (
                            <>
                              {loadingApproval?.AprovacaoDocumentos ? (
                                <CircularProgress size={15} />
                              ) : (
                                <Link
                                  variant='body2'
                                  onClick={() =>
                                    handleEditApproval(
                                      'AprovacaoDocumentos',
                                      'dataaprovacaodocumentos'
                                    )
                                  }
                                  style={{
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                  }}
                                >
                                  Editar
                                </Link>
                              )}
                            </>
                          )}
                        </Box>
                      </Box>
                    )}
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
                        {!activity?.[`_${PREFIX}aprovacaodocumentos_value`] &&
                          !isModel &&
                          !isDetail &&
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
                      {!activity?.[`_${PREFIX}aprovacaodocumentos_value`] ? (
                        <Box display='flex' justifyContent='flex-end'>
                          {loadingApproval?.AprovacaoDocumentos ? (
                            <CircularProgress size={15} />
                          ) : !isModel && !isDraft && !isDetail ? (
                            <Link
                              variant='body2'
                              onClick={() =>
                                handleAproval(
                                  'AprovacaoDocumentos',
                                  'dataaprovacaodocumentos'
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

                    <Documents
                      canEdit={
                        canEdit &&
                        !isDetail &&
                        !activity?.[`_${PREFIX}aprovacaodocumentos_value`]
                      }
                      setDocumentChanged={setDocumentChanged}
                      values={formik.values}
                      detailApproved={
                        !!activity?.[`_${PREFIX}detalhamentoaprovadopor_value`]
                      }
                      setFieldValue={formik.setFieldValue}
                    />
                  </Box>
                </AccordionDetails>
              </Accordion>

              <Accordion elevation={3} style={{ margin: '.5rem' }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography color='primary' style={{ fontWeight: 'bold' }}>
                    Requisição Acadêmica
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box
                    display='flex'
                    flexDirection='column'
                    width='100%'
                    style={{ gap: '10px' }}
                  >
                    {activity?.[`_${PREFIX}aprovacaoreqacademica_value`] && (
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
                          {!isModel && !isDraft && !isDetail && (
                            <>
                              {loadingApproval?.AprovacaoReqAcademica ? (
                                <CircularProgress size={15} />
                              ) : !isModel && !isDraft && !isDetail ? (
                                <Link
                                  variant='body2'
                                  onClick={() =>
                                    handleEditApproval(
                                      'AprovacaoReqAcademica',
                                      'dataaprovacaoreqacademica'
                                    )
                                  }
                                  style={{
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                  }}
                                >
                                  Editar
                                </Link>
                              ) : null}
                            </>
                          )}
                        </Box>
                      </Box>
                    )}
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
                        {!activity?.[`_${PREFIX}aprovacaoreqacademica_value`] &&
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
                      {!activity?.[`_${PREFIX}aprovacaoreqacademica_value`] ? (
                        <Box display='flex' justifyContent='flex-end'>
                          {loadingApproval?.AprovacaoReqAcademica ? (
                            <CircularProgress size={15} />
                          ) : !isModel && !isDraft && !isDetail ? (
                            <Link
                              variant='body2'
                              onClick={() =>
                                handleAproval(
                                  'AprovacaoReqAcademica',
                                  'dataaprovacaoreqacademica'
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
                    <AcademicRequest
                      canEdit={
                        canEdit &&
                        !isDetail &&
                        !activity?.[`_${PREFIX}aprovacaoreqacademica_value`]
                      }
                      setAcademicChanged={setAcademicChanged}
                      values={formik.values}
                      detailApproved={
                        !!activity?.[`_${PREFIX}detalhamentoaprovadopor_value`]
                      }
                      setFieldValue={formik.setFieldValue}
                    />
                  </Box>
                </AccordionDetails>
              </Accordion>
            </>
          )}

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
                    formik.setFieldValue('observation', nextValue.target.value)
                  }
                  value={formik.values.observation}
                />
                <FormHelperText>
                  {formik?.values?.observation?.length || 0}/2000
                </FormHelperText>
              </FormControl>
            </AccordionDetails>
          </Accordion>
        </Box>

        <Box
          width='100%'
          // marginTop='2rem'
          display='flex'
          padding='1rem'
          justifyContent='space-between'
        >
          <Box display='flex' style={{ gap: '10px' }}>
            {/* {activity?.[`${PREFIX}tipoaplicacao`] ===
              EActivityTypeApplication.APLICACAO &&
            !activity?.[`_${PREFIX}detalhamentoaprovadopor_value`] ? (
              <Button
                variant='contained'
                color='secondary'
                disabled={!currentUser?.isTeacher}
                onClick={approveDetailActivity}
              >
                {detailLoading ? (
                  <CircularProgress size={23} style={{ color: '#fff' }} />
                ) : (
                  'Aprovar Detalhamento'
                )}
              </Button>
            ) : activity?.[`_${PREFIX}detalhamentoaprovadopor_value`] ? (
              <Box display='flex' alignItems='center' style={{ gap: '10px' }}>
                <CheckCircle fontSize='small' style={{ color: '#35bb5a' }} />
                <Typography
                  variant='body2'
                  color='primary'
                  style={{ fontWeight: 'bold' }}
                >
                  Detalhamento Aprovado
                </Typography>
              </Box>
            ) : null} */}

            {/* {activity?.[`${PREFIX}tipoaplicacao`] ===
              EActivityTypeApplication.APLICACAO && (
              <Button
                onClick={() => throwToApprove(activity)}
                variant='contained'
                color='secondary'
              >
                Lançar para Aprovação
              </Button>
            )} */}

            {isModelReference &&
            canEdit &&
            activity?.[`${PREFIX}atividadeid`] ? (
              <Button
                variant='contained'
                color='secondary'
                onClick={handlePublish}
                startIcon={
                  activity?.[`${PREFIX}publicado`] ? (
                    <VisibilityOff />
                  ) : (
                    <Visibility />
                  )
                }
              >
                {publishLoading ? (
                  <CircularProgress size={25} style={{ color: '#fff' }} />
                ) : activity?.[`${PREFIX}publicado`] ? (
                  'Despublicar'
                ) : (
                  'Publicar'
                )}
              </Button>
            ) : null}
          </Box>
          <Box display='flex' style={{ gap: '1rem' }}>
            {isDrawer ? (
              <Button color='primary' onClick={onClose}>
                Cancelar
              </Button>
            ) : null}
            <Button
              variant='contained'
              color='primary'
              disabled={
                !canEdit ||
                isDetail ||
                !!activity?.[`_${PREFIX}detalhamentoaprovadopor_value`]
              }
              onClick={handleSave}
            >
              Salvar
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ActivityForm;
