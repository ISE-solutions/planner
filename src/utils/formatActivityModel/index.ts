import { v4 } from 'uuid';
import * as moment from 'moment';
import { PREFIX } from '~/config/database';
import { EActivityTypeApplication, TYPE_RESOURCE } from '~/config/enums';
import momentToMinutes from '~/utils/momentToMinutes';
import getDurationMoment from '../getDurationMoment';
import * as _ from 'lodash';

export default (
  item,
  date,
  { isModel, dictTag, dictSpace, dictPeople, temp = null }
) => {
  const getDates = (item) => {
    const dateRef = date?.clone().format('YYYY-MM-DD');
    let startTime = moment().format('HH:mm');

    if (item?.[`${PREFIX}inicio`]) {
      startTime = item?.[`${PREFIX}inicio`];
    }

    const startDate = moment(`${dateRef} ${startTime}`);

    const momentDuration = moment(item?.[`${PREFIX}duracao`], 'HH:mm');
    const minutes = momentToMinutes(momentDuration);

    return {
      startDate: startDate.format(),
      endDate: startDate.clone().add(minutes, 'minutes').format(),
    };
  };

  const { startDate, endDate } = getDates(item);

  return {
    ...getDates(item),
    teamId: item?.teamId,
    programId: item?.programId,
    name: item?.[`${PREFIX}nome`] || '',
    type: item?.[`${PREFIX}tipo`] || '',
    typeApplication: isModel
      ? EActivityTypeApplication.MODELO
      : EActivityTypeApplication.APLICACAO,
    theme: item?.[`${PREFIX}temaaula`] || '',
    startTime:
      (item?.[`${PREFIX}inicio`] &&
        moment(item?.[`${PREFIX}inicio`], 'HH:mm')) ||
      moment(startDate),
    endTime:
      (item?.[`${PREFIX}fim`] && moment(item?.[`${PREFIX}fim`], 'HH:mm')) ||
      moment(endDate),
    description: item?.[`${PREFIX}descricaoobjetivo`] || '',
    observation: item?.[`${PREFIX}observacao`] || '',
    duration:
      (item?.[`${PREFIX}duracao`] &&
        moment(item?.[`${PREFIX}duracao`], 'HH:mm')) ||
      getDurationMoment(moment(startDate), moment(endDate)),
    quantity: item?.[`${PREFIX}quantidadesessao`] || 0,
    area: item?.[`${PREFIX}AreaAcademica`]
      ? {
          ...item?.[`${PREFIX}AreaAcademica`],
          value: item?.[`${PREFIX}AreaAcademica`]?.[`${PREFIX}etiquetaid`],
          label: item?.[`${PREFIX}AreaAcademica`]?.[`${PREFIX}nome`],
        }
      : null,
    course: item[`${PREFIX}Curso`]
      ? {
          ...item[`${PREFIX}Curso`],
          value: item[`${PREFIX}Curso`]?.[`${PREFIX}etiquetaid`],
          label: item[`${PREFIX}Curso`]?.[`${PREFIX}nome`],
        }
      : null,
    spaces: _.has(item, 'spaces')
      ? item?.spaces
      : item?.[`${PREFIX}Atividade_Espaco`]?.length
      ? item?.[`${PREFIX}Atividade_Espaco`]
          .map((e) => dictSpace[e?.[`${PREFIX}espacoid`]])
          .filter((e) => e)
      : [],
    spacesToDelete: item?.spacesToDelete || [],
    names: item?.[`${PREFIX}Atividade_NomeAtividade`]?.map((e) => ({
      name: e?.[`${PREFIX}nome`],
      nameEn: e?.[`${PREFIX}nomeen`],
      nameEs: e?.[`${PREFIX}nomees`],
      use: e?.[`${PREFIX}uso`],
    })),
    academicRequests: item?.[`${PREFIX}RequisicaoAcademica_Atividade`]?.map(
      (request) => {
        const peopleRequest = item?.[
          `${PREFIX}PessoasRequisica_Atividade`
        ]?.filter(
          (pe) =>
            pe?.[`_${PREFIX}requisicao_pessoasenvolvidas_value`] ===
            request?.[`${PREFIX}requisicaoacademicaid`]
        );

        return {
          keyId: v4(),
          id: request?.[`${PREFIX}requisicaoacademicaid`],
          description: request?.[`${PREFIX}descricao`],
          deadline: request?.[`${PREFIX}prazominimo`],
          delivery: request?.[`${PREFIX}momentoentrega`],
          deliveryDate: request?.[`${PREFIX}dataentrega`]
            ? moment(request?.[`${PREFIX}dataentrega`])
            : null,
          people: peopleRequest?.length
            ? peopleRequest.map((e) => ({
                keyId: v4(),
                id: e[`${PREFIX}pessoasenvolvidasrequisicaoacademicaid`],
                person: dictPeople[e?.[`_${PREFIX}pessoa_value`]],
                function: dictTag[e?.[`_${PREFIX}funcao_value`]],
              }))
            : [
                {
                  keyId: v4(),
                  person: null,
                  function: null,
                },
              ],
        };
      }
    ),
    documents: item?.[`${PREFIX}Atividade_Documento`]?.map((e) => ({
      name: e?.[`${PREFIX}nome`],
      link: e?.[`${PREFIX}link`],
      font: e?.[`${PREFIX}fonte`],
      delivery: e?.[`${PREFIX}entrega`],
    })),
    resources: item?.[`${PREFIX}recursos_Atividade`],
    equipments: item?.[`${PREFIX}Atividade_Equipamentos`],
    finiteResource: item?.[`${PREFIX}Atividade_RecursoFinitoInfinito`]?.filter(
      (e) => e?.[`${PREFIX}tiporecurso`] === TYPE_RESOURCE.FINITO
    ),
    temperature: item?.[`${PREFIX}Temperatura`]
      ? {
          ...item?.[`${PREFIX}Temperatura`],
          value: item?.[`${PREFIX}Temperatura`]?.[`${PREFIX}etiquetaid`],
          label: item?.[`${PREFIX}Temperatura`]?.[`${PREFIX}nome`],
        }
      : temp,
    infiniteResource: item?.[
      `${PREFIX}Atividade_RecursoFinitoInfinito`
    ]?.filter((e) => e?.[`${PREFIX}tiporecurso`] === TYPE_RESOURCE.INFINITO),
    people: item?.people
      ? item?.people
      : item?.[`${PREFIX}Atividade_PessoasEnvolvidas`]
          ?.map((e) => ({
            person: dictPeople[e?.[`_${PREFIX}pessoa_value`]],
            function: dictTag[e?.[`_${PREFIX}funcao_value`]],
          }))
          ?.filter((e) => e),
  };
};
