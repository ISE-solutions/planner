import * as React from 'react';
import * as yup from 'yup';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import Page from '~/components/Page';
import { useFormik } from 'formik';

import { useSelector, useDispatch } from 'react-redux';
import Filter from './Filter';
import { fetchAllActivities } from '~/store/modules/activity/actions';
import {
  EActivityTypeApplication,
  EDeliveryType,
  EFatherTag,
} from '~/config/enums';
import { PREFIX } from '~/config/database';
import { AppState } from '~/store';
import DayReport from './DayReport';
import ModalImg from './ModalImg';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Box, Button } from '@material-ui/core';
import { FaFilePdf } from 'react-icons/fa';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import PDFService from './PDFService';
import { fetchAllSpace } from '~/store/modules/space/actions';
import { dateFormat } from './constants';
import { setValue } from '~/store/modules/common';
import { EActionType } from '~/store/modules/activity/types';
import { fetchImages } from '~/store/modules/app/actions';
import { Backdrop } from '~/components';

interface ITimeReportPage {
  context: WebPartContext;
}

const TimeReportPage: React.FC<ITimeReportPage> = ({ context }) => {
  const [openGeneratePdf, setOpenGeneratePdf] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [isSubmited, setIsSubmited] = React.useState(false);
  const [language, setLanguage] = React.useState({
    value: `${PREFIX}nome`,
    label: 'Português',
  });
  const dispatch = useDispatch();

  const { activity, tag, person, space } = useSelector(
    (state: AppState) => state
  );
  const { loading: loadingActivity, activities } = activity;
  const { dictPeople } = person;
  const { dictTag } = tag;
  const { dictSpace } = space;

  React.useEffect(() => {
    dispatch(fetchAllSpace({}));
    dispatch(fetchImages());
  }, []);

  const validationSchema = yup.object({
    program: yup.mixed().required('Campo Obrigatório'),
    team: yup.mixed().required('Campo Obrigatório'),
  });

  const formik = useFormik({
    initialValues: {
      program: null,
      team: null,
      schedules: [],
      startDate: null,
      endDate: null,
    },
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnMount: false,
    validateOnChange: false,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsSubmited(true);
      if (values.schedules.length) {
        dispatch(
          fetchAllActivities({
            active: 'Ativo',
            orderBy: `${PREFIX}datahorainicio`,
            order: 'asc',
            startDate: values.startDate,
            endDate: values.endDate,
            schedulesId: values.schedules,
            teamId: values.team?.[`${PREFIX}turmaid`],
            programId: values.program?.[`${PREFIX}programaid`],
            typeApplication: EActivityTypeApplication.APLICACAO,
          })
        );
      } else {
        dispatch(setValue(EActionType.FETCH_ALL_SUCCESS, []));
      }
    },
  });

  const activityName = (act, language) => {
    let name = act?.[`${PREFIX}nome`];
    const fantasyName = act?.[`${PREFIX}Atividade_NomeAtividade`]?.find((e) => {
      const useTag = dictTag?.[e?.[`_${PREFIX}uso_value`]];

      return useTag?.[`${PREFIX}nome`] === EFatherTag.RELATORIO_HORARIO;
    });

    if (fantasyName && language && fantasyName?.[language?.value]) {
      name = fantasyName?.[language?.value];
    }

    return name;
  };

  const academicAreaName = (act, language) => {
    let name = act?.[`${PREFIX}AreaAcademica`]?.[`${PREFIX}nome`];

    const fantasyName = dictTag?.[
      act?.[`${PREFIX}AreaAcademica`]?.[`${PREFIX}etiquetaid`]
    ]?.[`${PREFIX}Etiqueta_NomeEtiqueta`]?.find((e) => {
      const useTag = dictTag?.[e?.[`_${PREFIX}uso_value`]];

      return useTag?.[`${PREFIX}nome`] === EFatherTag.RELATORIO_HORARIO;
    });

    if (fantasyName && language && fantasyName?.[language?.value]) {
      name = fantasyName?.[language?.value];
    }

    return name;
  };

  const moduleName = (module, language) => {
    if (!module) return '';

    let name = module?.[`${PREFIX}nome`];

    const fantasyName = module?.[`${PREFIX}Etiqueta_NomeEtiqueta`]?.find(
      (e) => {
        const useTag = dictTag?.[e?.[`_${PREFIX}uso_value`]];

        return useTag?.[`${PREFIX}nome`] === EFatherTag.RELATORIO_HORARIO;
      }
    );

    if (fantasyName && language && fantasyName?.[language?.value]) {
      name = fantasyName?.[language?.value];
    }

    return name;
  };

  const spaceName = (act, language) => {
    let spaces = act?.[`${PREFIX}Atividade_Espaco`];

    return spaces
      ?.map((sp) => {
        const fantasyName = dictSpace?.[sp?.[`${PREFIX}espacoid`]]?.[
          `${PREFIX}Espaco_NomeEspaco`
        ].find((e) => {
          const useTag = dictTag?.[e?.[`_${PREFIX}uso_value`]];

          return useTag?.[`${PREFIX}nome`] === EFatherTag.RELATORIO_HORARIO;
        });

        if (fantasyName && language && fantasyName?.[language?.value]) {
          return fantasyName?.[language?.value];
        } else {
          return sp?.[`${PREFIX}nome`];
        }
      })
      ?.filter((e) => !!e?.trim())
      ?.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
      ?.join('; ');
  };

  const teamName = (language) => {
    let name = formik.values.team?.[`${PREFIX}nome`];
    const fantasyName = formik.values.team?.[`${PREFIX}Turma_NomeTurma`]?.find(
      (e) => {
        const useTag = dictTag?.[e?.[`_${PREFIX}uso_value`]];

        return useTag?.[`${PREFIX}nome`] === EFatherTag.RELATORIO_HORARIO;
      }
    );

    if (fantasyName && language && fantasyName?.[language?.value]) {
      name = fantasyName?.[language?.value];
    }

    return name;
  };

  const programName = (language) => {
    let name =
      formik.values.program?.[`${PREFIX}NomePrograma`]?.[`${PREFIX}nome`];
    const fantasyName = formik.values.program?.[
      `${PREFIX}Programa_NomePrograma`
    ]?.find((e) => {
      const useTag = dictTag?.[e?.[`_${PREFIX}uso_value`]];

      return useTag?.[`${PREFIX}nome`] === EFatherTag.RELATORIO_HORARIO;
    });

    if (fantasyName && language && fantasyName?.[language?.value]) {
      name = fantasyName?.[language?.value];
    }

    return name;
  };

  const handleGeneratePDF = ({ leftImg, rightImg, centerImg, language }) => {
    setLoading(true);
    let items = activities
      .map((act) => {
        const schedule = act?.[`${PREFIX}CronogramadeDia_Atividade`]?.[0];

        return {
          start: act?.[`${PREFIX}inicio`],
          date: moment(act?.[`${PREFIX}datahorainicio`]).format(
            dateFormat[language.value]
          ),
          module: moduleName(
            dictTag[schedule?.[`_${PREFIX}modulo_value`]] || '',
            language
          ),
          course: dictTag[act?.[`_${PREFIX}curso_value`]]?.[`${PREFIX}nome`] ||
          '',
          timeStart: act?.[`${PREFIX}inicio`],
          timeEnd: act?.[`${PREFIX}fim`],
          name: activityName(act, language) || '',
          theme: act?.[`${PREFIX}temaaula`] || '',
          people: act?.[`${PREFIX}Atividade_PessoasEnvolvidas`]
            ?.filter((ev) => ev?.[`_${PREFIX}pessoa_value`])
            ?.map((envolv) => {
              const p = dictPeople?.[envolv?.[`_${PREFIX}pessoa_value`]];
              const isTeacher = p?.[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]?.find(
                (e) =>
                  e?.[`${PREFIX}nome`]
                    ?.toLocaleLowerCase()
                    .includes(EFatherTag.PROFESSOR.toLocaleLowerCase())
              );

              const pref = isTeacher ? 'Prof. ' : '';
              return `${pref}${p?.[`${PREFIX}nome`] || ''} ${
                p?.[`${PREFIX}sobrenome`] || ''
              }`;
            })
            ?.filter((e) => !!e?.trim())
            .join('; '),
          documents: act?.[`${PREFIX}Atividade_Documento`]
            ?.filter((e) => e?.[`${PREFIX}nome`])
            ?.map(
              (dc) =>
                `${dc?.[`${PREFIX}nome`]} (${
                  EDeliveryType?.[dc?.[`${PREFIX}entrega`]]
                })`
            ),
          academicArea: academicAreaName(act, language),
          spaces: spaceName(act, language),
        };
      })
      ?.sort(
        (a, b) =>
          `${moment(a?.start, 'HH:mm').unix()} ${moment(
            b?.start,
            'HH:mm'
          ).unix()}`
      );

    const itemsGrouped = _.groupBy(items, (e) => e.date);
    let itemsReturn = [];
    Object.keys(itemsGrouped)?.forEach((keyActv) => {
      itemsReturn.push({
        day: keyActv,
        items: itemsGrouped[keyActv],
      });
    });

    itemsReturn = itemsReturn?.sort(
      (a, b) =>
        moment(a?.day, 'DD/MM/YYYY').unix() -
        moment(b?.day, 'DD/MM/YYYY').unix()
    );

    const pdfService = new PDFService(
      leftImg,
      rightImg,
      centerImg,
      itemsReturn,
      teamName(language),
      programName(language),
      language
    );

    pdfService.generatePDF().then(() => {
      setLoading(false);
    });
  };

  const activitiesRender = React.useMemo(() => {
    let items = activities
      .map((act) => {
        const schedule = act?.[`${PREFIX}CronogramadeDia_Atividade`]?.[0];

        return {
          start: act?.[`${PREFIX}inicio`],
          date: moment(act?.[`${PREFIX}datahorainicio`]).format('DD/MM/YYYY'),
          module:
            dictTag[schedule?.[`_${PREFIX}modulo_value`]]?.[`${PREFIX}nome`] ||
            '',
          time: `${act?.[`${PREFIX}inicio`]} - ${act?.[`${PREFIX}fim`]}`,
          name: act?.[`${PREFIX}nome`],
          theme: act?.[`${PREFIX}temaaula`],
          course: dictTag[act?.[`_${PREFIX}curso_value`]]?.[`${PREFIX}nome`] ||
          '',
          people: act?.[`${PREFIX}Atividade_PessoasEnvolvidas`]
            ?.map((envolv) => {
              const p = dictPeople?.[envolv?.[`_${PREFIX}pessoa_value`]];
              const isTeacher = p?.[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]?.find(
                (e) =>
                  e?.[`${PREFIX}nome`]
                    ?.toLocaleLowerCase()
                    .includes(EFatherTag.PROFESSOR.toLocaleLowerCase())
              );
              const pref = isTeacher ? 'Prof. ' : '';

              return `${pref}${p?.[`${PREFIX}nome`] || ''} ${
                p?.[`${PREFIX}sobrenome`] || ''
              }`;
            })
            ?.filter((e) => !!e?.trim())
            .join('; '),
          documents: act?.[`${PREFIX}Atividade_Documento`]
            ?.filter((e) => e?.[`${PREFIX}nome`])
            ?.map(
              (dc) =>
                `${dc?.[`${PREFIX}nome`]} (${
                  EDeliveryType?.[dc?.[`${PREFIX}entrega`]]
                })`
            ),
          academicArea: act?.[`${PREFIX}AreaAcademica`]?.[`${PREFIX}nome`],
          spaces: act?.[`${PREFIX}Atividade_Espaco`]
            ?.map((spc) => spc?.[`${PREFIX}nome`])
            ?.filter((e) => !!e?.trim())
            ?.sort((a, b) =>
              a.localeCompare(b, undefined, { sensitivity: 'base' })
            )
            ?.join('; '),
        };
      })
      ?.sort(
        (a, b) =>
          moment(a?.start, 'HH:mm').unix() - moment(b?.start, 'HH:mm').unix()
      );

    const itemsGrouped = _.groupBy(items, (e) => e.date);
    const itemsReturn = [];
    Object.keys(itemsGrouped)?.forEach((keyActv) => {
      itemsReturn.push({
        day: keyActv,
        items: itemsGrouped[keyActv],
      });
    });

    return itemsReturn?.sort(
      (a, b) =>
        moment(a?.day, 'DD/MM/YYYY').unix() -
        moment(b?.day, 'DD/MM/YYYY').unix()
    );
  }, [activities]);

  return (
    <Page
      context={context}
      blockOverflow={false}
      maxHeight='calc(100vh - 11rem)'
      itemsBreadcrumbs={[
        { name: 'Relatórios', page: '' },
        { name: 'Relatórios de Horário', page: 'Relatórios de Horário' },
      ]}
    >
      <Backdrop open={loading}>
        <CircularProgress color='inherit' />
      </Backdrop>

      <Filter formik={formik} />

      {Object.keys(activitiesRender).length ? (
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Button
            color='primary'
            variant='contained'
            startIcon={<FaFilePdf />}
            onClick={() => setOpenGeneratePdf(true)}
          >
            Gerar PDF
          </Button>

          <Box width='60%'>
            <Typography variant='h6' style={{ fontWeight: 'bold' }}>
              {teamName(language)}
            </Typography>
          </Box>
        </Box>
      ) : null}

      {loadingActivity ? (
        <Box display='flex' alignItems='center' justifyContent='center'>
          <CircularProgress color='primary' />
        </Box>
      ) : activitiesRender?.length ? (
        <Box overflow='auto' maxHeight='calc(100vh - 23rem)'>
          {activitiesRender?.map((e) => (
            <DayReport day={e?.day} items={e?.items} />
          ))}
        </Box>
      ) : isSubmited ? (
        <Box display='flex' justifyContent='center' alignItems='center'>
          <Typography variant='body1'>Não possui registros</Typography>
        </Box>
      ) : null}

      <ModalImg
        open={openGeneratePdf}
        language={language}
        setLanguage={setLanguage}
        generatePDF={handleGeneratePDF}
        onClose={() => setOpenGeneratePdf(false)}
      />
    </Page>
  );
};

export default TimeReportPage;
