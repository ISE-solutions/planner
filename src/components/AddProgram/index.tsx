import * as React from 'react';
import {
  Box,
  IconButton,
  SwipeableDrawer,
  Typography,
} from '@material-ui/core';
import * as _ from 'lodash';
import * as yup from 'yup';
import {
  AddOutlined,
  ArrowBack,
  Close,
  FileCopyOutlined,
} from '@material-ui/icons';
import { BoxCloseIcon, OptionCard, StyledCardActionArea } from './styles';
import Form from './Form';
import LoadModel from './LoadModel';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { PREFIX } from '~/config/database';
import { useConfirmation, useLoggedUser, useNotification } from '~/hooks';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '~/store';
import { createModel } from '~/store/modules/model/actions';
import { TYPE_ORIGIN_MODEL, TYPE_REQUEST_MODEL } from '~/config/constants';
import ModalCreateModel from '~/components/ModalCreateModel';
import { getPrograms } from '~/store/modules/program/actions';
import * as moment from 'moment';

interface IAddProgram {
  open: boolean;
  group?: string;
  context: WebPartContext;
  isModel?: boolean;
  isDraft?: boolean;
  isProgramResponsible?: boolean;
  program: any;
  refetchProgram: any;
  handleClose: () => void;
  setProgram: (program) => void;
}

const OPTION_NEW = 'new';
const OPTION_LOAD = 'load';

const AddProgram: React.FC<IAddProgram> = ({
  open,
  group,
  context,
  isModel,
  isDraft,
  isProgramResponsible,
  program,
  refetchProgram,
  setProgram,
  handleClose,
}) => {
  const [option, setOption] = React.useState('');
  const [openCreateModel, setOpenCreateModel] = React.useState(false);

  const { notification } = useNotification();
  const { confirmation } = useConfirmation();
  const { currentUser } = useLoggedUser();
  const dispatch = useDispatch();

  const { tag, person } = useSelector((state: AppState) => state);
  const { tags, dictTag } = tag;
  const { persons, dictPeople } = person;

  const onClose = () => {
    handleClose();
    setOption('');
    formik.resetForm();
  };

  React.useEffect(() => {
    formik.resetForm();
  }, []);

  const teamSchema = yup.object().shape({
    sigla: yup.string().required('Campo Obrigatório'),
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

  const validationSchema = yup.object({
    model: yup.mixed().required('Campo Obrigatório'),
    nameProgram: yup.mixed().required('Campo Obrigatório'),
    startDate: yup.mixed().required('Campo Obrigatório'),
    items: yup.array().of(teamSchema),
  });

  const validationSchemaModel = yup.object({
    model: yup.mixed().required('Campo Obrigatório'),
  });

  const formik = useFormik({
    initialValues: {
      startDate: null,
      loadSpaces: true,
      loadPerson: true,
      nameProgram: null,
      model: null,
      items: [],
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
            Origem: TYPE_ORIGIN_MODEL.PROGRAMA,
            Nome: '',
            Turmas: values.items?.map((te) => ({
              Id: te.id,
              Sigla: te.sigla,
              AnoConclusao: te.yearConclusion,
            })),
            ManterEspacos: values.loadSpaces ? 'Sim' : 'Não',
            ManterPessoas: values.loadPerson ? 'Sim' : 'Não',
            IDOrigem: values.model[`${PREFIX}programaid`],
            IdPrograma: values.nameProgram[`${PREFIX}etiquetaid`],
            IDPessoa: currentUser?.[`${PREFIX}pessoaid`],
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

  const handleSave = () => {
    if (!isModel) {
      getPrograms({
        active: 'Ativo',
        model: false,
        nameProgram: formik.values.nameProgram?.[`${PREFIX}etiquetaid`],
        typeProgram: formik.values.model?.[`_${PREFIX}tipoprograma_value`],
        institute: formik.values.model?.[`_${PREFIX}instituto_value`],
        company: formik.values.model?.[`_${PREFIX}empresa_value`],
      }).then((data) => {
        if (data.length) {
          notification.error({
            title: 'Programa existente',
            description: 'Programa já cadastrado, verifique o nome',
          });
        } else {
          formik.handleSubmit();
        }
      });
    } else {
      formik.handleSubmit();
    }
  };

  const handleCloseOpenCreateModel = () => {
    setOpenCreateModel(false);
  };

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

  return (
    <>
      <ModalCreateModel
        values={formik.values}
        setFieldValue={formik.setFieldValue}
        open={openCreateModel}
        onSave={handleSave}
        onClose={handleCloseOpenCreateModel}
      />

      <SwipeableDrawer
        anchor='right'
        open={open}
        onClose={onClose}
        onOpen={() => null}
        disableBackdropClick
      >
        {option === 'new' || !!program ? (
          <Form
            program={program || formik.values.model}
            isModel={isModel}
            isDraft={isDraft}
            isProgramResponsible={isProgramResponsible}
            setProgram={setProgram}
            isLoadModel={!!formik.values.model}
            tagsOptions={tags}
            peopleOptions={persons}
            dictTag={dictTag}
            dictPeople={dictPeople}
            handleClose={onClose}
            refetchProgram={refetchProgram}
          />
        ) : (
          <>
            <BoxCloseIcon>
              <IconButton onClick={onClose}>
                <Close />
              </IconButton>
            </BoxCloseIcon>
            <Box>
              <Box marginTop='8%'>
                {option === OPTION_LOAD ? (
                  <>
                    <IconButton
                      aria-label='close'
                      onClick={() => handleSetOption('')}
                      style={{ position: 'absolute', left: 8, top: 8 }}
                    >
                      <ArrowBack />
                    </IconButton>

                    <LoadModel
                      context={context}
                      isModel={isModel}
                      values={formik.values}
                      errors={formik.errors}
                      setFieldValue={formik.setFieldValue}
                      handleNext={handleCreate}
                    />
                  </>
                ) : (
                  <>
                    <Box
                      display='flex'
                      justifyContent='space-between'
                      padding='2rem'
                    >
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
                    {renderOptions()}
                  </>
                )}
              </Box>
            </Box>
          </>
        )}
      </SwipeableDrawer>
    </>
  );
};

export default AddProgram;
