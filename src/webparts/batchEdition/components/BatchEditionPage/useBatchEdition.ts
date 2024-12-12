import * as _ from 'lodash';
import * as moment from 'moment';
import * as React from 'react';
import { v4 } from 'uuid';
import { PREFIX } from '~/config/database';
import { EFatherTag, TYPE_ACTIVITY_LABEL, TYPE_RESOURCE } from '~/config/enums';

const useBatchEdition = ({
  tags,

  finiteInfiniteResources,
}) => {
  const temperatureOptions = React.useMemo(
    () =>
      tags?.filter(
        (tag) =>
          tag?.[`${PREFIX}ativo`] &&
          tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
            (e) => e?.[`${PREFIX}nome`] === EFatherTag.TEMPERATURA_STATUS
          )
      ),
    [tags]
  );

  const modalityOptions = React.useMemo(
    () =>
      tags?.filter((tag) =>
        tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
          (e) => e?.[`${PREFIX}nome`] === EFatherTag.MODALIDADE_TURMA
        )
      ),
    [tags]
  );

  const modalityDayOptions = React.useMemo(
    () =>
      tags?.filter((tag) =>
        tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
          (e) => e?.[`${PREFIX}nome`] === EFatherTag.MODALIDADE_DIA
        )
      ),
    [tags]
  );

  const moduleOptions = React.useMemo(
    () =>
      tags?.filter((tag) =>
        tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
          (e) => e?.[`${PREFIX}nome`] === EFatherTag.MODULO
        )
      ),
    [tags]
  );

  const areaOptions = React.useMemo(
    () =>
      tags?.filter((tag) =>
        tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
          (e) => e?.[`${PREFIX}nome`] === EFatherTag.AREA_ACADEMICA
        )
      ),
    [tags]
  );

  const courseOptions = React.useMemo(
    () =>
      tags?.filter((tag) =>
        tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
          (e) => e?.[`${PREFIX}nome`] === EFatherTag.COURSE
        )
      ),
    [tags]
  );

  const functionOptions = React.useMemo(
    () =>
      tags?.filter((tag) =>
        tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
          (e) => e?.[`${PREFIX}nome`] === EFatherTag.FUNCAO
        )
      ),
    [tags]
  );

  const useOptions = React.useMemo(
    () =>
      tags?.filter(
        (tag) =>
          tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
            (e) => e?.[`${PREFIX}nome`] === EFatherTag.USO_RELATORIO
          ) &&
          !tag?.[`${PREFIX}excluido`] &&
          tag?.[`${PREFIX}ativo`]
      ),
    [tags]
  );

  const useParticipantsOptions = React.useMemo(
    () =>
      tags?.filter(
        (tag) =>
          tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
            (e) => e?.[`${PREFIX}nome`] === EFatherTag.USO_PARTICIPANTE
          ) &&
          !tag?.[`${PREFIX}excluido`] &&
          tag?.[`${PREFIX}ativo`]
      ),
    [tags]
  );

  const equipmentsOptions = React.useMemo(
    () =>
      tags?.filter((tag) =>
        tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
          (e) => e?.[`${PREFIX}nome`] === EFatherTag.EQUIPAMENTO_OUTROS
        )
      ),
    [tags]
  );

  const finiteResources = React.useMemo(
    () =>
      finiteInfiniteResources?.filter(
        (e) => e?.[`${PREFIX}tiporecurso`] === TYPE_RESOURCE.FINITO
      ),
    [finiteInfiniteResources]
  );

  const infiniteResources = React.useMemo(
    () =>
      finiteInfiniteResources?.filter(
        (e) => e?.[`${PREFIX}tiporecurso`] === TYPE_RESOURCE.INFINITO
      ),
    [finiteInfiniteResources]
  );

  const buildInitDate = ({
    dictTag,
    setTeam,
    reset,
    dictPeople,
    dictSpace,
    teamSaved,
    schedules,
    activities,
    requestsAcademic,
  }) => {
    let schls = schedules
      ?.map((scheduleDay) => {
        return {
          id: scheduleDay?.[`${PREFIX}cronogramadediaid`],
          modeloid: scheduleDay.modeloid,
          baseadoemcronogramadiamodelo:
            scheduleDay.baseadoemcronogramadiamodelo,
          name: scheduleDay?.[`${PREFIX}nome`] || '',
          date: moment.utc(scheduleDay?.[`${PREFIX}data`]),
          module: dictTag?.[scheduleDay?.[`_${PREFIX}modulo_value`]],
          modality: dictTag?.[scheduleDay?.[`_${PREFIX}modalidade_value`]],
          tool: dictTag?.[scheduleDay?.[`_${PREFIX}ferramenta_value`]],
          isGroupActive: scheduleDay?.[`${PREFIX}agrupamentoatividade`],
          startTime:
            (scheduleDay[`${PREFIX}inicio`] &&
              moment(scheduleDay[`${PREFIX}inicio`], 'HH:mm')) ||
            null,
          endTime:
            (scheduleDay[`${PREFIX}fim`] &&
              moment(scheduleDay[`${PREFIX}fim`], 'HH:mm')) ||
            null,
          duration:
            (scheduleDay[`${PREFIX}duracao`] &&
              moment(scheduleDay[`${PREFIX}duracao`], 'HH:mm')) ||
            null,
          toolBackup:
            dictTag?.[scheduleDay?.[`_${PREFIX}ferramentabackup_value`]],
          link: scheduleDay?.[`${PREFIX}link`],
          temperature:
            dictTag?.[
              scheduleDay?.[`${PREFIX}Temperatura`]?.[`${PREFIX}etiquetaid`]
            ] || null,
          linkBackup: scheduleDay?.[`${PREFIX}linkbackup`],
          observation: scheduleDay?.[`${PREFIX}observacao`],
          people: scheduleDay[`${PREFIX}CronogramadeDia_PessoasEnvolvidas`]
            ?.length
            ? scheduleDay[`${PREFIX}CronogramadeDia_PessoasEnvolvidas`]?.map(
                (e) => {
                  const func = dictTag[e?.[`_${PREFIX}funcao_value`]] || {};
                  func.needApprove = func?.[`${PREFIX}Etiqueta_Pai`]?.some(
                    (e) =>
                      e?.[`${PREFIX}nome`] === EFatherTag.NECESSITA_APROVACAO
                  );

                  return {
                    keyId: v4(),
                    id: e?.[`${PREFIX}pessoasenvolvidascronogramadiaid`],
                    person: dictPeople[e?.[`_${PREFIX}pessoa_value`]],
                    function: func,
                  };
                }
              )
            : [{ keyId: v4(), person: null, function: null }],
          locale: scheduleDay[`${PREFIX}CronogramadeDia_LocalCronogramaDia`]
            ?.length
            ? scheduleDay[`${PREFIX}CronogramadeDia_LocalCronogramaDia`]?.map(
                (e) => ({
                  keyId: v4(),
                  id: e?.[`${PREFIX}localcronogramadiaid`],
                  space: dictSpace[e?.[`_${PREFIX}espaco_value`]],
                  observation: e?.[`${PREFIX}observacao`],
                })
              )
            : [{ keyId: v4(), person: null, function: null }],
        };
      })
      ?.sort((left, right) => left?.date.diff(right?.date));

    let actvs = activities
      ?.sort(
        (a, b) =>
          moment(a?.[`${PREFIX}datahorainicio`]).unix() -
          moment(b?.[`${PREFIX}datahorainicio`]).unix()
      )
      ?.map((activity) => {
        const st =
          (activity[`${PREFIX}inicio`] &&
            moment(activity[`${PREFIX}inicio`], 'HH:mm')) ||
          null;
        const et =
          (activity[`${PREFIX}fim`] &&
            moment(activity[`${PREFIX}fim`], 'HH:mm')) ||
          null;
        const d =
          (activity[`${PREFIX}duracao`] &&
            moment(activity[`${PREFIX}duracao`], 'HH:mm')) ||
          null;

        const sp = activity[`${PREFIX}Atividade_Espaco`]?.length
          ? activity[`${PREFIX}Atividade_Espaco`]?.map(
              (e) => dictSpace[e?.[`${PREFIX}espacoid`]]
            )
          : [];

        return {
          id: activity?.[`${PREFIX}atividadeid`],
          title: activity[`${PREFIX}titulo`] || '',
          name: activity[`${PREFIX}nome`] || '',
          nameObj: {
            value: activity[`${PREFIX}nome`],
            [`${PREFIX}tipo`]: activity[`${PREFIX}tipo`],
          },
          startTime: st,
          duration: d,
          endTime: et,
          date: moment(activity?.[`${PREFIX}datahorainicio`]).format(
            'DD/MM/YYYY'
          ),
          startTimeString: st.format('HH:mm'),
          durationString: d.format('HH:mm'),
          endTimeString: et.format('HH:mm'),
          spacesString: sp.map((sp) => sp.label).join(' '),
          scheduleId: activity?.[`_${PREFIX}cronogramadia_value`],
          startDate: moment(activity?.[`${PREFIX}datahorainicio`]),
          endDate: moment(activity?.[`${PREFIX}datahorafim`]),
          quantity: activity[`${PREFIX}quantidadesessao`] || 0,
          typeApplication: activity[`${PREFIX}tipoaplicacao`],
          type: activity[`${PREFIX}tipo`],
          typeLabel: TYPE_ACTIVITY_LABEL?.[activity[`${PREFIX}tipo`]],
          theme: activity[`${PREFIX}temaaula`] || '',
          description: activity[`${PREFIX}descricaoobjetivo`] || '',
          observation: activity[`${PREFIX}observacao`] || '',
          documents: activity?.[`${PREFIX}Atividade_Documento`]?.map(
            (document) => ({
              keyId: v4(),
              id: document?.[`${PREFIX}documentosatividadeid`],
              name: document?.[`${PREFIX}nome`],
              link: document?.[`${PREFIX}link`],
              font: document?.[`${PREFIX}fonte`],
              fonte: document?.[`${PREFIX}fonte`]?.toLocaleUpperCase(),
              delivery: document?.[`${PREFIX}entrega`],
            })
          ),
          temperature:
            dictTag?.[
              activity?.[`${PREFIX}Temperatura`]?.[`${PREFIX}etiquetaid`]
            ] || null,
          lastTemperature:
            activity?.[`${PREFIX}Temperatura`]?.[`${PREFIX}etiquetaid`],
          academicRequests: requestsAcademic
            ?.filter(
              (e) =>
                e?.[`_${PREFIX}requisicaoacademica_atividade_value`] ===
                activity?.[`${PREFIX}atividadeid`]
            )
            ?.map((request) => {
              const peopleRequest = activity[
                `${PREFIX}PessoasRequisica_Atividade`
              ]?.filter(
                (pe) =>
                  pe?.[`_${PREFIX}requisicao_pessoasenvolvidas_value`] ===
                  request?.[`${PREFIX}requisicaoacademicaid`]
              );

              return {
                keyId: v4(),
                equipments: request[`${PREFIX}Equipamentos`]?.length
                  ? request[`${PREFIX}Equipamentos`]?.map(
                      (e) => dictTag[e?.[`${PREFIX}etiquetaid`]]
                    )
                  : [],
                finiteResource: request[`${PREFIX}RequisicaoAcademica_Recurso`]
                  ?.filter(
                    (e) => e?.[`${PREFIX}tiporecurso`] === TYPE_RESOURCE.FINITO
                  )
                  ?.map((e) => ({
                    ...e,
                    label: e?.[`${PREFIX}nome`],
                    value: e?.[`${PREFIX}recursofinitoinfinitoid`],
                  })),
                infiniteResource: request[
                  `${PREFIX}RequisicaoAcademica_Recurso`
                ]
                  ?.filter(
                    (e) =>
                      e?.[`${PREFIX}tiporecurso`] === TYPE_RESOURCE.INFINITO
                  )
                  ?.map((e) => ({
                    ...e,
                    label: e?.[`${PREFIX}nome`],
                    value: e?.[`${PREFIX}recursofinitoinfinitoid`],
                  })),
                id: request?.[`${PREFIX}requisicaoacademicaid`],
                description: request?.[`${PREFIX}descricao`],
                deadline: request?.[`${PREFIX}prazominimo`],
                other: request?.[`${PREFIX}outro`],
                delivery: request?.[`${PREFIX}momentoentrega`],
                link: request?.[`${PREFIX}link`],
                nomemoodle: request?.[`${PREFIX}nomemoodle`],
                deliveryDate: request?.[`${PREFIX}dataentrega`]
                  ? moment(request?.[`${PREFIX}dataentrega`])
                  : null,
                people: peopleRequest?.length
                  ? peopleRequest?.map((e) => {
                      let func = dictTag[e?.[`_${PREFIX}funcao_value`]] || {};
                      func.needApprove = func?.[`${PREFIX}Etiqueta_Pai`]?.some(
                        (e) =>
                          e?.[`${PREFIX}nome`] ===
                          EFatherTag.NECESSITA_APROVACAO
                      );
                      return {
                        keyId: v4(),
                        id: e[
                          `${PREFIX}pessoasenvolvidasrequisicaoacademicaid`
                        ],
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
            }),
          area: activity[`${PREFIX}AreaAcademica`]
            ? {
                ...activity[`${PREFIX}AreaAcademica`],
                value:
                  activity[`${PREFIX}AreaAcademica`]?.[`${PREFIX}etiquetaid`],
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
          spaces: sp,
          pastSpaces: activity[`${PREFIX}Atividade_Espaco`]?.length
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
      });

    const te = {
      id: teamSaved?.[`${PREFIX}turmaid`],
      title: teamSaved[`${PREFIX}titulo`] || '',
      baseadoemmodeloturma: teamSaved?.baseadoemmodeloturma,
      modeloid: teamSaved?.modeloid,
      sigla: teamSaved[`${PREFIX}sigla`] || '',
      name: teamSaved[`${PREFIX}nome`] || '',
      model: teamSaved[`${PREFIX}modelo`],
      teamCode: teamSaved[`${PREFIX}codigodaturma`] || '',
      teamName: teamSaved[`${PREFIX}nomefinanceiro`] || '',
      mask: teamSaved[`${PREFIX}mascara`] || '',
      maskBackup: teamSaved[`${PREFIX}mascarabackup`] || '',
      yearConclusion: teamSaved[`${PREFIX}anodeconclusao`] || '',
      description: teamSaved[`${PREFIX}observacao`] || '',
      concurrentActivity: teamSaved[`${PREFIX}atividadeconcorrente`],
      modality:
        dictTag?.[
          teamSaved?.[`${PREFIX}Modalidade`]?.[`${PREFIX}etiquetaid`]
        ] || null,
      temperature:
        dictTag?.[
          teamSaved?.[`${PREFIX}Temperatura`]?.[`${PREFIX}etiquetaid`]
        ] || null,
      videoConferenceBackup:
        dictTag?.[
          teamSaved?.[`_${PREFIX}ferramentavideoconferenciabackup_value`]
        ] || null,
      videoConference:
        dictTag?.[teamSaved?.[`_${PREFIX}ferramentavideoconferencia_value`]] ||
        null,
      anexos: [],
      names: teamSaved[`${PREFIX}Turma_NomeTurma`]?.length
        ? teamSaved[`${PREFIX}Turma_NomeTurma`]?.map((e) => ({
            keyId: v4(),
            id: e[`${PREFIX}nometurmaid`],
            name: e?.[`${PREFIX}nome`],
            nameEn: e?.[`${PREFIX}nomeen`],
            nameEs: e?.[`${PREFIX}nomees`],
            use: dictTag?.[e?.[`_${PREFIX}uso_value`]],
          }))
        : [
            {
              name: '',
              nameEn: '',
              nameEs: '',
              use: '',
            },
          ],
      participants: teamSaved[`${PREFIX}Turma_ParticipantesTurma`]?.length
        ? teamSaved[`${PREFIX}Turma_ParticipantesTurma`]?.map((e) => ({
            keyId: v4(),
            id: e[`${PREFIX}participantesturmaid`],
            date: e?.[`${PREFIX}data`] && moment(e?.[`${PREFIX}data`]),
            quantity: e?.[`${PREFIX}quantidade`],
            use: dictTag?.[e?.[`_${PREFIX}uso_value`]],
          }))
        : [
            {
              date: null,
              quantity: '',
              use: '',
            },
          ],
      people: teamSaved?.[`${PREFIX}Turma_PessoasEnvolvidasTurma`]?.length
        ? teamSaved?.[`${PREFIX}Turma_PessoasEnvolvidasTurma`]?.map((e) => {
            const func = dictTag[e?.[`_${PREFIX}funcao_value`]] || {};
            func.needApprove = func?.[`${PREFIX}Etiqueta_Pai`]?.some(
              (e) => e?.[`${PREFIX}nome`] === EFatherTag.NECESSITA_APROVACAO
            );
            return {
              ...e,
              keyId: v4(),
              id: e[`${PREFIX}pessoasenvolvidasturmaid`],
              person: dictPeople[e?.[`_${PREFIX}pessoa_value`]],
              function: func,
            };
          })
        : [],
    };

    const schelsByPeople = _.cloneDeep([]);
    schls.forEach((sc, i) => {
      sc.people.forEach((pe, j) => {
        schelsByPeople.push({
          ...sc,
          parentIndex: i,
          idx: j,
          blocked: j !== 0,
          peopleRender: pe,
        });
      });
    });

    setTeam([te]);
    reset({ team: [te], schedules: schelsByPeople, activities: actvs });
  };

  return {
    buildInitDate,
    temperatureOptions,
    modalityOptions,
    modalityDayOptions,
    moduleOptions,
    areaOptions,
    courseOptions,
    functionOptions,
    useOptions,
    useParticipantsOptions,
    equipmentsOptions,
    finiteResources,
    infiniteResources,
  };
};

export default useBatchEdition;
