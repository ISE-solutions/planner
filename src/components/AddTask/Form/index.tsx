import 'react-quill/dist/quill.snow.css';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Typography,
} from '@material-ui/core';
import * as _ from 'lodash';
import { Close } from '@material-ui/icons';
import { useFormik } from 'formik';
import * as React from 'react';
import * as yup from 'yup';
import { useConfirmation, useLoggedUser, useNotification } from '~/hooks';
import InfoForm from './InfoForm';
import { PREFIX } from '~/config/database';
import { Backdrop } from '~/components';
import { BoxCloseIcon } from '../styles';
import getKeyEnum from '~/utils/getKeyEnum';
import { PRIORITY_TASK, STATUS_TASK, TYPE_TASK } from '~/config/enums';
import { addOrUpdateTask } from '~/store/modules/task/actions';
import * as moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '~/store';

interface IForm {
  task: any;
  refetch: () => void;
  handleClose: () => void;
  setTeam?: (item) => void;
}

const Form: React.FC<IForm> = ({ task, refetch, setTeam, handleClose }) => {
  const DEFAULT_VALUES = React.useMemo<any>(() => {
    return {
      title: '',
      type: TYPE_TASK.PLANEJAMENTO,
      responsible: [],
      group: '',
      status: '',
      priority: '',
      completionForecast: null,
      concludedDay: null,
      startDay: null,
      program: null,
      team: null,
      activity: null,
      link: '',
      observation: '',
    };
  }, []);

  const [initialValues, setInitialValues] = React.useState<any>(DEFAULT_VALUES);
  const [isDetail, setIsDetail] = React.useState(task);
  const [loading, setLoading] = React.useState(false);
  const [valuesSetted, setValuesSetted] = React.useState(false);
  const [pastValues, setPastValues] = React.useState<any>(DEFAULT_VALUES);

  const { tag } = useSelector((state: AppState) => state);
  const { dictTag } = tag;

  const { notification } = useNotification();
  const { confirmation } = useConfirmation();
  const validationSchema = yup.object({
    title: yup.string().required('Campo Obrigatório'),
    status: yup.mixed().required('Campo Obrigatório'),
    priority: yup.mixed().required('Campo Obrigatório'),
    program: yup.mixed().required('Campo Obrigatório'),
    completionForecast: yup.mixed().required('Campo Obrigatório'),
  });

  const { currentUser } = useLoggedUser();
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (task && !valuesSetted && Object.keys(dictTag)) {
      const companyName =
        dictTag?.[task?.[`${PREFIX}Programa`]?.[`_${PREFIX}empresa_value`]]?.[
          `${PREFIX}nome`
        ];
      const programName =
        dictTag?.[
          task?.[`${PREFIX}Programa`]?.[`_${PREFIX}nomeprograma_value`]
        ]?.[`${PREFIX}nome`];

      const iniVal = {
        createdon: task?.createdon ? moment(task?.createdon) : null,
        title: task[`${PREFIX}nome`] || '',
        type: task[`${PREFIX}tipo`] || '',
        responsible: task[`${PREFIX}tarefas_responsaveis_ise_pessoa`].map(
          (e) => ({
            ...e,
            value: e?.[`${PREFIX}pessoaid`],
            label: e?.[`${PREFIX}nomecompleto`],
          })
        ),
        group: task[`${PREFIX}Grupo`]
          ? {
              ...task[`${PREFIX}Grupo`],
              value: task[`${PREFIX}Grupo`]?.[`${PREFIX}etiquetaid`],
              label: task[`${PREFIX}Grupo`]?.[`${PREFIX}nome`],
            }
          : null,
        program: {
          ...task[`${PREFIX}Programa`],
          label: `${companyName} - ${programName}`,
        },
        team: task[`${PREFIX}Turma`],
        activity: task[`${PREFIX}Atividade`]
          ? {
              ...task[`${PREFIX}Atividade`],
              label: `${moment(
                task?.[`${PREFIX}Atividade`]?.[`${PREFIX}datahorainicio`]
              ).format('DD/MM/YYYY')} - ${
                task?.[`${PREFIX}Atividade`]?.[`${PREFIX}nome`]
              }`,
            }
          : null,
        status:
          {
            value: task.statuscode,
            label: getKeyEnum(STATUS_TASK, task.statuscode),
          } || null,
        priority:
          {
            value: task[`${PREFIX}prioridade`],
            label: getKeyEnum(PRIORITY_TASK, task[`${PREFIX}prioridade`]),
          } || '',
        startDay: task[`${PREFIX}datadeinicio`]
          ? moment(task[`${PREFIX}datadeinicio`])
          : null,
        completionForecast: task[`${PREFIX}previsaodeconclusao`]
          ? moment(task[`${PREFIX}previsaodeconclusao`])
          : null,
        concludedDay: task[`${PREFIX}dataconclusao`]
          ? moment(task[`${PREFIX}dataconclusao`])
          : null,
        link: task[`${PREFIX}link`] || '',
        observation: task[`${PREFIX}observacao`] || '',
      };

      setInitialValues(iniVal);
      setPastValues(iniVal);
      setValuesSetted(true);
    }
  }, [task, dictTag]);

  const onClose = () => {
    if (!_.isEqualWith(pastValues, formik.values)) {
      confirmation.openConfirmation({
        title: 'Dados não alterados',
        description: 'O que deseja?',
        yesLabel: 'Salvar',
        noLabel: 'Sair sem Salvar',
        onConfirm: () => formik.handleSubmit(),
        onCancel: () => {
          setInitialValues(DEFAULT_VALUES);
          formik.resetForm();
          handleClose();
          setValuesSetted(false);
        },
      });
    } else {
      setInitialValues(DEFAULT_VALUES);
      formik.resetForm();
      handleClose();
      setValuesSetted(false);
    }
  };

  const handleSuccess = (newTeam) => {
    setTeam?.(newTeam);
    setLoading(false);
    refetch?.();

    setInitialValues(DEFAULT_VALUES);
    formik.resetForm();
    handleClose();

    notification.success({
      title: 'Sucesso',
      description: 'Cadastro realizado com sucesso',
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
      try {
        setLoading(true);
        const peopleToDelete = task?.[
          `${PREFIX}tarefas_responsaveis_ise_pessoa`
        ]?.filter(
          (e) =>
            !values?.responsible?.some(
              (sp) => sp?.[`${PREFIX}pessoaid`] === e[`${PREFIX}pessoaid`]
            )
        );

        const peopleToNotify = values?.responsible?.filter((res) =>
          task?.[`${PREFIX}tarefas_responsaveis_ise_pessoa`].some(
            (taRes) =>
              taRes?.[`${PREFIX}pessoaid`] !== res?.[`${PREFIX}pessoaid`]
          )
        );

        let deleteTask = false;
        if (
          pastValues?.status?.value === STATUS_TASK.Concluído &&
          pastValues?.status?.value !== values.status?.value
        ) {
          deleteTask = true;
        }

        dispatch(
          addOrUpdateTask(
            {
              ...values,
              peopleToDelete,
              peopleToNotify,
              deleteTask,
              priority: values?.priority?.value,
              status: values?.status?.value,
              startDay: values?.startDay?.format(),
              completionForecast: values?.completionForecast?.format(),
              concludedDay: values?.concludedDay?.format(),
              programId: values?.program?.[`${PREFIX}programaid`],
              teamId: values?.team?.[`${PREFIX}turmaid`],
              activityId: values?.activity?.[`${PREFIX}atividadeid`],
              id: task?.[`${PREFIX}tarefaid`],
            },
            {
              onSuccess: handleSuccess,
              onError: handleError,
            }
          )
        );
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    },
  });

  const canEdit = React.useMemo(() => {
    return (
      currentUser?.isPlanning ||
      task?.[`${PREFIX}tarefas_responsaveis_ise_pessoa`].some(
        (ta) => ta?.[`${PREFIX}pessoaid`] === currentUser?.[`${PREFIX}pessoaid`]
      ) ||
      currentUser?.[`${PREFIX}Pessoa_Etiqueta_Etiqueta`].some(
        (pe) =>
          pe?.[`${PREFIX}etiquetaid`] ===
          task?.[`${PREFIX}Grupo`]?.[`${PREFIX}etiquetaid`]
      )
    );
  }, [currentUser]);

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

      <Box
        display='flex'
        height='100%'
        flexDirection='column'
        padding='2rem'
        minWidth='30rem'
      >
        <Box display='flex' justifyContent='space-between' paddingRight='2rem'>
          <Typography
            variant='h6'
            color='textPrimary'
            style={{ fontWeight: 'bold' }}
          >
            {task?.[`${PREFIX}tarefaid`]
              ? 'Alterar tarefa'
              : 'Cadastrar tarefa'}
          </Typography>

          {canEdit ? (
            <Button
              variant='contained'
              color='primary'
              disabled={!isDetail}
              onClick={() => setIsDetail(false)}
            >
              Editar
            </Button>
          ) : null}
        </Box>

        <Box flex='1 0 auto' overflow='auto' maxHeight='calc(100vh - 12rem)' maxWidth='50rem'>
          <InfoForm
            isDetail={isDetail}
            task={task}
            values={formik.values}
            errors={formik.errors}
            setFieldValue={formik.setFieldValue}
            handleChange={formik.handleChange}
          />
        </Box>
        <Box
          width='100%'
          marginTop='1rem'
          display='flex'
          padding='1rem'
          justifyContent='flex-end'
        >
          <Box display='flex' justifyContent='flex-end' style={{ gap: '1rem' }}>
            <Button color='primary' onClick={onClose}>
              Cancelar
            </Button>
            <Button
              variant='contained'
              color='primary'
              disabled={isDetail}
              onClick={() => !loading && formik.handleSubmit()}
            >
              {loading ? (
                <CircularProgress size={20} style={{ color: '#fff' }} />
              ) : (
                'Salvar'
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Form;
