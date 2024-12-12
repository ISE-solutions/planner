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
import LoadModel from './LoadModel';
import { PREFIX } from '~/config/database';
import { useLoggedUser } from '~/hooks';
import { useFormik } from 'formik';
import * as moment from 'moment';
import formatActivityModel from '~/utils/formatActivityModel';
import { useSelector } from 'react-redux';
import { AppState } from '~/store';
import { ActivityForm } from '~/components';
import { EActivityTypeApplication, EGroups } from '~/config/enums';

interface IAddActivity {
  open: boolean;
  handleSaveActivity: (item: any, onSuccess: any) => void;
  handleClose: () => void;
}

const OPTION_FORM = 'form';
const OPTION_LOAD_ACTIVITY = 'load_activity';
const OPTION_LOAD_MODEL = 'load_model';

const AddActivity: React.FC<IAddActivity> = ({
  open,
  handleSaveActivity,
  handleClose,
}) => {
  const [option, setOption] = React.useState('');

  const { currentUser } = useLoggedUser();

  const { tag, space, person } = useSelector((state: AppState) => state);
  const { dictTag } = tag;
  const { dictSpace } = space;
  const { dictPeople } = person;

  const onClose = () => {
    handleClose();
    setOption('');
    formik.resetForm();
  };

  const validationSchema = yup.object({
    model: yup.mixed().required('Campo Obrigatório'),
  });

  const myGroup = () => {
    if (currentUser?.isPlanning) {
      return EGroups.PLANEJAMENTO;
    }

    if (currentUser?.isAdmission) {
      return EGroups.ADMISSOES;
    }

    return '';
  };

  const formik = useFormik({
    initialValues: {
      startDate: null,
      model: null,
    },
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnMount: false,
    validateOnChange: false,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      let actv = _.cloneDeep(values.model);

      actv?.[`${PREFIX}Atividade_NomeAtividade`]?.map((item) => {
        delete item[`${PREFIX}nomeatividadeid`];

        return item;
      });

      actv?.[`${PREFIX}Atividade_PessoasEnvolvidas`]?.map((item) => {
        delete item[`${PREFIX}pessoasenvolvidasatividadeid`];

        return item;
      });

      actv?.[`${PREFIX}Atividade_Documento`]?.map((item) => {
        delete item[`${PREFIX}documentosatividadeid`];

        return item;
      });

      delete actv[`${PREFIX}atividadeid`];
      let model: any = {
        ...actv,
        [`${PREFIX}atividadeid`]: null,
        [`${PREFIX}tipoaplicacao`]: EActivityTypeApplication.MODELO_REFERENCIA,
        user: currentUser?.[`${PREFIX}pessoaid`],
        group: myGroup(),
      };

      formik.setFieldValue('model', model);
      setOption(OPTION_FORM);
    },
  });

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
          <StyledCardActionArea onClick={() => setOption(OPTION_LOAD_ACTIVITY)}>
            <AddOutlined color='primary' style={{ fontSize: '3rem' }} />
            <Typography color='primary' variant='body1'>
              Criar
            </Typography>
          </StyledCardActionArea>
        </OptionCard>
        <OptionCard elevation={3}>
          <StyledCardActionArea onClick={() => setOption(OPTION_LOAD_MODEL)}>
            <FileCopyOutlined color='primary' style={{ fontSize: '3rem' }} />
            <Typography color='primary' variant='body1'>
              Usar modelo
            </Typography>
          </StyledCardActionArea>
        </OptionCard>
      </Box>
    </>
  );

  const handleSave = (actv) => {
    handleSaveActivity(
      {
        title: actv.title,
        ...formatActivityModel(actv, moment('2006-01-01', 'YYYY-MM-DD'), {
          isModel: true,
          dictPeople: dictPeople,
          dictSpace: dictSpace,
          dictTag: dictTag,
        }),
      },
      onClose
    );
  };

  return (
    <SwipeableDrawer
      anchor='right'
      open={open}
      onClose={onClose}
      onOpen={() => null}
      disableBackdropClick
    >
      {option === OPTION_FORM ? (
        <ActivityForm
          isModel
          isDrawer
          isModelReference
          handleClose={onClose}
          activity={formik.values.model}
          onSave={handleSave}
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

            <Box marginTop='20%'>
              {renderOptions()}
              {(option === OPTION_LOAD_ACTIVITY ||
                option === OPTION_LOAD_MODEL) && (
                <LoadModel
                  values={formik.values}
                  errors={formik.errors}
                  typeLoad={
                    // @ts-ignore
                    option === OPTION_LOAD_ACTIVITY
                      ? EActivityTypeApplication.PLANEJAMENTO
                      : EActivityTypeApplication.MODELO_REFERENCIA
                  }
                  setFieldValue={formik.setFieldValue}
                  handleNext={formik.handleSubmit}
                />
              )}
            </Box>
          </Box>
        </>
      )}
    </SwipeableDrawer>
  );
};

export default AddActivity;
