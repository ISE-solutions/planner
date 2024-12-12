export enum EFatherTag {
  ALERTA = 'Alerta',
  FUNCAO = 'Função',
  TITULO = 'Título',
  PADRAO = 'Padrão',
  BLOCO = 'Bloco',
  ATIVIDADE = 'Atividade',
  RESPONSAVEL_PELO_PROGRAMA = 'Responsável pelo Programa',
  RECURSO_INFINITOS = 'Recurso Infinitos',
  RECURSO_FINITOS = 'Recurso Finitos',
  AREA_ACADEMICA = 'Área Acadêmica',
  EQUIPAMENTO_OUTROS = 'Equipamentos/Outros',
  TIPO_PROGRAMA = 'Tipo do Programa',
  NOME_PROGRAMA = 'Nome do Programa',
  INSTITUTO = 'Instituto',
  EMPRESA = 'Empresa',
  TEMPERATURA_STATUS = 'Temperatura/Status',
  MODALIDADE_TURMA = 'Modalidade Turma',
  MODALIDADE_DIA = 'Modalidade Dia',
  ESCOLA_ORIGEM = 'Escola Origem',
  FERRAMENTA_VIDEO_CONFERENCIA = 'Ferramenta de videoconferência',
  MODULO = 'Módulo',
  TIPO_ESPACO = 'Tipo Espaço',

  PROFESSOR = 'Professor',
  PLANEJAMENTO = 'Planejamento',
  DIRETOR_ACADEMICO = 'Diretor Acadêmico',
  DIRETOR_PROGRAMA = 'Diretor do Programa',
  PRODUTOR_MATERIAIS = 'Produção de Materiais',
  COORDENACAO_ACADEMICA = 'Coordenação Acadêmica',
  RESPONSAVEL_PELA_OPERACAO = 'Responsável pela operação',
  COORDENACAO_ATENDIMENTO = 'Coordenação de atendimento',
  DIRECAO_PROGRAMA_DE_ATENDIMENTO = 'Direção de programa de atendimento',
  COORDENACAO_ADMISSOES = 'Coordenação de Admissões',
  ADMISSOES = 'Admissões',
  FINANCEIRO = 'Financeiro',
  QUANTIDADE_TURMA = 'Quantidade Turma',

  RASCUNHO = 'Rascunho',
  RESERVA = 'Reserva',
  CONTRATADO = 'Contratado',
  PREPARADO = 'Preparado',

  NECESSITA_APROVACAO = 'Necessita Aprovação',
  USO_RELATORIO = 'Uso Relatório',
  USO_PARTICIPANTE = 'Uso Participante',
  RELATORIO_HORARIO = 'Título para Horário',
  CLASS_LOCALE = 'Local de Aula',
  COURSE = 'Curso',
}

export enum ETypeTag {
  PROPRIETARIO = 'Proprietário',
  RESPONSAVEL_PELO_PROGRAMA = 'Responsável pelo programa',
  DIRECAO_DO_PROGRAMA = 'Direção do programa',
}

export enum ETYPE_CUSTOM_FILTER {
  TASK = 'Task',
}

export enum EGroups {
  PLANEJAMENTO = 'Planejamento',
  ADMISSOES = 'Admissões',
}

export enum EActivityTypeApplication {
  PLANEJAMENTO = 'planejamento',
  AGRUPAMENTO = 'agrupamento',
  MODELO = 'modelo',
  MODELO_REFERENCIA = 'modelo_referencia',
  APLICACAO = 'aplicacao',
}

export enum EUso {
  PADRAO = 'Padrão',
  RELATORIO_HORARIO = 'Relatório Horário',
  RELATORIO_PROGRAMA = 'Relatório Programa',
}

export enum EDeliveryType {
  PRE_SESSAO = 'Pré-sessão',
  DURANTE_SESSAO = 'Durante sessão',
  POS_SESSAO = 'Pós-sessão',
}

export enum ELanguage {
  'pt-BR' = 'Português',
  'en-US' = 'English',
  'es-ES' = 'Español',
}

export enum TYPE_TASK {
  CONSTRUCAO_BLOCO = 'Construção de Blocos',
  REQUISICAO_ACADEMICA = 'Requisição Acadêmica',
  PLANEJAMENTO = 'Planejamento',
}

export enum STATUS_TASK {
  'Não Iniciada' = 863110000,
  'Em Andamento' = 863110001,
  'Concluído' = 863110002,
}

export enum PRIORITY_TASK {
  'Baixa' = 863110000,
  'Média' = 863110001,
  'Importante' = 863110002,
  'Urgente' = 863110003,
}

export enum TYPE_ACTIVITY {
  ACADEMICA = 'academica',
  NON_ACADEMICA = 'nao_academica',
  INTERNAL = 'interna',
}

export const TYPE_ACTIVITY_LABEL = {
  [TYPE_ACTIVITY.ACADEMICA]: 'Acadêmica',
  [TYPE_ACTIVITY.NON_ACADEMICA]: 'Não Acadêmica',
  [TYPE_ACTIVITY.INTERNAL]: 'Interna',
};

export enum TYPE_RESOURCE {
  FINITO = 'finito',
  INFINITO = 'infinito',
}
