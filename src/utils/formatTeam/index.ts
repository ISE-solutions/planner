import { v4 } from 'uuid';
import * as moment from 'moment';
import { PREFIX } from './../../config/database';

export default (item, { dictTag, dictPeople }) => {
  return {
    title: item[`${PREFIX}titulo`] || '',
    sigla: item[`${PREFIX}sigla`] || '',
    name: item[`${PREFIX}nome`] || '',
    model: item[`${PREFIX}modelo`],
    teamCode: item[`${PREFIX}codigodaturma`] || '',
    teamName: item[`${PREFIX}nomefinanceiro`] || '',
    mask: item[`${PREFIX}mascara`] || '',
    maskBackup: item[`${PREFIX}mascarabackup`] || '',
    yearConclusion: item[`${PREFIX}anodeconclusao`] || '',
    description: item[`${PREFIX}observacao`] || '',
    modality:
      dictTag?.[item?.[`${PREFIX}Modalidade`]?.[`${PREFIX}etiquetaid`]] || null,
    temperature:
      dictTag?.[item?.[`${PREFIX}Temperatura`]?.[`${PREFIX}etiquetaid`]] ||
      null,
    anexos: [],
    schedules: item.schedules || [],
    names: item[`${PREFIX}Turma_NomeTurma`]?.length
      ? item[`${PREFIX}Turma_NomeTurma`]?.map((e) => ({
          keyId: v4(),
          id: e[`${PREFIX}nometurmaid`],
          name: e?.[`${PREFIX}nome`],
          nameEn: e?.[`${PREFIX}nomeen`],
          nameEs: e?.[`${PREFIX}nomees`],
          use: e?.[`${PREFIX}uso`],
        }))
      : [
          {
            name: '',
            nameEn: '',
            nameEs: '',
            use: '',
          },
        ],
    participants: item[`${PREFIX}Turma_ParticipantesTurma`]?.length
      ? item[`${PREFIX}Turma_ParticipantesTurma`]?.map((e) => ({
          keyId: v4(),
          id: e[`${PREFIX}participantesturmaid`],
          date: e?.[`${PREFIX}data`] && moment.utc(e?.[`${PREFIX}data`]),
          quantity: e?.[`${PREFIX}quantidade`],
          use: e?.[`${PREFIX}uso`],
        }))
      : [
          {
            date: null,
            quantity: '',
            use: '',
          },
        ],
    people: item[`${PREFIX}Turma_PessoasEnvolvidasTurma`]?.length
      ? item[`${PREFIX}Turma_PessoasEnvolvidasTurma`]?.map((e, index) => ({
          keyId: v4(),
          id: e[`${PREFIX}pessoasenvolvidasturmaid`],
          person: dictPeople[e?.[`_${PREFIX}pessoa_value`]],
          function: dictTag[e?.[`_${PREFIX}funcao_value`]],
        }))
      : [
          {
            person: null,
            function: null,
          },
        ],
  };
};
