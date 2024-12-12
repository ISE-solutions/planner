export const BUSINESS_UNITY = 'org4ecd01aa';
export const BASE_URL = `https://${BUSINESS_UNITY}.crm2.dynamics.com/api/data/v9.1`;
export const REFERENCE_EVENT = 'URLEventoCalendario';
export const REFERENCE_DELETE = 'URLExclusao';
export const REFERENCE_MODEL = 'URLFluxoModelo';
export const REFERENCE_TEMPERATURE = 'URLAtualizaTemperatura';
export const BASE_URL_API_NET = 'https://ise-dataverse.azurewebsites.net/';
// export const BASE_URL_API_NET = 'https://localhost:7158/';
export const ENV = 'development';
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
// DESENVOLVIMENTO
export const REPORTS = {
    academicGradeOutline: 'f3c68bd4-38e7-443f-a6ed-38f7e2a59205',
    academicSessionByMonth: '5ac25640-0b24-40ff-bda4-fe200386bc6b',
    academicSessionByPerson: '33eb2dd9-2d19-4015-909c-224de5983567',
    calendarByPerson: 'f247877c-49d4-4393-9c1c-b016a1e0e617',
    calendarByRoom: 'e066bfc4-3611-4369-9e7d-f73c495d68ab',
    criticalDays: '8d1292c3-1446-4650-85ee-88a350818064',
    planningDemand: '5bd6a4d8-5926-4793-a0f3-438fb240dcfd',
    sessions: '0e4fe93f-2b34-4f18-98e9-eb4d0ad0a560',
    sintetic: '7494f0f9-bcbe-49a9-b326-a334f0593da7',
    weekPlanGRSA: '7de6de2e-fa80-4667-ace1-e96fdb6b2d48',
    followSchedule: 'a3e82397-b0cb-451c-8059-f6d9671ca64b',
    anualCalendar: 'a0e5fb80-f385-43d7-a948-ff6eb587b352',
    monthlyCalendar: 'a3e82397-b0cb-451c-8059-f6d9671ca64b',
    teacherSchedule: '79578569-b82a-4a66-95f0-9e81fb72ae40',
};
//# sourceMappingURL=constants.js.map