export const BUSINESS_UNITY = 'org091f5c9b'; // PRODUÇÃO
export const BASE_URL = `https://${BUSINESS_UNITY}.crm2.dynamics.com/api/data/v9.1`;
export const REFERENCE_EVENT = 'URLEventoCalendario';
export const REFERENCE_DELETE = 'URLExclusao';
export const REFERENCE_MODEL = 'URLFluxoModelo';
export const REFERENCE_TEMPERATURE = 'URLAtualizaTemperatura';
export const BASE_URL_API_NET = 'https://consultasip.ise.org.br/';
export const ENV = 'production';
export const MOODLE_URL = 'https://isevirtualcampus.ise.org.br/moodle/webservice/rest/server.php?wstoken=6933f387d7f8cbf489750cc6e22bacbb&wsfunction=contenttype_document_get_documents&moodlewsrestformat=json';
export const TOP_QUANTITY = 10;
export var TYPE_REQUEST_MODEL;
(function (TYPE_REQUEST_MODEL) {
    TYPE_REQUEST_MODEL["CRIACAO"] = "Cria\u00E7\u00E3o";
    TYPE_REQUEST_MODEL["UTILIZACAO"] = "Utiliza\u00E7\u00E3o";
})(TYPE_REQUEST_MODEL || (TYPE_REQUEST_MODEL = {}));
export var TYPE_ORIGIN_MODEL;
(function (TYPE_ORIGIN_MODEL) {
    TYPE_ORIGIN_MODEL["PROGRAMA"] = "Programa";
    TYPE_ORIGIN_MODEL["TURMA"] = "Turma";
    TYPE_ORIGIN_MODEL["CRONOGRAMA"] = "Cronograma de Dia";
})(TYPE_ORIGIN_MODEL || (TYPE_ORIGIN_MODEL = {}));
export const ACTION_INCLUDE = 'Incluir';
export const ACTION_EDIT = 'Alterar';
export const ACTION_DELETE = 'Excluir';
export var TypeBlockUpdated;
(function (TypeBlockUpdated) {
    TypeBlockUpdated[TypeBlockUpdated["Programa"] = 0] = "Programa";
    TypeBlockUpdated[TypeBlockUpdated["Turma"] = 1] = "Turma";
    TypeBlockUpdated[TypeBlockUpdated["DiaAula"] = 2] = "DiaAula";
    TypeBlockUpdated[TypeBlockUpdated["Atividade"] = 3] = "Atividade";
})(TypeBlockUpdated || (TypeBlockUpdated = {}));
// HOMOLOGAÇÃO
export const REPORTS = {
    academicGradeOutline: '8d8d69ce-1a34-45bc-8ac1-262a0dab0db6',
    academicSessionByMonth: '92de93e2-29cd-4d35-bf36-ceafb8b57f4c',
    academicSessionByPerson: '25f66a4d-4a94-4de4-847b-287233f1fb4e',
    calendarByPerson: '38d96c30-0908-4a21-8471-bc1523de9b4b',
    calendarByRoom: '11cc1bbf-a3be-46f0-b91a-0b2cc539112c',
    criticalDays: 'd4aa143d-e019-45a7-a8c5-dd91436cc3d8',
    planningDemand: '85c14c2b-0575-40e4-b48a-117876a41e6e',
    sessions: '40d01ac9-953d-4f72-ad22-48fed7136c99',
    sintetic: '2e7c9ee3-e4a6-43e5-a8b9-2101abcd9d4f',
    weekPlanGRSA: 'ff9082a9-53c2-41cd-94f0-f800c505e873',
    followSchedule: 'eb7a7e27-d4e2-4c5d-bc46-fd4eeaa056d1',
    anualCalendar: '7c144e46-495b-43a3-bd6d-0d7cc4161e5e',
    monthlyCalendar: 'f0d2ffaf-083c-402a-8d99-0b185c67a41b',
    teacherSchedule: 'f0d2ffaf-083c-402a-8d99-0b185c67a41b',
};
//# sourceMappingURL=constants.prd.js.map