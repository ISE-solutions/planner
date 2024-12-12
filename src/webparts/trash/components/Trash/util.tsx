import * as React from 'react';
import { Grid, IconButton, Tooltip } from '@material-ui/core';
import { Restore } from '@material-ui/icons';
import { PREFIX } from '~/config/database';
import { ENTITIES } from './constants';
import * as moment from 'moment';
import { TYPE_ACTIVITY } from '~/config/enums';

const programColumns = [
  {
    name: `${PREFIX}NomePrograma.${PREFIX}nome`,
    label: 'Nome',
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: `${PREFIX}Instituto.${PREFIX}nome`,
    label: 'Instituto',
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: `${PREFIX}Empresa.${PREFIX}nome`,
    label: 'Empresa',
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: `${PREFIX}TipoPrograma.${PREFIX}nome`,
    label: 'Tipo de Programa',
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: `${PREFIX}sigla`,
    label: 'Sigla',
    options: {
      filter: true,
      sort: true,
    },
  },

  {
    name: `deletedon`,
    label: 'Excluído em',
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: 'actions',
    label: 'Ações',
    options: {
      filter: false,
      sort: false,
      setCellHeaderProps: () => ({ align: 'center' }),
      setCellProps: () => ({ align: 'center', style: { minWidth: '13rem' } }),
    },
  },
];

const teamColumns = [
  {
    name: `${PREFIX}nome`,
    label: 'Nome',
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: `${PREFIX}sigla`,
    label: 'Sigla',
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: `${PREFIX}Programa.${PREFIX}nome`,
    label: 'Programa',
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: `${PREFIX}Modalidade.${PREFIX}nome`,
    label: 'Modalidade',
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: `deletedon`,
    label: 'Excluído em',
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: 'actions',
    label: 'Ações',
    options: {
      filter: false,
      sort: false,
      setCellHeaderProps: () => ({ align: 'center' }),
      setCellProps: () => ({ align: 'center', style: { minWidth: '13rem' } }),
    },
  },
];

const scheduleColumns = [
  {
    name: `day`,
    label: 'Dia',
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: `${PREFIX}Turma.${PREFIX}nome`,
    label: 'Turma',
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: `${PREFIX}Modalidade.${PREFIX}nome`,
    label: 'Modalidade',
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: `${PREFIX}Modulo.${PREFIX}nome`,
    label: 'Modulo',
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: `deletedon`,
    label: 'Excluído em',
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: 'actions',
    label: 'Ações',
    options: {
      filter: false,
      sort: false,
      setCellHeaderProps: () => ({ align: 'center' }),
      setCellProps: () => ({ align: 'center', style: { minWidth: '13rem' } }),
    },
  },
];

const activityColumns = [
  {
    name: `${PREFIX}nome`,
    label: 'Nome',
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: `tipo`,
    label: 'Tipo',
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: `start`,
    label: 'Início',
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: `${PREFIX}temaaula`,
    label: 'Tema',
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: `${PREFIX}duracao`,
    label: 'Duração',
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: `deletedon`,
    label: 'Excluído em',
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: 'actions',
    label: 'Ações',
    options: {
      filter: false,
      sort: false,
      setCellHeaderProps: () => ({ align: 'center' }),
      setCellProps: () => ({ align: 'center', style: { minWidth: '13rem' } }),
    },
  },
];

export const COLUMNS_ENTITY = {
  [ENTITIES.TAG]: [
    {
      name: `${PREFIX}nome`,
      label: 'Nome (PT)',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: `${PREFIX}nomeen`,
      label: 'Nome (EN)',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: `${PREFIX}nomees`,
      label: 'Nome (ES)',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: `${PREFIX}descricao`,
      label: 'Descrição',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: `fatherTags`,
      label: 'Etiqueta(s) Pai',
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: `deletedon`,
      label: 'Excluído em',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'actions',
      label: 'Ações',
      options: {
        filter: false,
        sort: false,
        setCellHeaderProps: () => ({ align: 'center' }),
        setCellProps: () => ({
          align: 'center',
          style: { minWidth: '13rem' },
        }),
      },
    },
  ],
  [ENTITIES.PERSON]: [
    {
      name: `${PREFIX}nome`,
      label: 'Nome',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: `${PREFIX}sobrenome`,
      label: 'Sobrenome',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: `${PREFIX}nomepreferido`,
      label: 'Nome Preferido',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: `${PREFIX}email`,
      label: 'E-mail',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: `${PREFIX}emailsecundario`,
      label: 'E-mail Secundário',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: `${PREFIX}celular`,
      label: 'Celular',
      options: {
        filter: true,
      },
    },
    {
      name: `${PREFIX}EscolaOrigem.${PREFIX}nome`,
      label: 'Escola de origem',
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: `deletedon`,
      label: 'Excluído em',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'actions',
      label: 'Ações',
      options: {
        filter: false,
        sort: false,
        setCellHeaderProps: () => ({ align: 'center' }),
        setCellProps: () => ({ align: 'center', style: { minWidth: '13rem' } }),
      },
    },
  ],
  [ENTITIES.SPACE]: [
    {
      name: `${PREFIX}nome`,
      label: 'Nome (PT)',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: `${PREFIX}nomeen`,
      label: 'Nome (EN)',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: `${PREFIX}nomees`,
      label: 'Nome (ES)',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: `${PREFIX}email`,
      label: 'E-mail',
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({ style: { minWidth: '9rem' } }),
      },
    },
    {
      name: `deletedon`,
      label: 'Excluído em',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'actions',
      label: 'Ações',
      options: {
        filter: false,
        sort: false,
        setCellHeaderProps: () => ({ align: 'center' }),
        setCellProps: () => ({ align: 'center', style: { minWidth: '13rem' } }),
      },
    },
  ],
  [ENTITIES.FINITE_RESOURCES]: [
    {
      name: `${PREFIX}nome`,
      label: 'Nome',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: `${PREFIX}limitacao`,
      label: 'Limitação',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: `${PREFIX}quantidade`,
      label: 'Quantidade',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: `${PREFIX}Tipo.${PREFIX}nome`,
      label: 'Tipo',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: `deletedon`,
      label: 'Excluído em',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'actions',
      label: 'Ações',
      options: {
        filter: false,
        sort: false,
        setCellHeaderProps: () => ({ align: 'center' }),
        setCellProps: () => ({ align: 'center', style: { minWidth: '13rem' } }),
      },
    },
  ],
  [ENTITIES.INFINITE_RESOURCES]: [
    {
      name: `${PREFIX}nome`,
      label: 'Nome',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: `${PREFIX}Tipo.${PREFIX}nome`,
      label: 'Tipo',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: `deletedon`,
      label: 'Excluído em',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'actions',
      label: 'Ações',
      options: {
        filter: false,
        sort: false,
        setCellHeaderProps: () => ({ align: 'center' }),
        setCellProps: () => ({ align: 'center', style: { minWidth: '13rem' } }),
      },
    },
  ],
  [ENTITIES.ACADEMIC_ACTIVITY]: [
    {
      name: `${PREFIX}nome`,
      label: 'Nome (PT)',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: `${PREFIX}temaaula`,
      label: 'Tema',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: `${PREFIX}duracao`,
      label: 'Duração',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: `deletedon`,
      label: 'Excluído em',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'actions',
      label: 'Ações',
      options: {
        filter: false,
        sort: false,
        setCellHeaderProps: () => ({ align: 'center' }),
        setCellProps: () => ({ align: 'center', style: { minWidth: '13rem' } }),
      },
    },
  ],
  [ENTITIES.NON_ACADEMIC_ACTIVITY]: [
    {
      name: `${PREFIX}nome`,
      label: 'Nome (PT)',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: `${PREFIX}temaaula`,
      label: 'Tema',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: `${PREFIX}duracao`,
      label: 'Duração',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: `deletedon`,
      label: 'Excluído em',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'actions',
      label: 'Ações',
      options: {
        filter: false,
        sort: false,
        setCellHeaderProps: () => ({ align: 'center' }),
        setCellProps: () => ({ align: 'center', style: { minWidth: '13rem' } }),
      },
    },
  ],
  [ENTITIES.INTERNAL_ACTIVITY]: [
    {
      name: `${PREFIX}nome`,
      label: 'Nome (PT)',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: `${PREFIX}temaaula`,
      label: 'Tema',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: `${PREFIX}duracao`,
      label: 'Duração',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: `deletedon`,
      label: 'Excluído em',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'actions',
      label: 'Ações',
      options: {
        filter: false,
        sort: false,
        setCellHeaderProps: () => ({ align: 'center' }),
        setCellProps: () => ({ align: 'center', style: { minWidth: '13rem' } }),
      },
    },
  ],
  [ENTITIES.PROGRAM]: programColumns,
  [ENTITIES.PROGRAM_MODEL]: programColumns,
  [ENTITIES.TEAM]: teamColumns,
  [ENTITIES.TEAM_MODEL]: teamColumns,
  [ENTITIES.SCHEDULE]: scheduleColumns,
  [ENTITIES.SCHEDULE_MODEL]: scheduleColumns,
  [ENTITIES.ACTIVITY]: activityColumns,
  [ENTITIES.ACTIVITY_MODEL]: activityColumns,
};

export const formatRows = (items, { handleRecovery }) => {
  return items
    ?.filter((e) => e?.[`${PREFIX}excluido`])
    ?.map((e) => ({
      ...e,
      tipo: TYPE_ACTIVITY?.[e?.[`${PREFIX}tipo`]],
      deletedon: moment(e.modifiedon).format('DD/MM/YYYY HH:mm'),
      start: moment(e?.[`${PREFIX}datahorainicio`]).format('DD/MM/YYYY HH:mm'),
      day:
        moment.utc(e?.[`${PREFIX}data`]).format('YYYY') === '2006'
          ? moment.utc(e?.[`${PREFIX}data`]).format('DD/MM')
          : moment.utc(e?.[`${PREFIX}data`]).format('DD/MM/YYYY'),
      fatheres: e?.[`${PREFIX}Etiqueta_Pai`]
        ?.map((e) => e?.[`${PREFIX}nome`])
        ?.join(', '),
      actions: (
        <Grid>
          <Tooltip arrow title='Restaurar'>
            <IconButton
              onClick={() => handleRecovery(e)}
              style={{ padding: '8px' }}
            >
              <Restore />
            </IconButton>
          </Tooltip>
        </Grid>
      ),
    }));
};
