import { PREFIX } from '~/config/database';

export const dateFormat = {
  [`${PREFIX}nome`]: 'DD/MM/YYYY',
  [`${PREFIX}nomeen`]: 'YYYY/MM/DD',
  [`${PREFIX}nomees`]: 'YYYY-MM-DD',
};

export const dateTimeFormat = {
  [`${PREFIX}nome`]: 'DD/MM/YYYY HH:mm:ss',
  [`${PREFIX}nomeen`]: 'YYYY/MM/DD HH:mm:ss',
  [`${PREFIX}nomees`]: 'YYYY-MM-DD HH:mm:ss',
};

export const titleHeader = {
  [`${PREFIX}nome`]: {
    activity: 'Atividade',
    description: 'Descrição',
    responsible: 'Responsável',
    place: 'Local',
  },
  [`${PREFIX}nomeen`]: {
    activity: 'Activity',
    description: 'Description',
    responsible: 'Responsible',
    place: 'Location',
  },
  [`${PREFIX}nomees`]: {
    activity: 'Actividad',
    description: 'Descripción',
    responsible: 'Responsable',
    place: 'Ubicación',
  },
};
