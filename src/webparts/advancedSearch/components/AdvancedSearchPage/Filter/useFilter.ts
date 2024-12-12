import { useMemo } from 'react';
import type { Fields } from '@react-awesome-query-builder/material';
import { PREFIX } from '~/config/database';
import { EFatherTag, TYPE_ACTIVITY } from '~/config/enums';
import { GROUP_FILTER } from '../constants';

interface UseFilterProps {
  tags: any[];
  persons: any[];
  spaces: any[];
}

const useFilter = ({ tags, persons, spaces }: UseFilterProps) => {
  const areaOptions = useMemo(
    () =>
      tags?.filter((tg) =>
        tg?.[`${PREFIX}Etiqueta_Pai`]?.some(
          (e) => e?.[`${PREFIX}nome`] === EFatherTag.AREA_ACADEMICA
        )
      ),
    [tags]
  );

  const temperatureOptions = useMemo(
    () =>
      tags?.filter((tg) =>
        tg?.[`${PREFIX}Etiqueta_Pai`]?.some(
          (e) => e?.[`${PREFIX}nome`] === EFatherTag.TEMPERATURA_STATUS
        )
      ),
    [tags]
  );

  const functionOptions = useMemo(
    () =>
      tags?.filter((tg) =>
        tg?.[`${PREFIX}Etiqueta_Pai`]?.some(
          (e) => e?.[`${PREFIX}nome`] === EFatherTag.FUNCAO
        )
      ),
    [tags]
  );

  const moduleOptions = useMemo(
    () =>
      tags?.filter((tg) =>
        tg?.[`${PREFIX}Etiqueta_Pai`]?.some(
          (e) => e?.[`${PREFIX}nome`] === EFatherTag.MODULO
        )
      ),
    [tags]
  );

  const modalidadeDayOptions = useMemo(
    () =>
      tags?.filter((tg) =>
        tg?.[`${PREFIX}Etiqueta_Pai`]?.some(
          (e) => e?.[`${PREFIX}nome`] === EFatherTag.MODALIDADE_DIA
        )
      ),
    [tags]
  );

  const modalidadeTeamOptions = useMemo(
    () =>
      tags?.filter((tg) =>
        tg?.[`${PREFIX}Etiqueta_Pai`]?.some(
          (e) => e?.[`${PREFIX}nome`] === EFatherTag.MODALIDADE_TURMA
        )
      ),
    [tags]
  );

  const toolsOptions = useMemo(
    () =>
      tags?.filter((tg) =>
        tg?.[`${PREFIX}Etiqueta_Pai`]?.some(
          (e) =>
            e?.[`${PREFIX}nome`] === EFatherTag.FERRAMENTA_VIDEO_CONFERENCIA
        )
      ),
    [tags]
  );

  const nameProgramOptions = useMemo(
    () =>
      tags?.filter((tg) =>
        tg?.[`${PREFIX}Etiqueta_Pai`]?.some(
          (e) => e?.[`${PREFIX}nome`] === EFatherTag.NOME_PROGRAMA
        )
      ),
    [tags]
  );

  const typeProgramOptions = useMemo(
    () =>
      tags?.filter((tg) =>
        tg?.[`${PREFIX}Etiqueta_Pai`]?.some(
          (e) => e?.[`${PREFIX}nome`] === EFatherTag.TIPO_PROGRAMA
        )
      ),
    [tags]
  );

  const instituteOptions = useMemo(
    () =>
      tags?.filter((tg) =>
        tg?.[`${PREFIX}Etiqueta_Pai`]?.some(
          (e) => e?.[`${PREFIX}nome`] === EFatherTag.INSTITUTO
        )
      ),
    [tags]
  );

  const companyOptions = useMemo(
    () =>
      tags?.filter((tg) =>
        tg?.[`${PREFIX}Etiqueta_Pai`]?.some(
          (e) => e?.[`${PREFIX}nome`] === EFatherTag.EMPRESA
        )
      ),
    [tags]
  );

  const fieldsFilter = {
    [GROUP_FILTER.ATIVIDADE]: {
      'atividade.ise_nome': {
        label: 'Nome',
        type: 'text',
      },
      'atividade.ise_tipo': {
        label: 'Tipo Atividade',
        type: 'select',
        valueSources: ['value'],
        fieldSettings: {
          showSearch: true,
          listValues: [
            {
              value: TYPE_ACTIVITY.ACADEMICA,
              title: 'Acadêmica',
            },
            {
              value: TYPE_ACTIVITY.NON_ACADEMICA,
              title: 'Não Acadêmica',
            },
            {
              value: TYPE_ACTIVITY.INTERNAL,
              title: 'Interna',
            },
          ],
        },
      },
      'atividade_espaco.ise_espacoid': {
        label: 'Espaço',
        type: 'select',
        valueSources: ['value'],
        fieldSettings: {
          showSearch: true,
          listValues: spaces,
        },
      },
      'atividade.ise_areaacademica': {
        label: 'Area Acadêmica',
        type: 'select',
        valueSources: ['value'],
        fieldSettings: {
          showSearch: true,
          listValues: areaOptions,
        },
      },
      'atividade.ise_temperatura': {
        label: 'Temperatura',
        type: 'select',
        valueSources: ['value'],
        fieldSettings: {
          showSearch: true,
          listValues: temperatureOptions,
        },
      },
      'pessoa_envolvida_atividade.ise_pessoa': {
        label: 'Pessoa Envolvida',
        type: 'select',
        valueSources: ['value'],
        fieldSettings: {
          showSearch: true,
          listValues: persons,
        },
      },
      'pessoa_envolvida_atividade.ise_funcao': {
        label: 'Função Envolvida',
        type: 'select',
        valueSources: ['value'],
        fieldSettings: {
          showSearch: true,
          listValues: functionOptions,
        },
      },
      'documentos.ise_nome': {
        label: 'Documento',
        type: 'text',
      },
      'requisicao_academica.ise_descricao': {
        label: 'Requisição Acadêmica',
        type: 'text',
      },
      'atividade.ise_datahorainicio': {
        label: 'Início',
        type: 'datetime',
      },
      'atividade.ise_quantidadesessao': {
        label: 'Quantidade de sessões',
        type: 'number',
        valueSources: ['value'],
      },
      'atividade.ise_datahorafim': {
        label: 'Fim',
        type: 'datetime',
      },
      'atividade.temaaula': {
        label: 'Tema',
        type: 'text',
      },
      'cronograma.ise_data': {
        label: 'Data (Dia)',
        type: 'date',
      },
      'cronograma.ise_modulo': {
        label: 'Módulo (Dia)',
        type: 'select',
        fieldSettings: {
          showSearch: true,
          listValues: moduleOptions,
        },
      },
      'cronograma.ise_modalidade': {
        label: 'Modalidade (Dia)',
        type: 'select',
        fieldSettings: {
          showSearch: true,
          listValues: modalidadeDayOptions,
        },
      },
      'cronograma.ise_ferramenta': {
        label: 'Ferramenta (Dia)',
        type: 'multiselect',
        fieldSettings: {
          showSearch: true,
          listValues: toolsOptions,
        },
      },
      'cronograma.ise_temperatura': {
        label: 'Temperatura (Dia)',
        type: 'select',
        fieldSettings: {
          showSearch: true,
          listValues: temperatureOptions,
        },
      },
      'pessoa_envolvida_cronograma.ise_pessoa': {
        label: 'Pessoa Envolvida (Dia)',
        type: 'multiselect',
        fieldSettings: {
          showSearch: true,
          listValues: persons,
        },
      },
      'pessoa_envolvida_cronograma.ise_funcao': {
        label: 'Função Envolvida (Dia)',
        type: 'multiselect',
        fieldSettings: {
          showSearch: true,
          listValues: functionOptions,
        },
      },
      'turma.ise_nome': {
        label: 'Nome (Turma)',
        type: 'text',
      },
      'turma.ise_sigla': {
        label: 'Sigla (Turma)',
        type: 'text',
      },
      'turma.ise_codigodaturma': {
        label: 'Código Turma (Turma)',
        type: 'text',
      },
      'turma.ise_anodeconclusao': {
        label: 'Ano de Conclusão (Turma)',
        type: 'number',
      },
      'turma.ise_modalidade': {
        label: 'Modalidade (Turma)',
        type: 'select',
        fieldSettings: {
          showSearch: true,
          listValues: modalidadeTeamOptions,
        },
      },
      'participante_turma.ise_data': {
        label: 'Participantes/Data Limite (Turma)',
        type: 'date',
      },
      'participante_turma.ise_quantidade': {
        label: 'Participantes/Qtd. Prevista (Turma)',
        type: 'number',
      },
      'pessoa_envolvida_turma.ise_pessoa': {
        label: 'Pessoa Envolvida (Turma)',
        type: 'select',
        fieldSettings: {
          showSearch: true,
          listValues: persons,
        },
      },
      'pessoa_envolvida_turma.ise_funcao': {
        label: 'Função Envolvida (Turma)',
        type: 'select',
        fieldSettings: {
          showSearch: true,
          listValues: functionOptions,
        },
      },
      'programa.ise_nomeprograma': {
        label: 'Nome (Programa)',
        type: 'select',
        fieldSettings: {
          showSearch: true,
          listValues: nameProgramOptions,
        },
      },
      'programa.ise_sigla': {
        label: 'Sigla (Programa)',
        type: 'text',
      },
      'programa.ise_tipoprograma': {
        label: 'Tipo de Programa (Programa)',
        type: 'select',
        fieldSettings: {
          showSearch: true,
          listValues: typeProgramOptions,
        },
      },
      'programa.ise_instituto': {
        label: 'Instituto (Programa)',
        type: 'select',
        fieldSettings: {
          showSearch: true,
          listValues: instituteOptions,
        },
      },
      'programa.ise_empresa': {
        label: 'Empresa (Programa)',
        type: 'select',
        fieldSettings: {
          showSearch: true,
          listValues: companyOptions,
        },
      },
      'programa.ise_temperatura': {
        label: 'Temperatura (Programa)',
        type: 'select',
        fieldSettings: {
          showSearch: true,
          listValues: temperatureOptions,
        },
      },
      'pessoa_envolvida_programa.ise_pessoa': {
        label: 'Pessoa Envolvida (Programa)',
        type: 'multiselect',
        fieldSettings: {
          showSearch: true,
          listValues: persons,
        },
      },
      'pessoa_envolvida_programa.ise_funcao': {
        label: 'Função Envolvida (Programa)',
        type: 'multiselect',
        fieldSettings: {
          showSearch: true,
          listValues: functionOptions,
        },
      },
    } as Fields,
    [GROUP_FILTER.DIA]: {
      'cronograma.ise_data': {
        label: 'Data (Dia)',
        type: 'date',
      },
      'cronograma.ise_modulo': {
        label: 'Módulo (Dia)',
        type: 'select',
        fieldSettings: {
          showSearch: true,
          listValues: moduleOptions,
        },
      },
      'cronograma.ise_modalidade': {
        label: 'Modalidade (Dia)',
        type: 'select',
        fieldSettings: {
          showSearch: true,
          listValues: modalidadeDayOptions,
        },
      },
      'cronograma.ise_ferramenta': {
        label: 'Ferramenta (Dia)',
        type: 'multiselect',
        fieldSettings: {
          showSearch: true,
          listValues: toolsOptions,
        },
      },
      'cronograma.ise_temperatura': {
        label: 'Temperatura (Dia)',
        type: 'select',
        fieldSettings: {
          showSearch: true,
          listValues: temperatureOptions,
        },
      },
      'pessoa_envolvida_cronograma.ise_pessoa': {
        label: 'Pessoa Envolvida (Dia)',
        type: 'multiselect',
        fieldSettings: {
          showSearch: true,
          listValues: persons,
        },
      },
      'pessoa_envolvida_cronograma.ise_funcao': {
        label: 'Função Envolvida (Dia)',
        type: 'multiselect',
        fieldSettings: {
          showSearch: true,
          listValues: functionOptions,
        },
      },
      'turma.ise_nome': {
        label: 'Nome (Turma)',
        type: 'text',
      },
      'turma.ise_sigla': {
        label: 'Sigla (Turma)',
        type: 'text',
      },
      'turma.ise_codigodaturma': {
        label: 'Código Turma (Turma)',
        type: 'text',
      },
      'turma.ise_anodeconclusao': {
        label: 'Ano de Conclusão (Turma)',
        type: 'number',
      },
      'turma.ise_modalidade': {
        label: 'Modalidade (Turma)',
        type: 'select',
        fieldSettings: {
          showSearch: true,
          listValues: modalidadeTeamOptions,
        },
      },
      'participante_turma.ise_data': {
        label: 'Participantes/Data Limite (Turma)',
        type: 'date',
      },
      'participante_turma.ise_quantidade': {
        label: 'Participantes/Qtd. Prevista (Turma)',
        type: 'number',
      },
      'pessoa_envolvida_turma.ise_pessoa': {
        label: 'Pessoa Envolvida (Turma)',
        type: 'select',
        fieldSettings: {
          showSearch: true,
          listValues: persons,
        },
      },
      'pessoa_envolvida_turma.ise_funcao': {
        label: 'Função Envolvida (Turma)',
        type: 'select',
        fieldSettings: {
          showSearch: true,
          listValues: functionOptions,
        },
      },
      'programa.ise_nomeprograma': {
        label: 'Nome (Programa)',
        type: 'select',
        fieldSettings: {
          showSearch: true,
          listValues: nameProgramOptions,
        },
      },
      'programa.ise_sigla': {
        label: 'Sigla (Programa)',
        type: 'text',
      },
      'programa.ise_tipoprograma': {
        label: 'Tipo de Programa (Programa)',
        type: 'select',
        fieldSettings: {
          showSearch: true,
          listValues: typeProgramOptions,
        },
      },
      'programa.ise_instituto': {
        label: 'Instituto (Programa)',
        type: 'select',
        fieldSettings: {
          showSearch: true,
          listValues: instituteOptions,
        },
      },
      'programa.ise_empresa': {
        label: 'Empresa (Programa)',
        type: 'select',
        fieldSettings: {
          showSearch: true,
          listValues: companyOptions,
        },
      },
      'programa.ise_temperatura': {
        label: 'Temperatura (Programa)',
        type: 'select',
        fieldSettings: {
          showSearch: true,
          listValues: temperatureOptions,
        },
      },
      'pessoa_envolvida_programa.ise_pessoa': {
        label: 'Pessoa Envolvida (Programa)',
        type: 'multiselect',
        fieldSettings: {
          showSearch: true,
          listValues: persons,
        },
      },
      'pessoa_envolvida_programa.ise_funcao': {
        label: 'Função Envolvida (Programa)',
        type: 'multiselect',
        fieldSettings: {
          showSearch: true,
          listValues: functionOptions,
        },
      },
    },
    [GROUP_FILTER.TURMA]: {
      'turma.ise_nome': {
        label: 'Nome (Turma)',
        type: 'text',
      },
      'turma.ise_sigla': {
        label: 'Sigla (Turma)',
        type: 'text',
      },
      'turma.ise_codigodaturma': {
        label: 'Código Turma (Turma)',
        type: 'text',
      },
      'turma.ise_anodeconclusao': {
        label: 'Ano de Conclusão (Turma)',
        type: 'number',
      },
      'turma.ise_modalidade': {
        label: 'Modalidade (Turma)',
        type: 'select',
        fieldSettings: {
          showSearch: true,
          listValues: modalidadeTeamOptions,
        },
      },
      'participante_turma.ise_data': {
        label: 'Participantes/Data Limite (Turma)',
        type: 'date',
      },
      'participante_turma.ise_quantidade': {
        label: 'Participantes/Qtd. Prevista (Turma)',
        type: 'number',
      },
      'pessoa_envolvida_turma.ise_pessoa': {
        label: 'Pessoa Envolvida (Turma)',
        type: 'select',
        fieldSettings: {
          showSearch: true,
          listValues: persons,
        },
      },
      'pessoa_envolvida_turma.ise_funcao': {
        label: 'Função Envolvida (Turma)',
        type: 'select',
        fieldSettings: {
          showSearch: true,
          listValues: functionOptions,
        },
      },
      'programa.ise_nomeprograma': {
        label: 'Nome (Programa)',
        type: 'select',
        fieldSettings: {
          showSearch: true,
          listValues: nameProgramOptions,
        },
      },
      'programa.ise_sigla': {
        label: 'Sigla (Programa)',
        type: 'text',
      },
      'programa.ise_tipoprograma': {
        label: 'Tipo de Programa (Programa)',
        type: 'select',
        fieldSettings: {
          showSearch: true,
          listValues: typeProgramOptions,
        },
      },
      'programa.ise_instituto': {
        label: 'Instituto (Programa)',
        type: 'select',
        fieldSettings: {
          showSearch: true,
          listValues: instituteOptions,
        },
      },
      'programa.ise_empresa': {
        label: 'Empresa (Programa)',
        type: 'select',
        fieldSettings: {
          showSearch: true,
          listValues: companyOptions,
        },
      },
      'programa.ise_temperatura': {
        label: 'Temperatura (Programa)',
        type: 'select',
        fieldSettings: {
          showSearch: true,
          listValues: temperatureOptions,
        },
      },
      'pessoa_envolvida_programa.ise_pessoa': {
        label: 'Pessoa Envolvida (Programa)',
        type: 'multiselect',
        fieldSettings: {
          showSearch: true,
          listValues: persons,
        },
      },
      'pessoa_envolvida_programa.ise_funcao': {
        label: 'Função Envolvida (Programa)',
        type: 'multiselect',
        fieldSettings: {
          showSearch: true,
          listValues: functionOptions,
        },
      },
    },
    [GROUP_FILTER.PROGRAM]: {
      'programa.ise_nomeprograma': {
        label: 'Nome (Programa)',
        type: 'select',
        fieldSettings: {
          showSearch: true,
          listValues: nameProgramOptions,
        },
      },
      'programa.ise_sigla': {
        label: 'Sigla (Programa)',
        type: 'text',
      },
      'programa.ise_tipoprograma': {
        label: 'Tipo de Programa (Programa)',
        type: 'select',
        fieldSettings: {
          showSearch: true,
          listValues: typeProgramOptions,
        },
      },
      'programa.ise_instituto': {
        label: 'Instituto (Programa)',
        type: 'select',
        fieldSettings: {
          showSearch: true,
          listValues: instituteOptions,
        },
      },
      'programa.ise_empresa': {
        label: 'Empresa (Programa)',
        type: 'select',
        fieldSettings: {
          showSearch: true,
          listValues: companyOptions,
        },
      },
      'programa.ise_temperatura': {
        label: 'Temperatura (Programa)',
        type: 'select',
        fieldSettings: {
          showSearch: true,
          listValues: temperatureOptions,
        },
      },
      'pessoa_envolvida_programa.ise_pessoa': {
        label: 'Pessoa Envolvida (Programa)',
        type: 'multiselect',
        fieldSettings: {
          showSearch: true,
          listValues: persons,
        },
      },
      'pessoa_envolvida_programa.ise_funcao': {
        label: 'Função Envolvida (Programa)',
        type: 'multiselect',
        fieldSettings: {
          showSearch: true,
          listValues: functionOptions,
        },
      },
    },
  };

  return {
    fieldsFilter,
  };
};

export default useFilter;
