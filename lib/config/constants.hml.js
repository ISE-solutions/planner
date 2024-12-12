export const BUSINESS_UNITY = 'org3bd4c44c'; // HOMOLOGAÇÃO
export const BASE_URL = `https://${BUSINESS_UNITY}.crm2.dynamics.com/api/data/v9.1`;
export const REFERENCE_EVENT = 'URLEventoCalendario';
export const REFERENCE_DELETE = 'URLExclusao';
export const REFERENCE_MODEL = 'URLFluxoModelo';
export const REFERENCE_TEMPERATURE = 'URLAtualizaTemperatura';
export const BASE_URL_API_NET = 'https://ise-dataverse.azurewebsites.net/';
export const ENV = 'homolog';
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
    academicGradeOutline: 'b432e040-07f3-4efc-8142-edeff3acb8aa',
    academicSessionByMonth: '08473f24-22ac-4ce3-a45b-6d17eadf5c10',
    academicSessionByPerson: 'b894fad1-efb5-46f7-b0c9-3204381d7b9a',
    calendarByPerson: '1ff8316e-5b3e-4109-aa82-0e4d3955ad20',
    calendarByRoom: '56861919-c882-4025-b14f-5ae2ed39c442',
    criticalDays: '675c40e0-9433-42fd-b693-a2c1dd31de27',
    planningDemand: 'bbc9547f-04aa-4f75-9f49-3de23ffcdaf0',
    sessions: '40d01ac9-953d-4f72-ad22-48fed7136c99',
    sintetic: '9f00f43d-9d1d-4fa3-8706-6dd337d86e18',
    weekPlanGRSA: 'dd335ec2-a30c-4372-82a5-c3f345740364',
    followSchedule: 'f31b15a1-819e-41cc-9c6e-58b1a2fd1df3',
    anualCalendar: '7c144e46-495b-43a3-bd6d-0d7cc4161e5e',
    monthlyCalendar: 'cb23a76e-f340-49e2-8a66-ffcb8fed81b9',
    teacherSchedule: '3c7c1dab-bbfd-4a1e-86b2-37afd926795b',
};
//# sourceMappingURL=constants.hml.js.map