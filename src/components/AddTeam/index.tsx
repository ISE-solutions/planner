import * as React from 'react';
import {
  Box,
  IconButton,
  SwipeableDrawer,
  Typography,
} from '@material-ui/core';
import * as _ from 'lodash';
import * as yup from 'yup';
import { AddOutlined, Close, FileCopyOutlined } from '@material-ui/icons';
import { BoxCloseIcon, OptionCard, StyledCardActionArea } from './styles';
import Form from './Form';
import LoadModel from './LoadModel';
import { PREFIX } from '~/config/database';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { useFormik } from 'formik';
import {
  useActivity,
  useConfirmation,
  useLoggedUser,
  useNotification,
} from '~/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '~/store';
import { createModel } from '~/store/modules/model/actions';
import { TYPE_ORIGIN_MODEL, TYPE_REQUEST_MODEL } from '~/config/constants';
import ModalCreateModel from '../ModalCreateModel';
import * as moment from 'moment';

interface IAddTeam {
  isModel?: boolean;
  isDraft?: boolean;
  isProgramResponsible?: boolean;
  isProgramDirector?: boolean;
  isFinance?: boolean;
  context: WebPartContext;
  open: boolean;
  team: any;
  program?: any;
  refetch?: any;
  teams?: any[];
  company?: string;
  programId?: string;
  teamLength: number;
  setTeam?: (item) => void;
  handleClose: () => void;
}

const OPTION_NEW = 'new';
const OPTION_LOAD = 'load';

const AddTeam: React.FC<IAddTeam> = ({
  open,
  team,
  teams,
  isDraft,
  setTeam,
  refetch,
  company,
  context,
  isModel,
  program,
  isProgramResponsible,
  isProgramDirector,
  isFinance,
  programId,
  handleClose,
}) => {
  const [option, setOption] = React.useState('');
  const [openCreateModel, setOpenCreateModel] = React.useState(false);

  const { tag, person } = useSelector((state: AppState) => state);
  const { tags, dictTag } = tag;
  const { persons, dictPeople } = person;

  const { notification } = useNotification();
  const { confirmation } = useConfirmation();
  const { currentUser } = useLoggedUser();
  const dispatch = useDispatch();

  const validationSchema = yup.object({
    model: yup.mixed().required('Campo Obrigatório'),
    sigla: yup.mixed().required('Campo Obrigatório'),
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
    startDate: yup
      .mixed()
      .when('model', {
        is: !isModel,
        then: yup.mixed().required('Campo Obrigatório'),
      })
      .when('loadDate', {
        is: false,
        then: yup.mixed().required('Campo Obrigatório'),
      }),
  });

  const validationSchemaModel = yup.object({
    model: yup.mixed().required('Campo Obrigatório'),
  });

  const [{ getActivityByTeamId }] = useActivity(
    {
      active: 'Ativo',
    },
    {
      manual: true,
    }
  );

  const handleSetOption = (opt) => {
    setOption(opt);
    formik.resetForm();
  };

  React.useEffect(() => {
    formik.resetForm();
  }, []);

  const formik = useFormik({
    initialValues: {
      startDate: null,
      model: null,
      yearConclusion: '',
      sigla: '',
      loadSpaces: true,
      loadPerson: true,
      loadDate: false,
    },
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnMount: false,
    validateOnChange: false,
    validationSchema: isModel ? validationSchemaModel : validationSchema,
    onSubmit: async (values) => {
      handleCloseOpenCreateModel();
      dispatch(
        createModel(
          {
            Tipo: isModel
              ? TYPE_REQUEST_MODEL.CRIACAO
              : TYPE_REQUEST_MODEL.UTILIZACAO,
            Origem: TYPE_ORIGIN_MODEL.TURMA,
            Nome: '',
            ManterEspacos: values.loadSpaces ? 'Sim' : 'Não',
            ManterPessoas: values.loadPerson ? 'Sim' : 'Não',
            IDOrigem: values.model[`${PREFIX}turmaid`],
            IDPessoa: currentUser?.[`${PREFIX}pessoaid`],
            ManterDatas: values.loadDate ? 'Sim' : 'Não',
            AnoConclusao: parseInt(values.yearConclusion),
            Sigla: values.sigla,
            IDPai: programId,
            DataInicial:
              isModel || values.loadDate
                ? ''
                : values.startDate.format('YYYY-MM-DD'),
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

  const renderOptions = () => (
    <>
      <ModalCreateModel
        values={formik.values}
        setFieldValue={formik.setFieldValue}
        open={openCreateModel}
        onSave={formik.handleSubmit}
        onClose={handleCloseOpenCreateModel}
      />

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

  const onClose = () => {
    handleClose();
    setOption('');
    formik.resetForm();
  };

  return (
    <SwipeableDrawer
      anchor='right'
      open={open}
      onClose={onClose}
      onOpen={() => null}
      disableBackdropClick
    >
      {option === 'new' || !!team ? (
        <Form
          team={team || formik.values.model}
          isDraft={isDraft}
          teams={teams}
          program={program}
          refetch={refetch}
          isModel={isModel}
          company={company}
          setTeam={setTeam}
          isProgramResponsible={isProgramResponsible}
          isProgramDirector={isProgramDirector}
          isFinance={isFinance}
          isLoadModel={!!formik.values.model}
          programId={programId}
          tagsOptions={tags}
          peopleOptions={persons}
          dictTag={dictTag}
          dictPeople={dictPeople}
          getActivityByTeamId={getActivityByTeamId}
          handleClose={onClose}
        />
      ) : (
        <>
          <BoxCloseIcon>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </BoxCloseIcon>

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
                <IconButton onClick={onClose}>
                  <Close />
                </IconButton>
              </BoxCloseIcon>
            </Box>

            <Box>
              {renderOptions()}
              {option === OPTION_LOAD && (
                <LoadModel
                  context={context}
                  isModel={isModel}
                  values={formik.values}
                  errors={formik.errors}
                  setFieldValue={formik.setFieldValue}
                  handleNext={handleCreate}
                />
              )}
            </Box>
          </Box>
        </>
      )}
    </SwipeableDrawer>
  );
};

export default AddTeam;
