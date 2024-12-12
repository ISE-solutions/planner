import { IFilterProps } from './utils';
export declare const fetchAllTeams: (filter: IFilterProps) => any;
export declare const fetchAdvancedTeams: (filter: string) => any;
export declare const getTeams: (filter: IFilterProps) => any;
export declare const getTeamById: (teamId: any) => Promise<any>;
export declare const getTeamByIds: (teamIds: string[]) => Promise<any>;
export declare const getTeamByNameAndProgram: (name: any, programId: any) => Promise<unknown>;
export declare const addOrUpdateTeam: (team: any, programId: any, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}, temperatureChanged?: boolean, isUndo?: boolean) => any;
export declare const updateEnvolvedPerson: (id: any, teamId: any, toSave: any, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}) => any;
export declare const deleteTeam: (teamId: string, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}) => any;
export declare const updateTeam: (id: any, toSave: any, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}) => Promise<unknown>;
export declare const uploadTeamFiles: (team: any, teamId: any, context: any) => Promise<unknown>;
//# sourceMappingURL=actions.d.ts.map