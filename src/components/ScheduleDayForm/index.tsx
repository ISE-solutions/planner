import * as React from 'react';
import {
  Box,
  IconButton,
  SwipeableDrawer,
  Typography,
} from '@material-ui/core';
import * as yup from 'yup';
import { AddOutlined, Close, FileCopyOutlined } from '@material-ui/icons';
import { BoxCloseIcon, OptionCard, StyledCardActionArea } from './styles';
import Form from './Form';
import LoadModel from './LoadModel';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import {
  useActivity,
  useConfirmation,
  useLoggedUser,
  useNotification,
} from '~/hooks';
import { PREFIX } from '~/config/database';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '~/store';
import { useFormik } from 'formik';
import { createModel } from '~/store/modules/model/actions';
import { TYPE_ORIGIN_MODEL, TYPE_REQUEST_MODEL } from '~/config/constants';
import { getSchedules } from '~/store/modules/schedule/actions';
import ModalCreateModel from '../ModalCreateModel';

interface IScheduleDayForm {
  visible: boolean;
  isDraft?: boolean;
  titleRequired?: boolean;
  program?: any;
  team?: any;
  isGroup?: boolean;
  isProgramResponsible?: boolean;
  isProgramDirector?: boolean;
  isHeadOfService?: boolean;
  isModel?: boolean;
  isScheduleModel?: boolean;
  context: WebPartContext;
  teamId?: string;
  programId?: string;
  schedule?: any;
  handleClose: (isRefetch?: boolean) => void;
  setSchedule?: (item) => void;
}

const OPTION_NEW = 'new';
const OPTION_LOAD = 'load';

const ScheduleDayForm: React.FC<IScheduleDayForm> = ({
  visible,
  teamId,
  program,
  team,
  isDraft,
  titleRequired = true,
  isGroup,
  isProgramResponsible,
  isProgramDirector,
  isHeadOfService,
  programId,
  isModel,
  isScheduleModel,
  schedule,
  context,
  handleClose,
  setSchedule,
}) => {
  const [option, setOption] = React.useState('');
  const [openCreateModel, setOpenCreateModel] = React.useState(false);

  const [scheduleModel, setScheduleModel] = React.useState(null);
  const [{ getActivity }] = useActivity(
    {},
    {
      manual: true,
    }
  );

  const { notification } = useNotification();
  const { confirmation } = useConfirmation();
  const { currentUser } = useLoggedUser();
  const dispatch = useDispatch();

  const { tag, space, person } = useSelector((state: AppState) => state);
  const { tags, dictTag } = tag;
  const { spaces, dictSpace } = space;
  const { persons, dictPeople } = person;

  React.useEffect(() => {
    formik.resetForm();
  }, []);

  const handleSetOption = (opt) => {
    setOption(opt);
    formik.resetForm();
  };

  const renderOptions = () => (
    <>
      <Box
        padding='2rem'
        minWidth='30rem'
        height='100%'
        display='flex'
        alignItems='center'
        justifyContent='center'
        style={{ gap: '1rem' }}
      >
        <OptionCard elevation={3}>
          <StyledCardActionArea onClick={() => handleSetOption(OPTION_NEW)}>
            <AddOutlined color='primary' style={{ fontSize: '3rem' }} />
            <Typography color='primary' variant='body1'>
              Criar
            </Typography>
          </StyledCardActionArea>
        </OptionCard>
        <OptionCard elevation={3}>
          <StyledCardActionArea onClick={() => handleSetOption(OPTION_LOAD)}>
            <FileCopyOutlined color='primary' style={{ fontSize: '3rem' }} />
            <Typography color='primary' variant='body1'>
              Usar modelo
            </Typography>
          </StyledCardActionArea>
        </OptionCard>
      </Box>
    </>
  );

  const onClose = (isRefetch?: boolean) => {
    handleClose(isRefetch);
    setOption('');
    setScheduleModel(null);
  };

  const handleModel = (model) => {
    let newModel = { ...model };

    setScheduleModel(newModel);
  };

  const validationSchema = yup.object({
    model: yup.mixed().required('Campo Obrigatório'),
    startDate: yup.mixed().required('Campo Obrigatório'),
  });

  const validationSchemaModel = yup.object({
    model: yup.mixed().required('Campo Obrigatório'),
  });

  const formik = useFormik({
    initialValues: {
      startDate: null,
      model: null,
      loadSpaces: true,
      loadPerson: true,
    },
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnMount: false,
    validateOnChange: false,
    validationSchema: isModel ? validationSchemaModel : validationSchema,
    onSubmit: async (values) => {
      handleCloseOpenCreateModel();

      if (!isModel) {
        const schedulesRequest = await getSchedules({
          date: values.startDate.format('YYYY-MM-DD'),
          active: 'Ativo',
          teamId: teamId,
          model: isModel,
          filterTeam: true,
        });

        if (schedulesRequest.length) {
          notification.error({
            title: 'Data já sendo utilizada',
            description: 'O dia informado já possui cadastro, verifique!',
          });
          return;
        }
      }

      dispatch(
        createModel(
          {
            Tipo: isModel
              ? TYPE_REQUEST_MODEL.CRIACAO
              : TYPE_REQUEST_MODEL.UTILIZACAO,
            Origem: TYPE_ORIGIN_MODEL.CRONOGRAMA,
            Nome: '',
            ManterEspacos: values.loadSpaces ? 'Sim' : 'Não',
            ManterPessoas: values.loadPerson ? 'Sim' : 'Não',
            IDOrigem: values.model[`${PREFIX}cronogramadediaid`],
            IDPessoa: currentUser?.[`${PREFIX}pessoaid`],
            IDPai: teamId,
            DataInicial: isModel ? '' : values.startDate.format('YYYY-MM-DD'),
          },
          {
            onSuccess: () => {
              handleClose();
              confirmation.openConfirmation({
                title: 'Criação de modelo',
                yesLabel: 'Fechar',
                showCancel: false,
                description: isModel
                  ? 'Olá, a sua solicitação para criação de um modelo foi iniciada. A mesma poderá demorar alguns minutos. Assim que a criação for concluída você será notificado!'
                  : 'Olá, a sua solicitação para aplicar um modelo foi iniciada. A mesma poderá demorar alguns minutos. Assim que o modelo for aplicado você será notificado!',
                onConfirm: () => null,
              });
            },
            onError: (error) => {
              notification.error({
                title: 'Falha',
                description: error?.data?.error?.message,
              });
            },
          }
        )
      );
    },
  });

  const handleCreate = () => {
    formik.validateForm().then((errors) => {
      if (!Object.keys(errors).length) {
        setOpenCreateModel(true);
      }
    });
  };

  const handleCloseOpenCreateModel = () => {
    setOpenCreateModel(false);
  };

  return (
    <>
      <ModalCreateModel
        values={formik.values}
        setFieldValue={formik.setFieldValue}
        open={openCreateModel}
        onSave={formik.handleSubmit}
        onClose={handleCloseOpenCreateModel}
      />

      <SwipeableDrawer
        anchor='right'
        open={visible}
        onClose={() => onClose()}
        onOpen={() => null}
        disableBackdropClick
      >
        {option === OPTION_NEW || !!schedule ? (
          <Form
            context={context}
            isModel={isModel}
            isDraft={isDraft}
            program={program}
            team={team}
            isGroup={isGroup}
            isProgramResponsible={isProgramResponsible}
            isProgramDirector={isProgramDirector}
            isHeadOfService={isHeadOfService}
            getActivity={getActivity}
            setSchedule={setSchedule}
            setScheduleModel={setScheduleModel}
            isScheduleModel={isScheduleModel}
            isLoadModel={!!scheduleModel}
            schedule={schedule || scheduleModel}
            teamId={teamId}
            programId={programId}
            titleRequired={titleRequired}
            tagsOptions={tags}
            peopleOptions={persons}
            dictTag={dictTag}
            dictPeople={dictPeople}
            dictSpace={dictSpace}
            spaceOptions={spaces}
            handleClose={onClose}
          />
        ) : (
          <Box>
            <Box display='flex' justifyContent='space-between' padding='2rem'>
              <Typography
                variant='h6'
                color='textPrimary'
                style={{ fontWeight: 'bold' }}
              >
                Escolha uma opção
              </Typography>
              <BoxCloseIcon>
                <IconButton onClick={() => onClose()}>
                  <Close />
                </IconButton>
              </BoxCloseIcon>
            </Box>

            <Box marginTop='20%'>
              {renderOptions()}
              {option === OPTION_LOAD && (
                <LoadModel
                  isModel={isModel}
                  isGroup={isGroup}
                  values={formik.values}
                  errors={formik.errors}
                  setFieldValue={formik.setFieldValue}
                  handleNext={handleCreate}
                />
              )}
            </Box>
          </Box>
        )}
      </SwipeableDrawer>
    </>
  );
};

export default ScheduleDayForm;
