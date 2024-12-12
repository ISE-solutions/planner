import * as React from 'react';
import { MaterialConfig } from '@react-awesome-query-builder/material';
import { TextField } from '@material-ui/core';

const InitialConfig = MaterialConfig;

const CustomTextWidget = (props) => {
  const handleChange = (e) => {
    let value = e.target.value;

    value = value.toUpperCase();
    props.setValue(value);
  };

  return <TextField {...props} onChange={handleChange} />;
};

export const FILTER_CONFIG_DEFAULT = {
  ...InitialConfig,
  settings: {
    ...InitialConfig.settings,
    showNot: false,
    addRuleLabel: 'Adicionar Regra',
    addSubRuleLabel: 'Adicionar Regra',
    addGroupLabel: 'Adicionar Grupo',
    fieldLabel: 'Campo',
    notLabel: 'Não',
    fieldPlaceholder: 'Selecione um valor',
    valueLabel: 'Valor',
    valuePlaceholder: 'Valor',
    operatorLabel: 'Operador',
    funcLabel: 'Função',
    funcPlaceholder: 'Selecione uma Função',
    operatorPlaceholder: 'Selecione um operador',
    lockLabel: 'Bloqueie',
    lockedLabel: 'Bloqueado',
    deleteLabel: 'Excluir',
    addCaseLabel: 'Adicionar Condição',
    addDefaultCaseLabel: 'Adicionar Condição Padrão',
    defaultCaseLabel: 'Padrão:',
    delGroupLabel: 'Excluir',
    fieldSourcesPopupTitle: 'Selecione a fonte',
    valueSourcesPopupTitle: 'Selecione valor da fonte',
  },
  operators: {
    ...InitialConfig.operators,
    like: {
      ...InitialConfig.operators.like,
      label: 'Contém',
    },
    not_like: {
      ...InitialConfig.operators.not_like,
      label: 'Não contém',
    },
    starts_with: {
      ...InitialConfig.operators.starts_with,
      label: 'Inicia com',
    },
    ends_with: {
      ...InitialConfig.operators.ends_with,
      label: 'Finaliza com',
    },
    between: {
      ...InitialConfig.operators.between,
      label: 'Entre',
      valueLabels: ['De', 'Para'],
      textSeparators: [null, 'e'],
    },
    not_between: {
      ...InitialConfig.operators.not_between,
      label: 'Não entre',
      valueLabels: ['De', 'Para'],
      textSeparators: [null, 'e'],
    },
    is_empty: {
      ...InitialConfig.operators.is_empty,
      label: 'Vazio',
    },
    is_not_empty: {
      ...InitialConfig.operators.is_not_empty,
      label: 'Não vazio',
    },
    is_null: {
      ...InitialConfig.operators.is_null,
      label: 'Nulo',
    },
    is_not_null: {
      ...InitialConfig.operators.is_not_null,
      label: 'Não nulo',
    },
    select_any_in: {
      ...InitialConfig.operators.select_any_in,
      label: 'Qualquer em',
    },
    select_not_any_in: {
      ...InitialConfig.operators.select_not_any_in,
      label: 'Não qualquer em',
    },
    multiselect_contains: {
      ...InitialConfig.operators.multiselect_contains,
      label: 'Contém',
    },
    multiselect_not_contains: {
      ...InitialConfig.operators.multiselect_not_contains,
      label: 'Não contém',
    },
    multiselect_equals: {
      ...InitialConfig.operators.multiselect_equals,
      label: 'Igual',
    },
    multiselect_not_equals: {
      ...InitialConfig.operators.multiselect_not_equals,
      label: 'Não igual',
    },
    proximity: {
      ...InitialConfig.operators.proximity,
      label: 'Proximidade busca',
    },
  },
  widgets: {
    ...InitialConfig.widgets,
    text: {
      ...InitialConfig.widgets.text,
      factory: (props) => <CustomTextWidget {...props} />,
      labelNo: 'Não',
      labelYes: 'Sim',
      valueLabel: 'Valor',
      valuePlaceholder: 'Digite um valor',
    },
    textarea: {
      ...InitialConfig.widgets.textarea,
      labelNo: 'Não',
      labelYes: 'Sim',
      valueLabel: 'Valor',
      valuePlaceholder: 'Digite um texto',
    },
    number: {
      ...InitialConfig.widgets.number,
      labelNo: 'Não',
      labelYes: 'Sim',
      valueLabel: 'Valor',
      valuePlaceholder: 'Digite um número',
    },
    select: {
      ...InitialConfig.widgets.select,
      labelNo: 'Não',
      labelYes: 'Sim',
      valueLabel: 'Valor',
      valuePlaceholder: 'Selecione um valor',
    },
    multiselect: {
      ...InitialConfig.widgets.multiselect,
      labelNo: 'Não',
      labelYes: 'Sim',
      valueLabel: 'Valor',
      valuePlaceholder: 'Selecione um valor',
    },
    date: {
      ...InitialConfig.widgets.date,
      labelNo: 'Não',
      labelYes: 'Sim',
      valueLabel: 'Valor',
      dateFormat: 'DD/MM/YYYY',
      // valueFormat: 'DD/MM/YYYY',
      valuePlaceholder: 'Selecione uma data',
      valueLabels: [
        { label: 'De', placeholder: 'De' },
        { label: 'Até', placeholder: 'Até' },
      ],
    },
    time: {
      ...InitialConfig.widgets.time,
      labelNo: 'Não',
      labelYes: 'Sim',
      valueLabel: 'Valor',
      valuePlaceholder: 'Selecione um valor',
      valueLabels: [
        { label: 'De', placeholder: 'De' },
        { label: 'Até', placeholder: 'Até' },
      ],
    },
    datetime: {
      ...InitialConfig.widgets.datetime,
      labelNo: 'Não',
      labelYes: 'Sim',
      valueLabel: 'Valor',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: 'HH:mm',
      valuePlaceholder: 'Selecione um valor',
      valueLabels: [
        { label: 'De', placeholder: 'De' },
        { label: 'Até', placeholder: 'Até' },
      ],
    },
    boolean: {
      ...InitialConfig.widgets.boolean,
      labelNo: 'Não',
      labelYes: 'Sim',
      valueLabel: 'Valor',
    },
  },
  conjunctions: {
    ...InitialConfig.conjunctions,
    AND: {
      ...InitialConfig.conjunctions.AND,
      label: 'E',
    },
    OR: {
      ...InitialConfig.conjunctions.OR,
      label: 'Ou',
    },
  },
};

export const FILTER_CONFIG_ADVANCED_SEARCH_DEFAULT = {
  ...FILTER_CONFIG_DEFAULT,
  widgets: {
    ...FILTER_CONFIG_DEFAULT.widgets,
    text: {
      ...InitialConfig.widgets.text,
      labelNo: 'Não',
      labelYes: 'Sim',
      valueLabel: 'Valor',
      valuePlaceholder: 'Digite um valor',
    },
  },
};
