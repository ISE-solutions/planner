import * as moment from 'moment';
import { PREFIX } from '~/config/database';
import { v4 } from 'uuid';

export default (item, { dictTag, dictPeople, dictSpace }) => {
  return {
    name: item?.[`${PREFIX}nome`],
    date: item?.[`${PREFIX}data`] ? moment.utc(item?.[`${PREFIX}data`]) : null,
    module: dictTag?.[item?.[`_${PREFIX}modulo_value`]],
    modality: dictTag?.[item?.[`_${PREFIX}modalidade_value`]],
    tool: dictTag?.[item?.[`_${PREFIX}ferramenta_value`]],
    toolBackup: dictTag?.[item?.[`_${PREFIX}ferramentabackup_value`]],
    place: dictTag?.[item?.[`_${PREFIX}local_value`]],
    link: item?.[`${PREFIX}link`],
    linkBackup: item?.[`${PREFIX}linkbackup`],
    temperature:
      dictTag?.[item?.[`${PREFIX}Temperatura`]?.[`${PREFIX}etiquetaid`]] ||
      null,
    observation: item?.[`${PREFIX}observacao`],
    activities: item.activities,
    activitiesToDelete: [],
    people: item[`${PREFIX}CronogramadeDia_PessoasEnvolvidas`]
      .map((e) => ({
        keyId: v4(),
        id: e?.[`${PREFIX}pessoasenvolvidascronogramadiaid`],
        person: dictPeople[e?.[`_${PREFIX}pessoa_value`]],
        function: dictTag[e?.[`_${PREFIX}funcao_value`]],
      }))
      .filter((e) => e),
    locale: item[`${PREFIX}CronogramadeDia_LocalCronogramaDia`]?.length
      ? item[`${PREFIX}CronogramadeDia_LocalCronogramaDia`]?.map((e) => ({
          keyId: v4(),
          id: e?.[`${PREFIX}localcronogramadiaid`],
          space: dictSpace[e?.[`_${PREFIX}espaco_value`]],
          observation: e?.[`${PREFIX}observacao`],
        }))
      : [{ keyId: v4(), person: null, function: null }],
  };
};
