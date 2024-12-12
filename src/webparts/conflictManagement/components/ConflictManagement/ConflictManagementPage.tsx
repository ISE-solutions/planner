import * as React from 'react';
import * as yup from 'yup';
import {
  AccordionVerticalRight,
  ActivityForm,
  Backdrop,
  DontHasPermition,
  Page,
} from '~/components';
import AccordionVertical from '~/components/AccordionVertical';
import Timeline from './../Timeline';
import Filter from './../Filter';
import { useFormik } from 'formik';
import * as moment from 'moment';
import { useLoggedUser, useNotification, useResource } from '~/hooks';
import { Box, CircularProgress, Typography } from '@material-ui/core';
import { PREFIX } from '~/config/database';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '~/store';
import { fetchAllSpace } from '~/store/modules/space/actions';
import {
  getActivity,
  updateActivityAll,
} from '~/store/modules/activity/actions';
import { TitleInfo } from './styles';

interface IConflictManagmentProps {
  context: WebPartContext;
}

const ConflictManagement: React.FC<IConflictManagmentProps> = ({ context }) => {
  const validationSchema = yup.object({
    startDate: yup.mixed().required('Campo Obrigatório'),
    endDate: yup.mixed().required('Campo Obrigatório'),
  });
  const [groups, setGroups] = React.useState([]);
  const [searchClicked, setSearchClicked] = React.useState(false);
  const [loadingActivity, setLoadingActivity] = React.useState(false);
  const [loadingSave, setLoadingSave] = React.useState(false);
  const [openEditArea, setOpenEditArea] = React.useState(false);
  const [activity, setActivity] = React.useState(null);

  const dispatch = useDispatch();
  const { notification } = useNotification();

  const { space, person, tag } = useSelector((state: AppState) => state);
  const { tags, dictTag } = tag;
  const { spaces } = space;
  const { persons } = person;

  React.useEffect(() => {
    dispatch(fetchAllSpace({ active: 'Ativo' }));
  }, []);

  const spacesGroup = React.useMemo(
    () =>
      spaces
        ?.filter((e) => !e?.[`${PREFIX}excluido`] && e[`${PREFIX}ativo`])
        ?.map((space) => ({
          ...space,
          id: space?.[`${PREFIX}espacoid`],
          name: space?.[`${PREFIX}nome`],
          title: space?.[`${PREFIX}nome`],
        })),
    [spaces]
  );

  const personsGroup = React.useMemo(
    () =>
      persons
        ?.filter((e) => !e?.[`${PREFIX}excluido`] && e[`${PREFIX}ativo`])
        ?.map((per) => ({
          ...per,
          id: per?.[`${PREFIX}pessoaid`],
          name: per?.[`${PREFIX}nomecompleto`],
          title: per?.[`${PREFIX}nomecompleto`],
        })),
    [persons]
  );

  const formik = useFormik({
    initialValues: {
      startDate: moment().startOf('month').utc(),
      endDate: moment().endOf('day').utc(),
      typeResource: 'Pessoa',
      tagsFilter: [],
      people: [],
      spaces: [],
      availability: '',
    },
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnMount: false,
    validateOnChange: false,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (!searchClicked) {
        setSearchClicked(true);
      }

      if (values.typeResource === 'Pessoa') {
        if (values.people.length) {
          setGroups(values.people);
        } else {
          setGroups(personsGroup);
        }
      }

      if (values.typeResource === 'Espaço') {
        if (values.spaces.length) {
          setGroups(values.spaces);
        } else {
          setGroups(spacesGroup);
        }
      }

      refetch();
    },
  });

  const [{ resources, loading, refetch }] = useResource({
    startDate: formik.values.startDate,
    endDate: formik.values.endDate,
  });

  const handleActivity = (activityId) => {
    setLoadingActivity(true);
    setOpenEditArea(!openEditArea);

    getActivity(activityId).then((actv) => {
      setLoadingActivity(false);
      setActivity(actv?.value?.[0]);
    });
  };

  const handleSaveActivity = (item, onSuccess?) => {
    setLoadingSave(true);
    const spacesToDelete = item?.[`${PREFIX}Atividade_Espaco`]?.filter(
      (e) => !item.spaces?.some((sp) => sp.value === e[`${PREFIX}espacoid`])
    );
    const equipmentsToDelete = item?.[
      `${PREFIX}Atividade_Equipamentos`
    ]?.filter(
      (e) =>
        !item.equipments?.some((sp) => sp.value === e[`${PREFIX}etiquetaid`])
    );

    const finiteInfiniteResourceToDelete = item?.[
      `${PREFIX}Atividade_RecursoFinitoInfinito`
    ]?.filter(
      (e) =>
        !item.finiteResource?.some(
          (sp) =>
            sp?.[`${PREFIX}recursofinitoinfinitoid`] ===
            e[`${PREFIX}recursofinitoinfinitoid`]
        ) &&
        !item.infiniteResource?.some(
          (sp) =>
            sp?.[`${PREFIX}recursofinitoinfinitoid`] ===
            e[`${PREFIX}recursofinitoinfinitoid`]
        )
    );

    dispatch(
      updateActivityAll(
        {
          ...item,
          spacesToDelete: spacesToDelete,
          equipmentsToDelete: equipmentsToDelete,
          finiteInfiniteResourceToDelete: finiteInfiniteResourceToDelete,
        },
        {
          onSuccess: () => {
            refetch();
            setLoadingSave(false);

            notification.success({
              title: 'Sucesso',
              description: 'Atualização realizada com sucesso',
            });
            onSuccess?.();
          },
          onError: (error) => {
            setLoadingSave(false);
            notification.error({
              title: 'Falha',
              description: error?.data?.error?.message,
            });
          },
        }
      )
    );
  };

  const headActivityInfo = () => (
    <Box paddingLeft='.5rem' style={{ gap: '10px' }}>
      <Box display='flex'>
        <TitleInfo>Programa: </TitleInfo>
        <Typography>
          {
            dictTag?.[
              activity?.[`${PREFIX}Programa`]?.[`_${PREFIX}nomeprograma_value`]
            ]?.[`${PREFIX}nome`]
          }
        </Typography>
      </Box>
      <Box display='flex'>
        <TitleInfo>Turma: </TitleInfo>
        <Typography>
          {activity?.[`${PREFIX}Turma`]?.[`${PREFIX}sigla`]} -{' '}
          {activity?.[`${PREFIX}Turma`]?.[`${PREFIX}nome`]}
        </Typography>
      </Box>
      <Box display='flex'>
        <TitleInfo>Data: </TitleInfo>
        <Typography>
          {moment(activity?.[`${PREFIX}datahorainicio`]).format('DD/MM/YYYY')}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      <Backdrop open={loadingSave}>
        <CircularProgress color='inherit' />
      </Backdrop>

      <Page
        blockOverflow={false}
        context={context}
        itemsBreadcrumbs={[
          { name: 'Gestão de Conflitos', page: 'Gestão de Conflitos' },
        ]}
      >
        <AccordionVertical
          defaultExpanded
          title='Filtro'
          width={300}
          widthClosed='40px'
          expansibleColumn={
            <Filter
              tags={tags}
              loading={false}
              values={formik.values}
              errors={formik.errors}
              persons={personsGroup}
              spaces={spacesGroup}
              setFieldValue={formik.setFieldValue}
              handleFilter={formik.handleSubmit}
            />
          }
        >
          {searchClicked ? (
            <AccordionVerticalRight
              title='Atividade'
              width={580}
              defaultExpanded={openEditArea}
              expansibleColumn={
                <>
                  {loadingActivity ? (
                    <Box
                      display='flex'
                      alignItems='center'
                      justifyContent='center'
                    >
                      <CircularProgress color='primary' />
                    </Box>
                  ) : (
                    <ActivityForm
                      noPadding
                      forceUpdate
                      headerInfo={headActivityInfo()}
                      maxHeight='70%'
                      activity={activity}
                      onSave={handleSaveActivity}
                    />
                  )}
                </>
              }
            >
              <Box marginRight='1rem'>
                <Timeline
                  groups={groups}
                  resources={resources}
                  loading={loading}
                  refetch={refetch}
                  handleActivity={handleActivity}
                  typeResource={formik.values.typeResource}
                  filter={formik.values}
                  setFieldValue={formik.setFieldValue}
                  handleFilter={formik.handleSubmit}
                />
              </Box>
            </AccordionVerticalRight>
          ) : null}
        </AccordionVertical>
      </Page>
    </>
  );
};

export default ConflictManagement;
