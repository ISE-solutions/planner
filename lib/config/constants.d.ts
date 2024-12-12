export declare const BUSINESS_UNITY = "org4ecd01aa";
export declare const BASE_URL: string;
export declare const REFERENCE_EVENT = "URLEventoCalendario";
export declare const REFERENCE_DELETE = "URLExclusao";
export declare const REFERENCE_MODEL = "URLFluxoModelo";
export declare const REFERENCE_TEMPERATURE = "URLAtualizaTemperatura";
export declare const BASE_URL_API_NET = "https://ise-dataverse.azurewebsites.net/";
export declare const ENV = "development";
export declare const MOODLE_URL = "https://isevirtualcampus.ise.org.br/moodle/webservice/rest/server.php?wstoken=6933f387d7f8cbf489750cc6e22bacbb&wsfunction=contenttype_document_get_documents&moodlewsrestformat=json";
export declare const TOP_QUANTITY = 10;
export declare enum TYPE_REQUEST_MODEL {
    CRIACAO = "Cria\u00E7\u00E3o",
    UTILIZACAO = "Utiliza\u00E7\u00E3o"
}
export declare enum TYPE_ORIGIN_MODEL {
    PROGRAMA = "Programa",
    TURMA = "Turma",
    CRONOGRAMA = "Cronograma de Dia"
}
export declare const ACTION_INCLUDE = "Incluir";
export declare const ACTION_EDIT = "Alterar";
export declare const ACTION_DELETE = "Excluir";
export declare enum TypeBlockUpdated {
    Programa = 0,
    Turma = 1,
    DiaAula = 2,
    Atividade = 3
}
export interface IBlockUpdated {
    type: TypeBlockUpdated;
    id: string;
    temperatureId?: string;
    changeTemperature?: boolean;
    isUndo?: boolean;
}
export declare const REPORTS: {
    academicGradeOutline: string;
    academicSessionByMonth: string;
    academicSessionByPerson: string;
    calendarByPerson: string;
    calendarByRoom: string;
    criticalDays: string;
    planningDemand: string;
    sessions: string;
    sintetic: string;
    weekPlanGRSA: string;
    followSchedule: string;
    anualCalendar: string;
    monthlyCalendar: string;
    teacherSchedule: string;
};
//# sourceMappingURL=constants.d.ts.map