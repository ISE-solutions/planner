import * as moment from 'moment';
import { v4 } from 'uuid';
import { PREFIX } from '~/config/database';
import { EFatherTag } from '~/config/enums';

export default (activity, { dictTag, dictSpace, dictPeople }) => {
  return {
    ...activity,
    id: activity[`${PREFIX}atividadeid`],
    title: activity[`${PREFIX}titulo`] || '',
    name: activity[`${PREFIX}nome`] || '',
    startDate: moment(activity[`${PREFIX}datahorainicio`]).format(),
    endDate: moment(activity[`${PREFIX}datahorafim`]).format(),
    startTime:
      (activity[`${PREFIX}inicio`] &&
        moment(activity[`${PREFIX}inicio`], 'HH:mm')) ||
      null,
    duration:
      (activity[`${PREFIX}duracao`] &&
        moment(activity[`${PREFIX}duracao`], 'HH:mm')) ||
      null,
    endTime:
      (activity[`${PREFIX}fim`] && moment(activity[`${PREFIX}fim`], 'HH:mm')) ||
      null,
    quantity: activity[`${PREFIX}quantidadesessao`] || 0,
    typeApplication: activity[`${PREFIX}tipoaplicacao`],
    type: activity[`${PREFIX}tipo`],
    theme: activity[`${PREFIX}temaaula`] || '',
    description: activity[`${PREFIX}descricaoobjetivo`] || '',
    observation: activity[`${PREFIX}observacao`] || '',
    documents: activity?.[`${PREFIX}Atividade_Documento`]?.map((document) => ({
      keyId: v4(),
      id: document?.[`${PREFIX}documentosatividadeid`],
      name: document?.[`${PREFIX}nome`],
      link: document?.[`${PREFIX}link`],
      font: document?.[`${PREFIX}fonte`],
      delivery: document?.[`${PREFIX}entrega`],
    })),
    temperature:
      dictTag?.[activity?.[`${PREFIX}Temperatura`]?.[`${PREFIX}etiquetaid`]] ||
      null,
    academicRequests: [],
    area: activity[`${PREFIX}AreaAcademica`]
      ? {
          ...activity[`${PREFIX}AreaAcademica`],
          value: activity[`${PREFIX}AreaAcademica`]?.[`${PREFIX}etiquetaid`],
          label: activity[`${PREFIX}AreaAcademica`]?.[`${PREFIX}nome`],
        }
      : null,
    course: activity[`${PREFIX}Curso`]
      ? {
          ...activity[`${PREFIX}Curso`],
          value: activity[`${PREFIX}Curso`]?.[`${PREFIX}etiquetaid`],
          label: activity[`${PREFIX}Curso`]?.[`${PREFIX}nome`],
        }
      : null,
    spaces: activity[`${PREFIX}Atividade_Espaco`]?.length
      ? activity[`${PREFIX}Atividade_Espaco`]?.map(
          (e) => dictSpace[e?.[`${PREFIX}espacoid`]]
        )
      : [],
    names: activity[`${PREFIX}Atividade_NomeAtividade`]?.length
      ? activity[`${PREFIX}Atividade_NomeAtividade`]?.map((e) => ({
          keyId: v4(),
          id: e[`${PREFIX}nomeatividadeid`],
          name: e?.[`${PREFIX}nome`],
          nameEn: e?.[`${PREFIX}nomeen`],
          nameEs: e?.[`${PREFIX}nomees`],
          use: dictTag?.[e?.[`_${PREFIX}uso_value`]],
        }))
      : [
          {
            keyId: v4(),
            name: '',
            nameEn: '',
            nameEs: '',
            use: '',
          },
        ],
    people: activity[`${PREFIX}Atividade_PessoasEnvolvidas`]?.length
      ? activity[`${PREFIX}Atividade_PessoasEnvolvidas`]?.map((e) => {
          const func = dictTag[e?.[`_${PREFIX}funcao_value`]] || {};
          func.needApprove = func?.[`${PREFIX}Etiqueta_Pai`]?.some(
            (e) => e?.[`${PREFIX}nome`] === EFatherTag.NECESSITA_APROVACAO
          );
          return {
            ...e,
            keyId: v4(),
            id: e[`${PREFIX}pessoasenvolvidasatividadeid`],
            person: dictPeople[e?.[`_${PREFIX}pessoa_value`]],
            function: func,
          };
        })
      : [
          {
            keyId: v4(),
            person: null,
            function: null,
          },
        ],
  };
};
